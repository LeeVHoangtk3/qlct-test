import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, LogOut, Settings as SettingsIcon } from "lucide-react";
import authService from "../../services/authService";

const Header = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Thêm ref để xử lý click ra ngoài

    // State lưu thông tin user
    const [userInfo, setUserInfo] = useState({
        full_name: "Người dùng",
        avatar: null,
        email: ""
    });

    // 1. Lấy thông tin User
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const response = await authService.getProfile();
                setUserInfo(response.data);
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error);
            }
        };
        fetchUserData();
    }, []);

    // 2. Xử lý đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsOpen(false);
        navigate("/login");
    };

    return (
        // --- SỬA LỖI Ở ĐÂY: Dùng sticky thay vì fixed ---
        <header className="bg-white h-16 sticky top-0 z-20 border-b border-gray-100 px-6 flex items-center justify-between transition-all duration-300 w-full">

            {/* Nút Menu Mobile */}
            <button onClick={toggleSidebar} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <Menu size={24} />
            </button>

            {/* Thanh tìm kiếm */}
            <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl w-96 border border-gray-100 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Khu vực bên phải: Thông báo & User */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-gray-200"
                    >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm overflow-hidden border border-gray-100">
                            {userInfo.avatar ? (
                                <img src={userInfo.avatar} alt="Ava" className="w-full h-full object-cover" />
                            ) : (
                                userInfo.full_name ? userInfo.full_name.charAt(0).toUpperCase() : "U"
                            )}
                        </div>

                        {/* Tên User */}
                        <div className="text-left hidden sm:block">
                            <p className="text-sm font-bold text-gray-700 leading-tight">
                                {userInfo.full_name || "Khách"}
                            </p>
                            <p className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                                MEMBER
                            </p>
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-sm font-bold text-gray-900">{userInfo.full_name}</p>
                                <p className="text-xs text-gray-500 truncate">{userInfo.email}</p>
                            </div>

                            <div className="p-2">
                                <Link to="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                                    <SettingsIcon size={16} /> Cài đặt tài khoản
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;