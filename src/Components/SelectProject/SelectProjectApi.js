import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const listProjects = async () => {
    try {
        const response = await axiosInstance.get("projects");

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

export const getProjectById = async (projectId) => {
    try {
        const response = await axiosInstance.get(
            `projects/${projectId}`
        );

        return response.data;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
        throw error;
    }
};