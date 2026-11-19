from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class UserRegister(BaseModel):
    username: str
    email: str
    password: str
    display_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    display_name: Optional[str] = None
    image_path: Optional[str] = None
    learning_target: Optional[str] = "fokus"
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400
    user: UserResponse
