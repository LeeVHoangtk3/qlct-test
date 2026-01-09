import { useEffect, useState, useRef } from "react";
import { User, Mail, Shield, LogOut, Camera, Check } from "lucide-react";
import authService from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Settings = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Ref để kích hoạt input file ẩn

    const [user, setUser] = useState({
        full_name: "",
        email: "",
        avatar: null
    });

    const [isLoading, setIsLoading] = useState(true);

    // State cho đổi mật khẩu
    const [isChangingPass, setIsChangingPass] = useState(false);
    const [passForm, setPassForm] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    // 1. Load thông tin user
    const fetchProfile = async () => {
        try {
            const response = await authService.getProfile();
            setUser(response.data);
        } catch (error) {
            console.error("Lỗi lấy thông tin:", error);
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [navigate]);

    // 2. Xử lý Upload Avatar
    const handleAvatarClick = () => {
        fileInputRef.current.click(); // Kích hoạt input file ẩn
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            setIsLoading(true);
            await authService.uploadAvatar(formData);
            alert("Cập nhật ảnh đại diện thành công!");
            window.location.reload();
            fetchProfile(); // Load lại để hiển thị ảnh mới
        } catch (error) {
            alert("Lỗi khi upload ảnh!");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Xử lý Đổi mật khẩu
    const handleChangePass = async () => {
        if (!passForm.current || !passForm.new || !passForm.confirm) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }
        if (passForm.new !== passForm.confirm) {
            alert("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            await authService.updatePassword(passForm.current, passForm.new);
            alert("Đổi mật khẩu thành công!");
            setIsChangingPass(false);
            setPassForm({ current: "", new: "", confirm: "" });
        } catch (error) {
            const msg = error.response?.data?.detail || "Đổi mật khẩu thất bại";
            alert(msg);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    if (isLoading) return <div className="p-8 text-center">Đang xử lý...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
                <p className="text-gray-500">Quản lý thông tin cá nhân và bảo mật</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Cột trái: Avatar & Menu */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                        {/* Avatar Wrapper */}
                        <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                                {user.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"
                                )}
                            </div>

                            {/* Overlay Camera Icon */}
                            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="text-white" size={24} />
                            </div>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <h2 className="font-bold text-lg">{user.full_name || "Người dùng"}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 font-semibold hover:bg-red-100 transition-colors">
                        <LogOut size={20} /> Đăng xuất
                    </button>
                </div>

                {/* Cột phải: Form thông tin */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <User size={20} className="text-blue-500" /> Thông tin cơ bản
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Họ và tên</label>
                                <div className="relative">
                                    <User className="absolute top-3 left-3 text-gray-400" size={18} />
                                    <input readOnly value={user.full_name || ""} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
                                    <input readOnly value={user.email || ""} className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phần Đổi Mật Khẩu */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <Shield size={20} className="text-green-500" /> Bảo mật
                            </h3>
                            {!isChangingPass && (
                                <button onClick={() => setIsChangingPass(true)} className="text-sm text-blue-600 font-semibold hover:underline">
                                    Đổi mật khẩu
                                </button>
                            )}
                        </div>

                        {!isChangingPass ? (
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex-1 bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                                    <span>************</span>
                                    <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded">An toàn</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu hiện tại</label>
                                    <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={passForm.current} onChange={e => setPassForm({ ...passForm, current: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mật khẩu mới</label>
                                    <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={passForm.new} onChange={e => setPassForm({ ...passForm, new: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Xác nhận mật khẩu</label>
                                    <input type="password" className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={passForm.confirm} onChange={e => setPassForm({ ...passForm, confirm: e.target.value })} />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleChangePass} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center justify-center gap-2">
                                        <Check size={18} /> Lưu thay đổi
                                    </button>
                                    <button onClick={() => { setIsChangingPass(false); setPassForm({ current: "", new: "", confirm: "" }); }}
                                        className="px-6 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold hover:bg-gray-200">
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;