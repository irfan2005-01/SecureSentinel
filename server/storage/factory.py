from typing import Optional, Dict, Any
from server.storage.base import BaseStorageProvider
from server.storage.local import LocalStorageProvider
from server.storage.s3 import S3StorageProvider
from server.storage.gcs import GCSStorageProvider
from server.storage.azure import AzureStorageProvider


def get_storage_provider(
    provider_name: Optional[str] = "local",
    config: Optional[Dict[str, Any]] = None,
) -> BaseStorageProvider:
    """
    Factory function resolving the concrete BaseStorageProvider implementation
    according to the specified provider name ('local', 's3', 'gcs', 'azure') and config.
    """
    provider_key = (provider_name or "local").lower().strip()
    config = config or {}

    if provider_key in ("s3", "aws", "minio"):
        return S3StorageProvider(config)
    elif provider_key in ("gcs", "google", "google_cloud"):
        return GCSStorageProvider(config)
    elif provider_key in ("azure", "azure_blob"):
        return AzureStorageProvider(config)
    else:
        return LocalStorageProvider(config)
