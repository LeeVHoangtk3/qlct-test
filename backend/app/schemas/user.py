from typing import Optional
from pydantic import BaseModel, EmailStr

# Base: Những trường chung
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

# Create: Cần password khi tạo tài khoản
class UserCreate(UserBase):
    password: str

# --- MỚI THÊM: Schema dùng để nhận dữ liệu đổi mật khẩu ---
class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

# Response: Trả về client (Không được có password!)
class UserResponse(UserBase):
    id: int
    is_active: bool
    
    # --- MỚI THÊM: Trả về link avatar ---
    avatar: Optional[str] = None 

    class Config:
        from_attributes = True # Để đọc được dữ liệu từ SQLAlchemy