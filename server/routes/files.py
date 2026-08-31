import os
import re
import uuid
import hashlib
import tempfile
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, FileRecord, AuditLog
from server.auth.security import get_current_user
from server.storage.factory import get_storage_provider

router = APIRouter()

CHUNK_SIZE = 1024 * 1024 # 1MB safe memory buffer


def sanitize_filename(filename: Optional[str]) -> str:
    """
    Sanitizes filenames to prevent Path Traversal, OS command injection, and special character issues.
    Gracefully handles mobile camera uploads, URI encoded names, and extensionless assets.
    """
    if not filename or not filename.strip():
        return f"mobile_asset_{uuid.uuid4().hex[:6]}.bin"
    clean_name = Path(filename).name
    clean_name = re.sub(r'[\r\n\0]', '', clean_name)
    clean_name = re.sub(r'[^a-zA-Z0-9._\-+ ]', '_', clean_name)
    clean_name = clean_name.strip(" ._")
    return clean_name or f"asset_{uuid.uuid4().hex[:6]}.bin"


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    safe_filename = sanitize_filename(file.filename)
    file_uuid = uuid.uuid4().hex
    stored_filename = f"{file_uuid}_{safe_filename}"

    # Resolve active cloud storage provider
    provider_name = current_user.active_cloud_provider or "local"
    storage_config = current_user.get_storage_config()
    
    try:
        storage_driver = get_storage_provider(provider_name, storage_config)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Storage driver initialization failed: {str(e)}",
        )

    hasher = hashlib.sha256()
    total_size = 0

    # Stream in safe 1MB chunks to a spool/temp file to prevent memory exhaustion (DoS)
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
            tmp_path = tmp_file.name
            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                hasher.update(chunk)
                total_size += len(chunk)
                tmp_file.write(chunk)
            tmp_file.flush()

        sha256_hash = hasher.hexdigest()

        # Upload stream to storage provider
        with open(tmp_path, "rb") as f_read:
            stored_path = storage_driver.upload_file(f_read, stored_filename)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"File storage upload failed: {str(e)}",
        )
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except Exception:
                pass

    # Check if a record exists for this user and filename
    existing = (
        db.query(FileRecord)
        .filter(FileRecord.user_id == current_user.id, FileRecord.filename == safe_filename)
        .first()
    )

    if existing:
        if existing.storage_path != stored_path:
            try:
                storage_driver.delete_file(existing.storage_path)
            except Exception:
                pass
        safe_mime = (file.content_type or "application/octet-stream")[:250]
        existing.stored_filename = stored_filename
        existing.storage_provider = provider_name
        existing.storage_path = stored_path
        existing.file_size = total_size
        existing.mime_type = safe_mime
        existing.sha256 = sha256_hash
        existing.status = "Verified"
        record = existing
    else:
        safe_mime = (file.content_type or "application/octet-stream")[:250]
        record = FileRecord(
            user_id=current_user.id,
            filename=safe_filename,
            stored_filename=stored_filename,
            storage_provider=provider_name,
            storage_path=stored_path,
            file_size=total_size,
            mime_type=safe_mime,
            sha256=sha256_hash,
            status="Verified",
        )
        db.add(record)

    log = AuditLog(
        user_id=current_user.id,
        action="UPLOAD",
        filename=safe_filename,
        status="Success",
        details=f"Uploaded to {provider_name.upper()} ({total_size} bytes, SHA-256: {sha256_hash[:8]}...)",
    )
    db.add(log)
    db.commit()
    db.refresh(record)

    return {
        "message": "Upload successful",
        "id": record.id,
        "filename": record.filename,
        "stored_filename": record.stored_filename,
        "storage_provider": record.storage_provider,
        "file_size": record.file_size,
        "sha256": record.sha256,
        "status": record.status,
    }


@router.get("/")
@router.get("/list")
def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    files = (
        db.query(FileRecord)
        .filter(FileRecord.user_id == current_user.id)
        .order_by(FileRecord.uploaded_at.desc())
        .all()
    )
    return files


@router.get("/{file_id}/download")
def download_file_by_id(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(FileRecord)
        .filter(FileRecord.id == file_id, FileRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found",
        )

    storage_driver = get_storage_provider(
        record.storage_provider, current_user.get_storage_config()
    )

    try:
        data = storage_driver.download_file(record.storage_path)
        return Response(
            content=data,
            media_type=record.mime_type or "application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="{record.filename}"'
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve file from storage: {str(e)}",
        )


@router.get("/download/{storage_path:path}")
def download_file_by_path(
    storage_path: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(FileRecord)
        .filter(FileRecord.storage_path == storage_path, FileRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File record not found",
        )

    storage_driver = get_storage_provider(
        record.storage_provider, current_user.get_storage_config()
    )

    try:
        data = storage_driver.download_file(record.storage_path)
        return Response(
            content=data,
            media_type=record.mime_type or "application/octet-stream",
            headers={
                "Content-Disposition": f'attachment; filename="{record.filename}"'
            },
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve file: {str(e)}",
        )


@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(FileRecord)
        .filter(FileRecord.id == file_id, FileRecord.user_id == current_user.id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File record not found",
        )

    storage_driver = get_storage_provider(
        record.storage_provider, current_user.get_storage_config()
    )
    try:
        storage_driver.delete_file(record.storage_path)
    except Exception:
        pass

    filename = record.filename
    db.delete(record)

    log = AuditLog(
        user_id=current_user.id,
        action="DELETE",
        filename=filename,
        status="Success",
        details=f"Deleted file {filename} from storage",
    )
    db.add(log)
    db.commit()

    return {"message": f"File '{filename}' successfully deleted"}
