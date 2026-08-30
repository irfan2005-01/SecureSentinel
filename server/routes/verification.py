import os
import hashlib
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, FileRecord, AuditLog
from server.auth.security import get_current_user
from server.services.report_generator import generate_report

router = APIRouter()

CHUNK_SIZE = 1024 * 1024 # 1MB safe memory buffer


@router.post("/")
@router.post("/verify")
async def verify_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    safe_filename = Path(file.filename or "unknown").name
    hasher = hashlib.sha256()

    # Stream in memory-safe chunks
    while True:
        chunk = await file.read(CHUNK_SIZE)
        if not chunk:
            break
        hasher.update(chunk)

    current_hash = hasher.hexdigest()

    # Query file record for current user by exact filename (latest upload first)
    record = (
        db.query(FileRecord)
        .filter(
            FileRecord.user_id == current_user.id,
            FileRecord.filename == safe_filename,
        )
        .order_by(FileRecord.uploaded_at.desc())
        .first()
    )

    if not record:
        log = AuditLog(
            user_id=current_user.id,
            action="VERIFY",
            filename=safe_filename,
            status="Not Found",
            details=f"Verification attempted for unregistered file '{safe_filename}' (SHA: {current_hash[:8]}...)",
        )
        db.add(log)
        db.commit()

        return {
            "status": "Not Found",
            "message": f"No baseline cryptographic record found for '{safe_filename}' in your vault.",
            "filename": safe_filename,
            "sha256": current_hash,
        }

    if current_hash.lower() == record.sha256.lower():
        record.status = "Verified"
        log = AuditLog(
            user_id=current_user.id,
            action="VERIFY",
            filename=safe_filename,
            status="Verified",
            details=f"Cryptographic match confirmed for {safe_filename} (SHA: {current_hash[:8]}...)",
        )
        db.add(log)
        db.commit()

        return {
            "status": "Verified",
            "message": "File integrity verified. SHA-256 matches the stored cryptographic signature.",
            "filename": record.filename,
            "file_id": record.id,
            "sha256": current_hash,
            "stored_hash": record.sha256,
            "storage_provider": record.storage_provider,
        }

    # Hash mismatch -> Tampered!
    record.status = "Tampered"
    log = AuditLog(
        user_id=current_user.id,
        action="VERIFY",
        filename=safe_filename,
        status="Tampered",
        details=f"SECURITY ALERT! File '{safe_filename}' hash mismatch (Expected: {record.sha256[:8]}..., Got: {current_hash[:8]}...)",
    )
    db.add(log)
    db.commit()

    return {
        "status": "Tampered",
        "message": "WARNING! Cryptographic signature mismatch. The file content has been altered or tampered with.",
        "filename": safe_filename,
        "file_id": record.id,
        "sha256": current_hash,
        "expected_sha256": record.sha256,
        "storage_provider": record.storage_provider,
    }


@router.get("/report/id/{file_id}")
def download_verification_report_by_id(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = (
        db.query(FileRecord)
        .filter(
            FileRecord.user_id == current_user.id,
            FileRecord.id == file_id,
        )
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No record found for file ID {file_id}",
        )

    report_dir = Path("reports")
    report_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = str(report_dir / f"{record.id}_{record.filename}_report.pdf")

    generate_report(
        filename=record.filename,
        sha256=record.sha256,
        status=record.status,
        output_path=pdf_path,
        storage_provider=record.storage_provider,
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{record.filename}_Verification_Report.pdf",
    )


@router.get("/report/{filename:path}")
def download_verification_report(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    safe_name = Path(filename).name
    record = (
        db.query(FileRecord)
        .filter(
            FileRecord.user_id == current_user.id,
            FileRecord.filename == safe_name,
        )
        .order_by(FileRecord.uploaded_at.desc())
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No record found for file '{safe_name}'",
        )

    report_dir = Path("reports")
    report_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = str(report_dir / f"{record.id}_{safe_name}_report.pdf")

    generate_report(
        filename=record.filename,
        sha256=record.sha256,
        status=record.status,
        output_path=pdf_path,
        storage_provider=record.storage_provider,
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{record.filename}_Verification_Report.pdf",
    )

