import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ChatWidget from "../chatbot/ChatWidget";

const Layout = () => {
    return (
        // 1. Khung bao ngoài cùng: Full màn hình, không cuộn body
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* 2. Sidebar bên trái: Chiều cao tự động theo h-screen */}
            <Sidebar />

            {/* 3. Cột bên phải: Chứa Header + Nội dung */}
            <div className="flex-1 flex flex-col min-w-0 h-screen relative">

                {/* Header: Luôn nằm trên cùng, không bị trôi đi */}
                {/* Lưu ý: Không dùng fixed ở đây nữa vì flex-col đã lo việc xếp vị trí */}
                <div className="flex-shrink-0 z-20 shadow-sm relative">
                    <Header />
                </div>

                {/* Nội dung chính (Main): Tự động giãn ra (flex-1) và có thanh cuộn RIÊNG */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6 scroll-smooth z-0">
                    <Outlet />
                </main>

                {/* ChatWidget: Nổi lên trên tất cả (z-50 trong file widget đã set) */}
                <ChatWidget />
            </div>
        </div>
    );
};

export default Layout;