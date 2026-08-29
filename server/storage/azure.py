import hashlib
from typing import Union, BinaryIO, Optional
from server.storage.base import BaseStorageProvider

try:
    from azure.storage.blob import BlobServiceClient, generate_blob_sas, BlobSasPermissions
    from datetime import datetime, timedelta, timezone
    AZURE_AVAILABLE = True
except ImportError:
    AZURE_AVAILABLE = False


class AzureStorageProvider(BaseStorageProvider):
    """
    Azure Blob Storage Driver.
    """

    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.container_name = self.config.get("container_name") or self.config.get("container", "securesentinel-container")
        self.connection_string = self.config.get("connection_string") or self.config.get("azure_connection_string")
        self.account_name = self.config.get("account_name")
        self.account_key = self.config.get("account_key")

        self._client = None
        self._container_client = None

        if AZURE_AVAILABLE and self.connection_string:
            try:
                self._client = BlobServiceClient.from_connection_string(self.connection_string)
                self._container_client = self._client.get_container_client(self.container_name)
            except Exception:
                self._client = None
                self._container_client = None

    def _get_container_client(self):
        if not AZURE_AVAILABLE:
            raise RuntimeError("azure-storage-blob library is required for Azure Blob Storage.")
        if not self._container_client:
            raise ValueError("Azure Blob Storage connection_string / container_name are not configured.")
        return self._container_client

    def upload_file(self, file_obj: Union[BinaryIO, bytes], destination_path: str) -> str:
        container = self._get_container_client()
        clean_key = destination_path.lstrip("/\\")
        blob_client = container.get_blob_client(clean_key)

        if isinstance(file_obj, bytes):
            blob_client.upload_blob(file_obj, overwrite=True)
        else:
            blob_client.upload_blob(file_obj, overwrite=True)

        return clean_key

    def download_file(self, storage_path: str) -> bytes:
        container = self._get_container_client()
        clean_key = storage_path.lstrip("/\\")
        blob_client = container.get_blob_client(clean_key)
        return blob_client.download_blob().readall()

    def delete_file(self, storage_path: str) -> bool:
        try:
            container = self._get_container_client()
            clean_key = storage_path.lstrip("/\\")
            blob_client = container.get_blob_client(clean_key)
            blob_client.delete_blob()
            return True
        except Exception:
            return False

    def generate_download_url(self, storage_path: str, expiry_seconds: int = 3600) -> str:
        container = self._get_container_client()
        clean_key = storage_path.lstrip("/\\")
        blob_client = container.get_blob_client(clean_key)
        if self.account_name and self.account_key:
            sas_token = generate_blob_sas(
                account_name=self.account_name,
                container_name=self.container_name,
                blob_name=clean_key,
                account_key=self.account_key,
                permission=BlobSasPermissions(read=True),
                expiry=datetime.now(timezone.utc) + timedelta(seconds=expiry_seconds),
            )
            return f"{blob_client.url}?{sas_token}"
        return blob_client.url

    def check_integrity(self, storage_path: str, expected_hash: str) -> bool:
        try:
            data = self.download_file(storage_path)
            actual_hash = hashlib.sha256(data).hexdigest()
            return actual_hash.lower() == expected_hash.lower()
        except Exception:
            return False

    def test_connection(self) -> dict:
        if not AZURE_AVAILABLE:
            return {"status": False, "message": "azure-storage-blob library is not installed"}
        if not self.connection_string or not self.container_name:
            return {"status": False, "message": "Azure connection_string and container_name are required"}
        try:
            container = self._get_container_client()
            exists = container.exists()
            if exists:
                return {"status": True, "message": f"Successfully connected to Azure container '{self.container_name}'"}
            return {"status": False, "message": f"Azure container '{self.container_name}' does not exist"}
        except Exception as e:
            return {"status": False, "message": f"Azure connection failed: {str(e)}"}
