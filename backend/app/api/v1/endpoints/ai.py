import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core import deps
from app.core.config import settings
from app.repositories.transaction_repo import TransactionRepo
from app.models.user import User
from pydantic import BaseModel
import json

router = APIRouter()

class ChatRequest(BaseModel):
    question: str

@router.post("/analyze")
async def chat_finance(
    request: ChatRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    try:
        # 1. Lấy dữ liệu giao dịch
        transactions = TransactionRepo.get_multi_by_owner(db, user_id=current_user.id, limit=30)
        
        if not transactions:
            data_ctx = "Người dùng chưa có giao dịch nào."
        else:
            data_ctx = "Lịch sử giao dịch gần đây:\n"
            for t in transactions:
                # Format: Ngày - Loại - Số tiền - Danh mục - Ghi chú
                data_ctx += f"- {t.date}: {t.type} {t.amount}đ ({t.category}) | Note: {t.note}\n"

        # 2. Tạo Prompt (Câu lệnh cho AI)
        prompt = f"""
        Bạn là trợ lý tài chính cá nhân. Dữ liệu của tôi:
        {data_ctx}
        
        Câu hỏi: "{request.question}"
        
        Yêu cầu: Trả lời ngắn gọn, thân thiện bằng tiếng Việt.
        """

        # 3. Cấu hình gửi Request (Dùng model gemini-pro ổn định nhất)
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # Xử lý Key: Xóa khoảng trắng thừa nếu có
        clean_key = settings.GEMINI_API_KEY.strip()
        
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": clean_key
        }
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }]
        }

        # 4. Gửi Request
        print(f"📡 Đang gọi AI model: {url}...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        # 5. Xử lý kết quả trả về
        if response.status_code == 200:
            result = response.json()
            try:
                # Lấy nội dung trả lời từ JSON phức tạp của Google
                answer = result['candidates'][0]['content']['parts'][0]['text']
                return {"answer": answer}
            except (KeyError, IndexError, TypeError):
                return {"answer": "AI đã suy nghĩ xong nhưng không trả về văn bản cụ thể."}
        
        elif response.status_code == 429:
            print("❌ Lỗi Quota: Hết lượt miễn phí.")
            raise HTTPException(status_code=429, detail="Hệ thống đang bận (Hết lượt miễn phí). Vui lòng thử lại sau 1 phút.")
            
        else:
            print(f"❌ Google API Error ({response.status_code}): {response.text}")
            raise HTTPException(status_code=500, detail="Lỗi kết nối đến Google Gemini.")

    except Exception as e:
        print(f"❌ Server Exception: {e}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống nội bộ.")