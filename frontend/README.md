# 💰 Smart Finance Manager

> Hệ thống quản lý tài chính cá nhân hiện đại, giao diện Dashboard tương tác và tích hợp trợ lý ảo AI.

![Project Preview](https://via.placeholder.com/1200x600.png?text=Smart+Finance+Dashboard+Preview)
*(Hãy thay thế link trên bằng ảnh chụp màn hình dự án thực tế của bạn)*

## ✨ Giới thiệu

**Smart Finance Manager** là một ứng dụng web (SPA) giúp người dùng theo dõi thu nhập, chi tiêu và phân tích dòng tiền cá nhân. Dự án tập trung vào trải nghiệm người dùng (UX) mượt mà với giao diện **Data-Driven**, biểu đồ trực quan và widget Chatbot thông minh có thể kéo thả.

## 🚀 Tính năng nổi bật

- **📊 Dashboard Tổng quan:**
  - Thống kê số dư, thu chi theo thời gian thực.
  - Biểu đồ dòng tiền (Cash Flow) trực quan với **Recharts**.
  - Danh sách giao dịch gần đây.
- **💸 Quản lý Thu Chi (Manager):**
  - Form nhập liệu thông minh với 2 chế độ (Income/Expense).
  - Chọn danh mục bằng Icon trực quan.
  - Tự động tính toán số dư.
- **📜 Lịch sử Giao dịch:**
  - Bảng dữ liệu chi tiết.
  - Tìm kiếm và lọc theo loại giao dịch (Filter).
  - Phân trang (Pagination UI).
- **🤖 Draggable AI Chatbot:**
  - Widget trợ lý ảo tự code (không dùng thư viện bên thứ 3).
  - Tính năng **Drag & Drop** (Kéo thả) cửa sổ chat đi khắp màn hình.
  - Giả lập trả lời thông minh.
- **⚙️ Cài đặt & Cá nhân hóa:**
  - Quản lý hồ sơ người dùng.
  - Tùy chỉnh giao diện và thông báo.

## 🛠 Công nghệ sử dụng

Dự án được xây dựng dựa trên các công nghệ Frontend hiện đại nhất 2024:

- **Core:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/)
- **Language:** JavaScript (ES6+)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Routing:** [React Router DOM v6](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts:** [Recharts](https://recharts.org/)
- **State Management:** React Hooks (useState, useEffect, useRef, useContext)

## 📂 Cấu trúc thư mục

```bash
src/
├── assets/          # Hình ảnh, icons, static files
├── components/      # Các thành phần tái sử dụng
│   ├── charts/      # Biểu đồ (WeeklyChart...)
│   ├── chatbot/     # Widget Chatbot AI (Draggable)
│   ├── layout/      # Sidebar, Header
│   └── ui/          # Các component nhỏ (StatCard, Button...)
├── layouts/         # Layout chính (AppLayout, AuthLayout)
├── pages/           # Các trang chức năng (Dashboard, Manager, History...)
├── routes/          # Cấu hình định tuyến (AppRoutes, PrivateRoute...)
└── App.jsx          # Root Component