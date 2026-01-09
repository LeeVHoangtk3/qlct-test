import axiosClient from "../api/axiosClient";

const transactionService = {
    // Lấy danh sách giao dịch
    getAll: async () => {
        return await axiosClient.get("/transactions/");
        // Lưu ý: Đảm bảo Backend có endpoint GET /api/v1/transactions/
    },

    // Tạo giao dịch mới
    create: async (data) => {
        // data cần có: amount, category, type, date, note
        return await axiosClient.post("/transactions/", data);
    },

    // Xóa giao dịch (nếu cần sau này)
    delete: async (id) => {
        return await axiosClient.delete(`/transactions/${id}`);
    }
};

export default transactionService;