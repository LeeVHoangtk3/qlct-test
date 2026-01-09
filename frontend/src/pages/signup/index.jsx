import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import authService from "../../services/authService"; // <--- Import service

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API thật
            await authService.register({
                email: formData.email,
                password: formData.password,
                full_name: formData.fullName
            });

            alert("Đăng ký thành công! Hãy đăng nhập.");
            navigate("/login");

        } catch (error) {
            // Lấy lỗi từ Backend trả về
            const message = error.response?.data?.detail || "Đăng ký thất bại";
            alert(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">Tạo tài khoản</h2>
                <p className="text-gray-500">Kết nối với Backend FastAPI</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
                {/* Input Họ tên */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="h-5 w-5 text-gray-400" /></div>
                    <input
                        name="fullName"
                        type="text"
                        required
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Họ và tên đầy đủ"
                    />
                </div>

                {/* Input Email */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></div>
                    <input
                        name="email"
                        type="email"
                        required
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Địa chỉ Email"
                    />
                </div>

                {/* Input Password */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></div>
                    <input
                        name="password"
                        type="password"
                        required
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="Mật khẩu"
                    />
                </div>

                {/* Input Confirm Password */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-green-500" /></div>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Xác nhận mật khẩu"
                    />
                </div>

                <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all">
                    {isLoading ? "Đang xử lý..." : <>Đăng ký ngay <ArrowRight size={18} /></>}
                </button>
            </form>

            <div className="mt-8 text-center text-sm">
                <p className="text-gray-500">Đã có tài khoản? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Đăng nhập</Link></p>
            </div>
        </div>
    );
};
export default Signup;