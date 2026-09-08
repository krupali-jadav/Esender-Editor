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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
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
        message.error(error?.message);
    }
};