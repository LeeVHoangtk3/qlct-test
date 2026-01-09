from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash

class UserRepo:
    # Tìm user theo email
    @staticmethod
    def get_by_email(db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    # Tạo user mới
    @staticmethod
    def create(db: Session, user_in: UserCreate):
        # 1. Mã hóa mật khẩu trước khi lưu
        db_user = User(
            email=user_in.email,
            full_name=user_in.full_name,
            hashed_password=get_password_hash(user_in.password),
            is_active=True
        )
        # 2. Lưu vào DB
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user