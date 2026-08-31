import json
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from server.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(150), default="")
    organization = Column(String(150), default="")
    phone_number = Column(String(50), default="")
    bio = Column(Text, default="")
    avatar_url = Column(String(500), default="")
    active_cloud_provider = Column(String(50), default="local")
    preferred_cloud_provider = Column(String(50), default="local")
    storage_config = Column(Text, default="{}") # Stored as JSON string
    created_at = Column(DateTime, default=utc_now)

    files = relationship("FileRecord", back_populates="owner", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user", cascade="all, delete-orphan")

    def get_storage_config(self) -> dict:
        try:
            return json.loads(self.storage_config or "{}")
        except Exception:
            return {}

    def set_storage_config(self, config_dict: dict):
        self.storage_config = json.dumps(config_dict or {})


class FileRecord(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    filename = Column(String(255), nullable=False, index=True)
    stored_filename = Column(String(255), nullable=False)
    storage_provider = Column(String(50), default="local")
    storage_path = Column(String(512), nullable=False)
    file_size = Column(Integer, default=0)
    mime_type = Column(String(255), default="application/octet-stream")
    sha256 = Column(String(64), nullable=False, index=True)
    status = Column(String(50), default="Verified")
    uploaded_at = Column(DateTime, default=utc_now)

    owner = relationship("User", back_populates="files")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    action = Column(String(50), nullable=False)
    filename = Column(String(255), nullable=True)
    status = Column(String(50), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=utc_now, index=True)

    user = relationship("User", back_populates="audit_logs")
