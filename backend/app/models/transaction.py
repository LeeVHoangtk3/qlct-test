from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Transaction(Base):
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)      # Số tiền
    category = Column(String, nullable=False)   # Danh mục (Ăn uống, Lương...)
    note = Column(String, nullable=True)        # Ghi chú
    type = Column(String, nullable=False)       # income / expense
    date = Column(DateTime(timezone=True), server_default=func.now()) # Ngày giờ
    
    # Khóa ngoại: Giao dịch này thuộc về user nào?
    user_id = Column(Integer, ForeignKey("user.id"))

    # Liên kết với User
    owner = relationship("User", back_populates="transactions")