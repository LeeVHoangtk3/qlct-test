from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles # <--- Import mới
import os # <--- Import mới
from app.core.config import settings
from app.api.v1.router import api_router 

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Cấu hình CORS (Cho phép Frontend React gọi vào)
origins = [
    "http://localhost:5173", # Vite default port
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- QUAN TRỌNG: Cấu hình thư mục chứa ảnh (Static Files) ---
# 1. Tạo thư mục static/avatars nếu chưa có (để tránh lỗi)
os.makedirs("static/avatars", exist_ok=True)

# 2. Mount thư mục "static" ra đường dẫn URL "/static"
# Nghĩa là: File trong folder backend/static/avatars/a.png 
# Sẽ truy cập được qua: http://localhost:8000/static/avatars/a.png
app.mount("/static", StaticFiles(directory="static"), name="static")
# -----------------------------------------------------------

# Đăng ký Router V1 vào App
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Smart Finance API is running!", 
        "docs_url": "http://127.0.0.1:8000/docs"
    }