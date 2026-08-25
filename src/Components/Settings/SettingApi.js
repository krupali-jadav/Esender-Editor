import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const saveBasicInfo = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/basic-info/save",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to save basic information");
    }
};
export const saveBillingDetails = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/billing-details/save",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to save billing details");
    }
};
export const getUserSetting = async (payload) => {
    try {
        const response = await axiosInstance.get(
            "user/setting",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to get user setting");
    }
};
export const addSupport = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/support/add",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to save support details");
    }
}
export const updateSupport = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/support/save",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to save support details");
    }
}
export const deleteSupport = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/support/delete",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to delete support");
    }
};
export const saveSocialMedia = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "user/setting/social-media/save",
            payload
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to save social media details");
    }
};
export const generateApiKey = async () => {
    try {
        const response = await axiosInstance.post(
            "user-setting/generate-api-key"
        );

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.message || "Failed to generate API key");
    }
};