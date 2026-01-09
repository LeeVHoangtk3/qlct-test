from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.repositories.transaction_repo import TransactionRepo
from app.models.user import User

router = APIRouter()

# 1. Lấy danh sách giao dịch
@router.get("/", response_model=List[TransactionResponse])
def read_transactions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user), # <--- Bắt buộc phải đăng nhập
):
    transactions = TransactionRepo.get_multi_by_owner(
        db=db, user_id=current_user.id, skip=skip, limit=limit
    )
    return transactions

# 2. Tạo giao dịch mới
@router.post("/", response_model=TransactionResponse)
def create_transaction(
    item_in: TransactionCreate,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user), # <--- Bắt buộc phải đăng nhập
):
    return TransactionRepo.create_with_owner(db=db, obj_in=item_in, user_id=current_user.id)