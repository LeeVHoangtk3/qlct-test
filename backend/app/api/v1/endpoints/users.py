from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse, UserPasswordUpdate
from app.core import deps
from app.models.user import User
from app.core.security import verify_password, get_password_hash
import shutil
import os

router = APIRouter()

# 1. API: Lấy thông tin người dùng hiện tại
# Url: GET /api/v1/users/me
@router.get("/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(deps.get_current_user)):
    """
    Lấy profile của user đang đăng nhập.
    """
    return current_user

# 2. API: Đổi mật khẩu
# Url: PUT /api/v1/users/me/password
@router.put("/me/password")
def update_password(
    password_data: UserPasswordUpdate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Đổi mật khẩu người dùng.
    Yêu cầu: Mật khẩu cũ phải đúng.
    """
    # Kiểm tra mật khẩu cũ
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Mật khẩu hiện tại không chính xác"
        )
    
    # Kiểm tra trùng lặp
    if password_data.current_password == password_data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Mật khẩu mới không được trùng với mật khẩu cũ"
        )

    # Mã hóa và lưu mật khẩu mới
    current_user.hashed_password = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Đổi mật khẩu thành công"}

# 3. API: Upload Avatar
# Url: POST /api/v1/users/me/avatar
@router.post("/me/avatar", response_model=UserResponse)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Upload ảnh đại diện.
    File sẽ được lưu vào thư mục 'static/avatars'.
    """
    # Tạo thư mục nếu chưa có (để chắc chắn)
    os.makedirs("static/avatars", exist_ok=True)

    # Đặt tên file theo ID user để tránh trùng lặp (ví dụ: avatar_1.png)
    file_extension = file.filename.split(".")[-1]
    file_name = f"avatar_{current_user.id}.{file_extension}"
    file_path = f"static/avatars/{file_name}"
    
    # Lưu file vào ổ cứng server
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Tạo đường dẫn URL để Frontend truy cập
    # Lưu ý: Cần đảm bảo app/main.py đã mount thư mục static
    server_url = "http://127.0.0.1:8000"  # Địa chỉ server của bạn
    full_url = f"{server_url}/{file_path}"
    
    # Lưu link vào Database
    current_user.avatar = full_url
    db.commit()
    db.refresh(current_user)
    
    return current_user