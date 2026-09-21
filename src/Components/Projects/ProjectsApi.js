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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
    }
};
export const rotateSecrets = async (projectId) => {
    try {
        const response = await axiosInstance.post(`projects/${projectId}/rotate-secret`);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message);
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
        console.error(error);
        message.error(error?.message);
        return null;
    }
};
export const addProjectDomain = async (projectId, payload) => {
    try {
        const response = await axiosInstance.post(
            `projects/${projectId}/domains`,
            payload
        );

        if (response.data?.status) {
            return response.data;
        }
        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
        return null;
    }
};
export const deleteProjectDomain = async (projectId, payload) => {
    try {
        const response = await axiosInstance.delete(`projects/${projectId}/domains`, {
            data: payload,
        });

        if (response.data?.status) {
            return response.data;
        }
        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
        return null;
    }
};
export const updateDomain = async (projectId, payload) => {
    try {
        const response = await axiosInstance.patch(`projects/${projectId}/domains`, payload);

        if (response.data?.status) {
            return response.data;
        }
        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
        return null;
    }
};

export const getEditorApiKeys = async (projectId) => {
    try {
        const response = await axiosInstance.get(`/projects/${projectId}/editor-keys`);

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

export const createEditorApiKey = async (projectId, payload) => {
    try {
        const response = await axiosInstance.post(
            `/projects/${projectId}/editor-keys`,
            payload
        );

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.log(error);
        message.error( error?.message);
        return null;
    }
};

export const rotateEditorApiKey = async (projectId, editorKeyId) => {
    try {
        const response = await axiosInstance.post(`/projects/${projectId}/editor-keys/${editorKeyId}/rotate`);

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

export const revokeEditorApiKey = async (projectId, editorKeyId) => {
    try {
        const response = await axiosInstance.post(`/projects/${projectId}/editor-keys/${editorKeyId}/revoke`);

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