from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from server.database import get_db
from server.models import User, AuditLog
from server.auth.security import get_current_user
from server.storage.factory import get_storage_provider

router = APIRouter()


class StorageConfigRequest(BaseModel):
    provider: str # "local", "s3", "gcs", "azure"
    config: Optional[Dict[str, Any]] = None


def mask_sensitive_data(config: dict) -> dict:
    masked = {}
    for k, v in config.items():
        if not v:
            masked[k] = ""
        elif any(secret_word in k.lower() for secret_word in ["secret", "key", "password", "token", "credentials"]):
            masked[k] = "••••••••••••••••"
        else:
            masked[k] = v
    return masked


@router.get("/config")
def get_storage_config(current_user: User = Depends(get_current_user)):
    raw_config = current_user.get_storage_config()
    provider = current_user.active_cloud_provider or "local"

    driver = get_storage_provider(provider, raw_config)
    health = driver.test_connection()

    return {
        "active_provider": provider,
        "config": mask_sensitive_data(raw_config),
        "health": health,
        "available_providers": [
            {
                "id": "local",
                "name": "Local File Vault",
                "description": "Store files on the local filesystem with atomic hash indexing",
                "requires_credentials": False,
            },
            {
                "id": "s3",
                "name": "Amazon Web Services (AWS S3)",
                "description": "Enterprise cloud object storage with SHA-256 integrity checks",
                "requires_credentials": True,
                "fields": ["bucket_name", "region_name", "aws_access_key_id", "aws_secret_access_key", "endpoint_url"],
            },
            {
                "id": "gcs",
                "name": "Google Cloud Storage (GCS)",
                "description": "High durability multi-regional storage in Google Cloud Platform",
                "requires_credentials": True,
                "fields": ["bucket_name", "project_id", "credentials_json"],
            },
            {
                "id": "azure",
                "name": "Microsoft Azure Blob Storage",
                "description": "Scalable cloud object storage for enterprise datasets",
                "requires_credentials": True,
                "fields": ["container_name", "connection_string", "account_name", "account_key"],
            },
        ],
    }


@router.post("/test")
def test_storage_connection(
    data: StorageConfigRequest,
    current_user: User = Depends(get_current_user),
):
    provider = data.provider.lower().strip()
    config = data.config or {}

    # Merge with existing config if user entered masked fields
    existing_config = current_user.get_storage_config()
    final_config = {}
    for k, v in config.items():
        if isinstance(v, str) and ("••••" in v or "..." in v):
            final_config[k] = existing_config.get(k, "")
        else:
            final_config[k] = v

    driver = get_storage_provider(provider, final_config)
    result = driver.test_connection()
    return result


@router.post("/config")
def update_storage_config(
    data: StorageConfigRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    provider = data.provider.lower().strip()
    if provider not in ("local", "s3", "gcs", "azure"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid storage provider: {provider}",
        )

    config = data.config or {}

    # Merge with existing config if user kept masked fields
    existing_config = current_user.get_storage_config()
    final_config = {}
    for k, v in config.items():
        if isinstance(v, str) and ("••••" in v or "..." in v):
            final_config[k] = existing_config.get(k, "")
        else:
            final_config[k] = v

    # Test connection if not local
    if provider != "local":
        driver = get_storage_provider(provider, final_config)
        test_result = driver.test_connection()
        if not test_result.get("status"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Storage provider validation failed: {test_result.get('message')}",
            )

    current_user.active_cloud_provider = provider
    current_user.set_storage_config(final_config)

    log = AuditLog(
        user_id=current_user.id,
        action="CONFIG_UPDATE",
        filename=None,
        status="Success",
        details=f"Switched active storage provider to {provider.upper()}",
    )
    db.add(log)
    db.commit()
    db.refresh(current_user)

    return {
        "message": f"Storage provider successfully updated to {provider.upper()}",
        "active_provider": provider,
        "config": mask_sensitive_data(final_config),
    }
