import os
import hashlib
from pathlib import Path
from typing import Union, BinaryIO, Optional
from server.storage.base import BaseStorageProvider


class LocalStorageProvider(BaseStorageProvider):
    """
    Local Disk Storage Driver.
    Stores files securely within the designated upload directory.
    """

    def __init__(self, config: Optional[dict] = None):
        super().__init__(config)
        self.upload_dir = Path(self.config.get("upload_dir", "uploads"))
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    def _resolve_path(self, storage_path: str) -> Path:
        # Strip leading slashes to keep inside upload_dir
        clean_path = storage_path.lstrip("/\\")
        target = (self.upload_dir / clean_path).resolve()
        # Prevent path traversal outside upload_dir
        if not str(target).startswith(str(self.upload_dir.resolve())):
            raise ValueError("Security error: Path traversal detected")
        return target

    def upload_file(self, file_obj: Union[BinaryIO, bytes], destination_path: str) -> str:
        target_path = self._resolve_path(destination_path)
        target_path.parent.mkdir(parents=True, exist_ok=True)

        if isinstance(file_obj, bytes):
            with open(target_path, "wb") as f:
                f.write(file_obj)
        else:
            with open(target_path, "wb") as f:
                while True:
                    chunk = file_obj.read(1024 * 1024) # 1MB chunk
                    if not chunk:
                        break
                    f.write(chunk)

        return str(destination_path)

    def download_file(self, storage_path: str) -> bytes:
        target_path = self._resolve_path(storage_path)
        if not target_path.exists():
            raise FileNotFoundError(f"File not found on local storage: {storage_path}")
        with open(target_path, "rb") as f:
            return f.read()

    def delete_file(self, storage_path: str) -> bool:
        try:
            target_path = self._resolve_path(storage_path)
            if target_path.exists():
                target_path.unlink()
                return True
            return False
        except Exception:
            return False

    def generate_download_url(self, storage_path: str, expiry_seconds: int = 3600) -> str:
        return f"/api/files/download/{storage_path}"

    def check_integrity(self, storage_path: str, expected_hash: str) -> bool:
        try:
            target_path = self._resolve_path(storage_path)
            if not target_path.exists():
                return False
            hasher = hashlib.sha256()
            with open(target_path, "rb") as f:
                while True:
                    chunk = f.read(1024 * 1024)
                    if not chunk:
                        break
                    hasher.update(chunk)
            return hasher.hexdigest().lower() == expected_hash.lower()
        except Exception:
            return False

    def test_connection(self) -> dict:
        try:
            self.upload_dir.mkdir(parents=True, exist_ok=True)
            test_file = self.upload_dir / ".health_check"
            test_file.write_text("ok")
            test_file.unlink()
            return {"status": True, "message": f"Local storage accessible at '{self.upload_dir}'"}
        except Exception as e:
            return {"status": False, "message": f"Local storage access error: {str(e)}"}
