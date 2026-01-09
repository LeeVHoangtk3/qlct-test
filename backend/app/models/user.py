from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    # Tên bảng trong DB sẽ là 'user' (tự động do config ở base.py)
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    # --- MỚI THÊM: Cột chứa link ảnh đại diện ---
    avatar = Column(String, nullable=True) 
    # --------------------------------------------

    # Liên kết ngược đến bảng Transaction
    transactions = relationship("Transaction", back_populates="owner")