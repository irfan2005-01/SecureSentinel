from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from .database import Base


class FileRecord(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    sha256 = Column(String, nullable=False)
    status = Column(String, default="Verified")
    uploaded_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String)
    filename = Column(String)
    status = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)