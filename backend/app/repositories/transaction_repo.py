from sqlalchemy.orm import Session
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate

class TransactionRepo:
    # Lấy tất cả giao dịch của 1 user
    @staticmethod
    def get_multi_by_owner(db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return db.query(Transaction)\
                 .filter(Transaction.user_id == user_id)\
                 .offset(skip)\
                 .limit(limit)\
                 .all()

    # Tạo giao dịch mới
    @staticmethod
    def create_with_owner(db: Session, obj_in: TransactionCreate, user_id: int):
        # Chuyển dữ liệu từ Schema sang Model
        db_obj = Transaction(
            amount=obj_in.amount,
            category=obj_in.category,
            note=obj_in.note,
            type=obj_in.type,
            date=obj_in.date, # Pydantic tự xử lý datetime
            user_id=user_id   # Gắn user_id vào
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    # Xóa giao dịch
    @staticmethod
    def remove(db: Session, id: int, user_id: int):
        obj = db.query(Transaction).filter(Transaction.id == id, Transaction.user_id == user_id).first()
        if obj:
            db.delete(obj)
            db.commit()
        return obj