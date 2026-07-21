from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import FileRecord, AuditLog

import hashlib
import os

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    file_bytes = await file.read()

    sha256 = hashlib.sha256(file_bytes).hexdigest()

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(file_bytes)

    existing = (
        db.query(FileRecord)
        .filter(FileRecord.filename == file.filename)
        .first()
    )

    if existing:
        existing.sha256 = sha256
        existing.status = "Verified"
    else:
        record = FileRecord(
            filename=file.filename,
            sha256=sha256,
            status="Verified",
        )
        db.add(record)

    db.commit()

    log = AuditLog(
        action="UPLOAD",
        filename=file.filename,
        status="Success",
    )

    db.add(log)
    db.commit()

    return {
        "message": "Upload successful",
        "filename": file.filename,
        "sha256": sha256,
        "status": "Verified",
    }