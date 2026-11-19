from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import UserRegister, UserLogin, UserResponse, AuthResponse
from app.services.auth_service import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    clean_username = user_data.username.strip()
    clean_email = user_data.email.strip().lower()

    # Check if username exists (case-insensitive)
    if db.query(User).filter(func.lower(User.username) == clean_username.lower()).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username sudah digunakan, silakan pilih username lain"
        )
    # Check if email exists (case-insensitive)
    if db.query(User).filter(func.lower(User.email) == clean_email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email sudah terdaftar"
        )

    new_user = User(
        username=clean_username,
        email=clean_email,
        hashed_password=hash_password(user_data.password.strip()),
        display_name=(user_data.display_name or clean_username).strip(),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "username": new_user.username})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        expires_in=86400,
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=AuthResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    clean_identifier = login_data.username.strip().lower()
    clean_password = login_data.password.strip()

    # Find user by username or email (case-insensitive)
    user = db.query(User).filter(
        (func.lower(User.username) == clean_identifier) | (func.lower(User.email) == clean_identifier)
    ).first()

    if not user or not verify_password(clean_password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Username atau password salah"
        )

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return AuthResponse(
        access_token=token,
        token_type="bearer",
        expires_in=86400,
        user=UserResponse.model_validate(user)
    )

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    return {"message": "Berhasil logout", "success": True}

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
