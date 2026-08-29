import io
import hashlib
from typing import Union, BinaryIO, Optional
from server.storage.base import BaseStorageProvider

try:
    import boto3
    from botocore.exceptions import ClientError, BotoCoreError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False


class S3StorageProvider(BaseStorageProvider):
    """
    AWS S3 / MinIO Cloud Storage Driver.
    """

    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.bucket_name = self.config.get("bucket_name") or self.config.get("bucket", "securesentinel-storage")
        self.region = self.config.get("region_name") or self.config.get("region", "us-east-1")
        self.access_key = self.config.get("aws_access_key_id") or self.config.get("access_key")
        self.secret_key = self.config.get("aws_secret_access_key") or self.config.get("secret_key")
        self.endpoint_url = self.config.get("endpoint_url")

        self._client = None
        if BOTO3_AVAILABLE and self.access_key and self.secret_key:
            client_kwargs = {
                "service_name": "s3",
                "aws_access_key_id": self.access_key,
                "aws_secret_access_key": self.secret_key,
                "region_name": self.region,
            }
            if self.endpoint_url:
                client_kwargs["endpoint_url"] = self.endpoint_url
            self._client = boto3.client(**client_kwargs)

    def _get_client(self):
        if not BOTO3_AVAILABLE:
            raise RuntimeError("boto3 package is required for AWS S3 storage.")
        if not self._client:
            raise ValueError("AWS S3 credentials (access_key, secret_key, bucket_name) are not configured.")
        return self._client

    def upload_file(self, file_obj: Union[BinaryIO, bytes], destination_path: str) -> str:
        client = self._get_client()
        clean_key = destination_path.lstrip("/\\")

        if isinstance(file_obj, bytes):
            client.put_object(
                Bucket=self.bucket_name,
                Key=clean_key,
                Body=file_obj,
            )
        else:
            client.upload_fileobj(
                Fileobj=file_obj,
                Bucket=self.bucket_name,
                Key=clean_key,
            )

        return clean_key

    def download_file(self, storage_path: str) -> bytes:
        client = self._get_client()
        clean_key = storage_path.lstrip("/\\")
        response = client.get_object(Bucket=self.bucket_name, Key=clean_key)
        return response["Body"].read()

    def delete_file(self, storage_path: str) -> bool:
        try:
            client = self._get_client()
            clean_key = storage_path.lstrip("/\\")
            client.delete_object(Bucket=self.bucket_name, Key=clean_key)
            return True
        except Exception:
            return False

    def generate_download_url(self, storage_path: str, expiry_seconds: int = 3600) -> str:
        client = self._get_client()
        clean_key = storage_path.lstrip("/\\")
        url = client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket_name, "Key": clean_key},
            ExpiresIn=expiry_seconds,
        )
        return url

    def check_integrity(self, storage_path: str, expected_hash: str) -> bool:
        try:
            client = self._get_client()
            clean_key = storage_path.lstrip("/\\")
            response = client.get_object(Bucket=self.bucket_name, Key=clean_key)
            hasher = hashlib.sha256()
            for chunk in response["Body"].iter_chunks(chunk_size=1024 * 1024):
                hasher.update(chunk)
            return hasher.hexdigest().lower() == expected_hash.lower()
        except Exception:
            return False

    def test_connection(self) -> dict:
        if not BOTO3_AVAILABLE:
            return {"status": False, "message": "boto3 library is not installed"}
        if not self.access_key or not self.secret_key or not self.bucket_name:
            return {"status": False, "message": "AWS S3 Access Key, Secret Key, and Bucket Name are required"}
        try:
            client = self._get_client()
            client.head_bucket(Bucket=self.bucket_name)
            return {"status": True, "message": f"Successfully connected to AWS S3 bucket '{self.bucket_name}'"}
        except ClientError as e:
            error_code = e.response.get("Error", {}).get("Code", "Unknown")
            return {"status": False, "message": f"AWS S3 error ({error_code}): {e.response.get('Error', {}).get('Message', str(e))}"}
        except Exception as e:
            return {"status": False, "message": f"AWS S3 connection failed: {str(e)}"}
