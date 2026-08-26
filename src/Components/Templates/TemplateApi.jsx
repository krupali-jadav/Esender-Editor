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
    }
};

export const getAllTemplates = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/all", payload);

        return response.data;
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to get templates");
    }
};

export const deleteTemplate = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/delete", payload);
        return response.data;
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to delete template");
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
        message.error(error?.message || "Failed to change template status");
    }
};

export const updateTemplate = async (payload) => {
    try {
        const response = await axiosInstance.post("templates/save", payload);

        return response.data;
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to update template");
    }
};

export const getTemplateById = async (templateId) => {
    try {
        const response = await axiosInstance.get(`templates/${templateId}`);

        return response.data;
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to get template");
    }
};