import axiosClient from "../api/axiosClient";

const aiService = {
    chat: async (question) => {
        return await axiosClient.post("/ai/analyze", { question });
    }
};

export default aiService;