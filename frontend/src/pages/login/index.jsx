import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService"; // Import service

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Gọi API Login
            const response = await authService.login(email, password);

            // 2. Lấy token từ kết quả trả về
            const { access_token } = response.data;

            // 3. Lưu token vào bộ nhớ trình duyệt
            localStorage.setItem("token", access_token);

            // 4. Chuyển hướng vào Dashboard
            navigate("/dashboard");

        } catch (error) {
            alert("Đăng nhập thất bại! Kiểm tra lại email/pass.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-2 text-blue-600">Smart Finance</h2>
            <p className="text-gray-500 mb-6">Đăng nhập hệ thống</p>

            <form onSubmit={handleLogin}>
                <input
                    className="w-full p-3 mb-4 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full p-3 mb-6 border border-gray-200 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    disabled={isLoading}
                    className="block w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                >
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500">
                Chưa có tài khoản? <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Đăng ký miễn phí</Link>
            </div>
        </div>
    );
}