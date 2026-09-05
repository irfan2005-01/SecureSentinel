import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

import pytest
from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_x402_config():
    response = client.get("/api/x402/config")
    assert response.status_code == 200
    data = response.json()
    assert data["track"] == "Agentic Solutions: Powered by x402"
    assert data["network"]["name"] == "Algorand Testnet"
    assert "facilitator.goplausible.xyz" in data["facilitator"]["url"]
    assert "lora.algokit.io" in data["lora_explorer_base"]

def test_x402_challenge_explicit():
    response = client.post("/api/x402/challenge")
    assert response.status_code == 402
    data = response.json()
    assert data["x402"] is True
    assert data["protocol"] == "x402-avm"
    assert "WWW-Authenticate" in response.headers
    assert "X-402-Facilitator" in response.headers
    assert data["accepts"][0]["network"] == "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="

def test_x402_attest_without_payment_returns_402():
    login_res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    res = client.post(
        "/api/x402/attest",
        json={"filename": "test.pdf", "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 402
    data = res.json()
    assert data["x402"] is True
    assert data["protocol"] == "x402-avm"

def test_x402_attest_with_payment_proof_succeeds():
    login_res = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    token = login_res.json()["access_token"]

    res = client.post(
        "/api/x402/attest",
        json={
            "filename": "critical_evidence.pdf",
            "sha256": "b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78",
            "simulate_agent": True,
        },
        headers={
            "Authorization": f"Bearer {token}",
            "X-Payment": "TESTNET_TX_SIMULATED_PROUD_PROOF",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "Verified & Attested"
    assert data["blockchain"] == "Algorand Testnet"
    assert "lora.algokit.io/testnet/transaction" in data["lora_explorer_url"]
