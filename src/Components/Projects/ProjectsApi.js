import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const getDomains = async (projectId) => {
    try {
        const response = await axiosInstance.get(`projects/${projectId}/domains`);

        if (response.data?.status) {
            return response.data;
        }
        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message );
    }
};
export const getCredentials = async (projectId) => {
    try {
        const response = await axiosInstance.get(`projects/${projectId}/credentials`);

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message );
    }
};
export const rotateLicense = async (projectId) => {
    try {
        const response = await axiosInstance.post(`projects/${projectId}/rotate-license`);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message || "Failed to rotate license");
    }
};
export const validateProjectDomain = async (projectId, payload) => {
    try {
        const response = await axiosInstance.post(
            `projects/${projectId}/domains/validate`,
            payload
        );

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);

        return null;
    } catch (error) {
        console.error("VALIDATE DOMAIN ERROR:", error);

        message.error(error?.response?.data?.message);

        return null;
    }
};