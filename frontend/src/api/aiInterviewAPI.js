import axiosInstance from "../lib/axios";

export const createAIInterview = async (data) => {
    const response = await axiosInstance.post("/ai-interview", data);
    return response.data;
};
