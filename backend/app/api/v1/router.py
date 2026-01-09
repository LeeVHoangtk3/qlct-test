from fastapi import APIRouter
from app.api.v1.endpoints import auth, transactions, users  , ai# <--- Thêm users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])

api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])