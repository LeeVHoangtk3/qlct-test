from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class TransactionBase(BaseModel):
    amount: float
    category: str
    note: Optional[str] = None
    type: str  # 'income' hoặc 'expense'
    date: Optional[datetime] = None

# Khi tạo mới, user gửi lên các thông tin trên
class TransactionCreate(TransactionBase):
    pass

# Khi trả về, kèm theo ID và user_id
class TransactionResponse(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True