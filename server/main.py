import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Ensure server directory is in sys.path
BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

load_dotenv()

from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from server.database import Base, engine, SessionLocal, get_db
from server.routes import auth, files, verification, analytics, storage_config
from server.models import User
from server.auth.security import hash_password

# Initialize database and default admin user
Base.metadata.create_all(bind=engine)

def seed_admin_user():
    db = SessionLocal()
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            admin = User(
                username="admin",
                email="admin@securesentinel.local",
                hashed_password=hash_password("admin123"),
                active_cloud_provider="local",
                storage_config="{}",
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()

seed_admin_user()

app = FastAPI(
    title="SecureSentinel API",
    description="Enterprise File Integrity Monitoring & Multi-Cloud Storage Security Platform",
    version="2.0.0",
)

# Configure CORS - Allow all origins dynamically with credentials for Brave and mobile browsers
origins_str = os.getenv("CORS_ORIGINS", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if origins_str.strip() == "*" else [o.strip() for o in origins_str.split(",") if o.strip()],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Ensure runtime directories exist
os.makedirs("uploads", exist_ok=True)
os.makedirs("reports", exist_ok=True)

# Register modular routers with standard prefixes
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(files.router, prefix="/api/files", tags=["File Management"])
app.include_router(verification.router, prefix="/api/verify", tags=["Integrity Verification"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics & Logs"])
app.include_router(storage_config.router, prefix="/api/storage", tags=["Cloud Storage Providers"])

# Legacy Route Aliases for backwards compatibility with previous clients
app.include_router(auth.router, tags=["Legacy Auth"])
app.include_router(analytics.router, tags=["Legacy Analytics"])

@app.post("/upload", tags=["Legacy Upload"])
async def legacy_upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return await files.upload_file(file=file, db=db, current_user=current_user)

@app.post("/verify", tags=["Legacy Verify"])
async def legacy_verify(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return await verification.verify_file(file=file, db=db, current_user=current_user)

@app.get("/report/{filename:path}", tags=["Legacy Report"])
def legacy_report(
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return verification.download_verification_report(filename=filename, db=db, current_user=current_user)


@app.get("/")
def root():
    return {
        "project": "SecureSentinel",
        "version": "2.0.0",
        "status": "Running",
        "description": "Multi-Cloud File Integrity & Security Monitoring Engine",
        "supported_storage": ["Local Vault", "AWS S3", "Google Cloud Storage", "Azure Blob Storage"],
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host="0.0.0.0", port=8000, reload=True)
