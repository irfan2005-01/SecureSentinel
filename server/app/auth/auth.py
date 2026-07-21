from fastapi import APIRouter, HTTPException

from app.auth.security import (
    verify_password,
    hash_password,
    create_access_token,
)

router = APIRouter()

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = hash_password("admin123")


@router.post("/login")
def login(data: dict):

    username = data.get("username")
    password = data.get("password")

    if username != ADMIN_USERNAME:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        password,
        ADMIN_PASSWORD_HASH,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        {"sub": username}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }