from abc import ABC, abstractmethod
from typing import Optional, Union, BinaryIO
import hashlib


class BaseStorageProvider(ABC):
    """
    Abstract base class defining the unified storage driver interface.
    Supports Local Disk, AWS S3, Google Cloud Storage, and Azure Blob Storage.
    """

    def __init__(self, config: Optional[dict] = None):
        self.config = config or {}

    @abstractmethod
    def upload_file(self, file_obj: Union[BinaryIO, bytes], destination_path: str) -> str:
        """
        Uploads a file object or bytes to the target destination path.
        Returns the stored storage path or URI identifier.
        """
        pass

    @abstractmethod
    def download_file(self, storage_path: str) -> bytes:
        """
        Downloads a file from storage and returns raw bytes.
        """
        pass

    @abstractmethod
    def delete_file(self, storage_path: str) -> bool:
        """
        Deletes a file from storage by its storage path identifier.
        Returns True if successful, False otherwise.
        """
        pass

    @abstractmethod
    def generate_download_url(self, storage_path: str, expiry_seconds: int = 3600) -> str:
        """
        Generates a direct or presigned URL for downloading the file.
        """
        pass

    def check_integrity(self, storage_path: str, expected_hash: str) -> bool:
        """
        Checks the integrity of a stored file by downloading/streaming it
        and comparing its SHA-256 hash with expected_hash.
        """
        try:
            content = self.download_file(storage_path)
            actual_hash = hashlib.sha256(content).hexdigest()
            return actual_hash.lower() == expected_hash.lower()
        except Exception:
            return False

    @abstractmethod
    def test_connection(self) -> dict:
        """
        Tests whether the storage provider credentials and bucket/container are valid.
        Returns a dict with 'status' (True/False) and 'message' (str).
        """
        pass
