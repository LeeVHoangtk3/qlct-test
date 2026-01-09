import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1", // URL của Backend
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor: Tự động gắn Token vào header nếu đã đăng nhập
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosClient;