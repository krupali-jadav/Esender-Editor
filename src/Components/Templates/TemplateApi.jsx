import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const createTemplate = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/create", payload);

        if (response.data?.status) {
            return response.data;
        }
        return response.data;
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to create template");
        throw error;
    }
};

export const getAllTemplates = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/all", payload);

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteTemplate = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/delete", payload);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const changeTemplateStatus = async (templateId, enable) => {
    try {
        const response = await axiosInstance.post(
            `templates/${templateId}/change-status`,
            {
                enable,
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};