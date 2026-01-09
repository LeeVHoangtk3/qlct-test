import axiosClient from "../api/axiosClient";

const authService = {
    // 1. Đăng ký
    register: async (data) => {
        return await axiosClient.post("/auth/signup", data);
    },

    // 2. Đăng nhập
    login: async (email, password) => {
        return await axiosClient.post("/auth/login", { email, password });
    },

    // 3. Lấy thông tin user (Profile)
    getProfile: async () => {
        return await axiosClient.get("/users/me");
    },

    // 4. Đổi mật khẩu (Mới thêm)
    updatePassword: async (currentPassword, newPassword) => {
        return await axiosClient.put("/users/me/password", {
            current_password: currentPassword, // Tên trường phải khớp với Pydantic bên Backend
            new_password: newPassword
        });
    },

    // 5. Upload Avatar (Mới thêm)
    uploadAvatar: async (formData) => {
        return await axiosClient.post("/users/me/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Bắt buộc dòng này để upload file
            },
        });
    }
};

export default authService;