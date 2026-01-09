import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load key từ file .env
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Lỗi: Chưa tìm thấy GEMINI_API_KEY trong file .env")
else:
    genai.configure(api_key=api_key)
    print(f"✅ Đã nhận Key: {api_key[:5]}...")
    print("📋 Danh sách các Model bạn có thể dùng:")
    print("-" * 30)
    
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"👉 {m.name}")
    except Exception as e:
        print(f"❌ Lỗi kết nối: {e}")