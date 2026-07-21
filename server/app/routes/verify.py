from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import FileRecord, AuditLog
from app.services.verifier import calculate_sha256

router = APIRouter()


@router.post("/verify")
async def verify_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_bytes = await file.read()

    current_hash = calculate_sha256(file_bytes)

    record = (
        db.query(FileRecord)
        .filter(FileRecord.filename == file.filename)
        .first()
    )

    if not record:
        return {
            "status": "Not Found",
            "message": "No record found for this file."
        }

    if current_hash == record.sha256:

        log = AuditLog(
            action="VERIFY",
            filename=file.filename,
            status="Verified",
        )

        db.add(log)
        db.commit()

        return {
            "status": "Verified",
            "message": "File integrity verified.",
            "filename": file.filename,
            "sha256": current_hash,
        }

    log = AuditLog(
        action="VERIFY",
        filename=file.filename,
        status="Tampered",
    )

    db.add(log)
    db.commit()

    return {
        "status": "Tampered",
        "message": "WARNING! File has been modified.",
        "filename": file.filename,
        "sha256": current_hash,
    }