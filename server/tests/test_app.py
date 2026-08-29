import sys
from pathlib import Path

# Add project root and server dir to sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import io
import os
import pytest
from fastapi.testclient import TestClient
from server.main import app
from server.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "SecureSentinel"
    assert data["status"] == "Running"
    assert "supported_storage" in data


def test_auth_register_and_login():
    # Register test user
    reg_payload = {
        "username": "security_tester",
        "email": "security_tester@securesentinel.io",
        "password": "Password123!",
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code in (200, 400)

    # Login test
    login_res = client.post("/api/auth/login", json={
        "username": "security_tester",
        "password": "Password123!",
    })
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"
    token = login_data["access_token"]

    # Test /me endpoint
    me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["username"] == "security_tester"


def test_file_upload_and_verification():
    # Login as admin
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123",
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Upload genuine file
    file_content = b"Critical security payload for SecureSentinel vault test."
    file_name = "security_policy.pdf"
    
    upload_res = client.post(
        "/api/files/upload",
        headers=headers,
        files={"file": (file_name, io.BytesIO(file_content), "application/pdf")},
    )
    assert upload_res.status_code == 200
    upload_data = upload_res.json()
    assert upload_data["status"] == "Verified"
    assert "sha256" in upload_data

    # Verify identical file -> Verified
    verify_res = client.post(
        "/api/verify/verify",
        headers=headers,
        files={"file": (file_name, io.BytesIO(file_content), "application/pdf")},
    )
    assert verify_res.status_code == 200
    assert verify_res.json()["status"] == "Verified"

    # Verify tampered file with same name -> Tampered
    tampered_content = b"Critical security payload with unauthorized modifications!"
    tamper_res = client.post(
        "/api/verify/verify",
        headers=headers,
        files={"file": (file_name, io.BytesIO(tampered_content), "application/pdf")},
    )
    assert tamper_res.status_code == 200
    assert tamper_res.json()["status"] == "Tampered"

    # Verify non-existent file -> Not Found
    not_found_res = client.post(
        "/api/verify/verify",
        headers=headers,
        files={"file": ("unregistered_file.txt", io.BytesIO(b"random content"), "text/plain")},
    )
    assert not_found_res.status_code == 200
    assert not_found_res.json()["status"] == "Not Found"

    # Test PDF Report Generation
    report_res = client.get(f"/api/verify/report/{file_name}", headers=headers)
    assert report_res.status_code == 200
    assert report_res.headers["content-type"] == "application/pdf"
    assert len(report_res.content) > 100


def test_storage_config():
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123",
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get storage config
    config_res = client.get("/api/storage/config", headers=headers)
    assert config_res.status_code == 200
    data = config_res.json()
    assert data["active_provider"] in ("local", "s3", "gcs", "azure")
    assert len(data["available_providers"]) == 4

    # Test connection for local provider
    test_local = client.post(
        "/api/storage/test",
        headers=headers,
        json={"provider": "local", "config": {}},
    )
    assert test_local.status_code == 200
    assert test_local.json()["status"] is True


def test_analytics_and_health():
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "admin123",
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Stats
    stats_res = client.get("/api/analytics/stats", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert "total_files" in stats
    assert "risk" in stats

    # Health
    health_res = client.get("/api/analytics/health", headers=headers)
    assert health_res.status_code == 200
    health = health_res.json()
    assert health["api"] == "Online"
    assert health["database"] == "Connected"


def test_profile_management_and_password_change():
    # Login as tester
    login_res = client.post("/api/auth/login", json={
        "username": "security_tester",
        "password": "Password123!",
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Get full profile
    prof_res = client.get("/api/auth/profile", headers=headers)
    assert prof_res.status_code == 200
    pdata = prof_res.json()
    assert pdata["username"] == "security_tester"
    assert "stats" in pdata

    # Update profile
    update_res = client.put("/api/auth/profile", headers=headers, json={
        "full_name": "Cyber Defense Chief",
        "organization": "Sentinel Defense Corp",
        "bio": "Lead cryptographic auditor",
        "preferred_cloud_provider": "s3",
    })
    assert update_res.status_code == 200
    assert update_res.json()["user"]["full_name"] == "Cyber Defense Chief"

    # Change password
    pwd_res = client.post("/api/auth/change-password", headers=headers, json={
        "current_password": "Password123!",
        "new_password": "NewSecurePassword456!",
    })
    assert pwd_res.status_code == 200

    # Verify old password fails and new password works
    old_login = client.post("/api/auth/login", json={
        "username": "security_tester",
        "password": "Password123!",
    })
    assert old_login.status_code == 401

    new_login = client.post("/api/auth/login", json={
        "username": "security_tester",
        "password": "NewSecurePassword456!",
    })
    assert new_login.status_code == 200
