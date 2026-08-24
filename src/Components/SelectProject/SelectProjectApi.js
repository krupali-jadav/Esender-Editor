import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const listProjects = async () => {
    try {
        const response = await axiosInstance.get("projects");

        if (response.data?.status) {
            return response.data;
        }

        message.error(
            response.data?.message || "Failed to get project"
        );

        return null;
    } catch (error) {
        console.log("GET PROJECT ERROR:", error);

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to get project"
        );

        return null;
    }
};