import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const getSubscriptionHistory = async (page = 0, limit = 20) => {
    try {
        const response = await axiosInstance.get(`subscription/history?page=${page}&limit=${limit}`);

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.log(error);
        message.error(error?.message);
        return null;
    }
};