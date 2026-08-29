import json
import hashlib
from typing import Union, BinaryIO, Optional
from server.storage.base import BaseStorageProvider

try:
    from google.cloud import storage as gcs_storage
    from google.oauth2 import service_account
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False


class GCSStorageProvider(BaseStorageProvider):
    """
    Google Cloud Storage (GCS) Driver.
    """

    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.bucket_name = self.config.get("bucket_name") or self.config.get("bucket", "securesentinel-gcs")
        self.credentials_json = self.config.get("credentials_json") or self.config.get("service_account_key")
        self.project_id = self.config.get("project_id")

        self._client = None
        self._bucket = None

        if GCS_AVAILABLE and (self.credentials_json or self.project_id):
            try:
                if self.credentials_json:
                    if isinstance(self.credentials_json, str):
                        try:
                            creds_dict = json.loads(self.credentials_json)
                            creds = service_account.Credentials.from_service_account_info(creds_dict)
                        except json.JSONDecodeError:
                            creds = service_account.Credentials.from_service_account_file(self.credentials_json)
                    else:
                        creds = service_account.Credentials.from_service_account_info(self.credentials_json)
                    self._client = gcs_storage.Client(credentials=creds, project=creds.project_id)
                else:
                    self._client = gcs_storage.Client(project=self.project_id)
                
                if self.bucket_name:
                    self._bucket = self._client.bucket(self.bucket_name)
            except Exception:
                self._client = None
                self._bucket = None

    def _get_bucket(self):
        if not GCS_AVAILABLE:
            raise RuntimeError("google-cloud-storage library is required for GCS storage.")
        if not self._bucket:
            raise ValueError("Google Cloud Storage bucket/credentials are not configured.")
        return self._bucket

    def upload_file(self, file_obj: Union[BinaryIO, bytes], destination_path: str) -> str:
        bucket = self._get_bucket()
        clean_key = destination_path.lstrip("/\\")
        blob = bucket.blob(clean_key)

        if isinstance(file_obj, bytes):
            blob.upload_from_string(file_obj)
        else:
            blob.upload_from_file(file_obj)

        return clean_key

    def download_file(self, storage_path: str) -> bytes:
        bucket = self._get_bucket()
        clean_key = storage_path.lstrip("/\\")
        blob = bucket.blob(clean_key)
        return blob.download_as_bytes()

    def delete_file(self, storage_path: str) -> bool:
        try:
            bucket = self._get_bucket()
            clean_key = storage_path.lstrip("/\\")
            blob = bucket.blob(clean_key)
            blob.delete()
            return True
        except Exception:
            return False

    def generate_download_url(self, storage_path: str, expiry_seconds: int = 3600) -> str:
        bucket = self._get_bucket()
        clean_key = storage_path.lstrip("/\\")
        blob = bucket.blob(clean_key)
        return blob.generate_signed_url(expiration=expiry_seconds, method="GET")

    def check_integrity(self, storage_path: str, expected_hash: str) -> bool:
        try:
            data = self.download_file(storage_path)
            actual_hash = hashlib.sha256(data).hexdigest()
            return actual_hash.lower() == expected_hash.lower()
        except Exception:
            return False

    def test_connection(self) -> dict:
        if not GCS_AVAILABLE:
            return {"status": False, "message": "google-cloud-storage library is not installed"}
        if not self.bucket_name:
            return {"status": False, "message": "Google Cloud Storage bucket name is required"}
        try:
            bucket = self._get_bucket()
            exists = bucket.exists()
            if exists:
                return {"status": True, "message": f"Successfully connected to GCS bucket '{self.bucket_name}'"}
            return {"status": False, "message": f"GCS bucket '{self.bucket_name}' does not exist"}
        except Exception as e:
            return {"status": False, "message": f"GCS connection failed: {str(e)}"}
