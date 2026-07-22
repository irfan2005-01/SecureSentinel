from fastapi import FastAPI, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.responses import FileResponse
from app.services.report_generator import generate_report
from app.auth.auth import router as auth_router

from app.database.database import Base, engine, get_db
from app.database.models import FileRecord, AuditLog
from app.services.verifier import calculate_sha256
from app.auth.security import get_current_user


import hashlib
import os


app = FastAPI()
app.include_router(auth_router)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def root():
    return {
        "project": "SecureSentinel",
        "status": "Running"
    }


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
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


@app.post("/verify")
async def verify_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
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


@app.get("/logs")
def get_logs(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return (
        db.query(AuditLog)
        .order_by(AuditLog.timestamp.desc())
        .all()
    )


@app.get("/alerts")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    return (
        db.query(AuditLog)
        .filter(AuditLog.status == "Tampered")
        .order_by(AuditLog.timestamp.desc())
        .all()
    )


@app.get("/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    total_files = db.query(FileRecord).count()

    verified = (
        db.query(AuditLog)
        .filter(AuditLog.status == "Verified")
        .count()
    )

    tampered = (
        db.query(AuditLog)
        .filter(AuditLog.status == "Tampered")
        .count()
    )

    if tampered == 0:
        risk = "Low"
    elif tampered <= 5:
        risk = "Medium"
    else:
        risk = "High"

    return {
        "total_files": total_files,
        "verified": verified,
        "tampered": tampered,
        "risk": risk,
    }
@app.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.action == "UPLOAD")
        .order_by(AuditLog.timestamp.desc())
        .limit(7)
        .all()
    )

    logs.reverse()

    chart = []

    for i, log in enumerate(logs, start=1):
        chart.append({
            "upload": f"#{i}",
            "uploads": i,
            "filename": log.filename,
        })

    return {
        "chart": chart
    }
@app.get("/report/{filename}")
def download_report(
    filename: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    record = (
        db.query(FileRecord)
        .filter(FileRecord.filename == filename)
        .first()
    )

    if not record:
        return {
            "message": "File not found"
        }

    report_dir = "reports"
    os.makedirs(report_dir, exist_ok=True)

    pdf_path = os.path.join(
        report_dir,
        f"{filename}.pdf"
    )

    generate_report(
        filename=record.filename,
        sha256=record.sha256,
        status=record.status,
        output_path=pdf_path,
    )

    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=f"{filename}_Verification_Report.pdf",
    )