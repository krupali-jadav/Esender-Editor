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
        message.error(error?.message);
    }
};

export const saveProfile = async (payload) => {
    try {
        const response = await axiosInstance.post("auth/profile/save",payload);

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
export const uploadImage = async (payload) => {
    try {
        const response = await axiosInstance.post(
            "auth/upload-image",
            payload,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
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