import hashlib


def calculate_sha256(file_bytes: bytes):
    return hashlib.sha256(file_bytes).hexdigest()