import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const createProject = async (payload) => {
    try {
        const response = await axiosInstance.post("projects", payload);

        if (response.data?.status) {
            return response.data;
        }

        message.error(
            response.data?.message || "Failed to create project"
        );

        return null;
    } catch (error) {
        console.log("CREATE PROJECT ERROR:", error);

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to create project"
        );

        return null;
    }
};
export const updateProjectDomains = async (projectId, payload) => {
    try {
        const response = await axiosInstance.put(
            `projects/${projectId}/domains`,
            payload
        );

        if (response.data?.status) {
            return response.data;
        }

        message.error(
            response.data?.message || "Failed to update domains"
        );

        return null;
    } catch (error) {
        console.log("UPDATE DOMAIN ERROR:", error);

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update domains"
        );

        return null;
    }
};
export const getProject = async (projectId) => {
    try {
        const response = await axiosInstance.get(`projects/${projectId}`);

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