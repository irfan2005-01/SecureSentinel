from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from server.database import get_db, engine
from server.models import User, FileRecord, AuditLog
from server.auth.security import get_current_user, get_current_user_optional
from server.storage.factory import get_storage_provider

router = APIRouter()


@router.get("/stats")
def get_user_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total_files = (
        db.query(FileRecord)
        .filter(FileRecord.user_id == current_user.id)
        .count()
    )

    verified_count = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id, AuditLog.status == "Verified")
        .count()
    )

    tampered_count = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id, AuditLog.status == "Tampered")
        .count()
    )

    total_uploads = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id, AuditLog.action == "UPLOAD")
        .count()
    )

    # Dynamic risk assessment calculation
    if tampered_count == 0:
        risk = "Low"
    elif tampered_count <= 2:
        risk = "Medium"
    elif tampered_count <= 5:
        risk = "High"
    else:
        risk = "Critical"

    return {
        "total_files": total_files,
        "verified": verified_count,
        "tampered": tampered_count,
        "uploads": total_uploads,
        "risk": risk,
    }


@router.get("/logs")
def get_audit_logs(
    q: Optional[str] = None,
    limit: int = Query(default=100, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id)
    )

    if q:
        search_pattern = f"%{q}%"
        query = query.filter(
            (AuditLog.filename.ilike(search_pattern)) |
            (AuditLog.action.ilike(search_pattern)) |
            (AuditLog.details.ilike(search_pattern))
        )

    logs = query.order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs


@router.get("/alerts")
def get_security_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    alerts = (
        db.query(AuditLog)
        .filter(
            AuditLog.user_id == current_user.id,
            AuditLog.status == "Tampered",
        )
        .order_by(AuditLog.timestamp.desc())
        .limit(50)
        .all()
    )
    return alerts


@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Fetch last 14 days of audit activities for real time-series
    cutoff = datetime.now(timezone.utc) - timedelta(days=14)
    logs = (
        db.query(AuditLog)
        .filter(AuditLog.user_id == current_user.id, AuditLog.timestamp >= cutoff)
        .order_by(AuditLog.timestamp.asc())
        .all()
    )

    # Group by date
    daily_stats = {}
    for i in range(7):
        day_date = (datetime.now(timezone.utc) - timedelta(days=6 - i)).strftime("%b %d")
        daily_stats[day_date] = {"upload": day_date, "uploads": 0, "verifications": 0, "threats": 0}

    for log in logs:
        if log.timestamp:
            day_key = log.timestamp.strftime("%b %d")
            if day_key in daily_stats:
                if log.action == "UPLOAD":
                    daily_stats[day_key]["uploads"] += 1
                elif log.action == "VERIFY":
                    daily_stats[day_key]["verifications"] += 1
                    if log.status == "Tampered":
                        daily_stats[day_key]["threats"] += 1

    chart_data = list(daily_stats.values())

    # Provider distribution
    providers = (
        db.query(FileRecord.storage_provider, func.count(FileRecord.id))
        .filter(FileRecord.user_id == current_user.id)
        .group_by(FileRecord.storage_provider)
        .all()
    )
    provider_distribution = {p[0]: p[1] for p in providers} if providers else {"local": 0}

    return {
        "chart": chart_data,
        "provider_distribution": provider_distribution,
    }


@router.get("/health")
def health_check(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    # Check Database connection
    db_status = "Connected"
    try:
        db.execute(func.now()).scalar()
    except Exception:
        db_status = "Error"

    # Check Storage Provider
    active_provider = current_user.active_cloud_provider if current_user else "local"
    storage_config = current_user.get_storage_config() if current_user else {}
    storage_driver = get_storage_provider(active_provider, storage_config)
    test_result = storage_driver.test_connection()

    return {
        "api": "Online",
        "database": db_status,
        "active_storage": active_provider.upper(),
        "storage_status": "Connected" if test_result.get("status") else "Error",
        "storage_message": test_result.get("message", ""),
        "monitoring": "Active",
    }
