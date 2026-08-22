import axiosInstance from "../../util/axiosInstance";
import { message } from "antd";

export const getProfile = async () => {

    try {
        const response = await axiosInstance.get("auth/profile");

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to get profile");
    }
};