from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import Token, LoginRequest
from app.repositories.user_repo import UserRepo
from app.core.security import verify_password, create_access_token

router = APIRouter()

# Dependency để lấy DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API 1: ĐĂNG KÝ ---
@router.post("/signup", response_model=UserResponse)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Kiểm tra email đã tồn tại chưa
    user = UserRepo.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email này đã được sử dụng."
        )
    
    # 2. Tạo user mới
    new_user = UserRepo.create(db, user_in=user_in)
    return new_user

# --- API 2: ĐĂNG NHẬP ---
@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    # 1. Tìm user trong DB
    user = UserRepo.get_by_email(db, email=login_data.email)
    
    # 2. Kiểm tra password
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
        )
        
    # 3. Tạo Token
    access_token = create_access_token(subject=user.id)
    
    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }