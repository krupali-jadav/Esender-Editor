import axios from "axios";
import { store } from "../Components/Redux/store"; // Adjust the path to your store

const axiosInstance = axios.create({
    baseURL: "/api/",
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.user?.token;

        if (import.meta.env.VITE_MODE === "production") {
            config.baseURL = "/api/";
        } else {
            config.baseURL = import.meta.env.VITE_API_URL;
        }

        const isMultipartData =
            config.headers["Content-Type"] === "multipart/form-data";

        config.headers = {
            "Content-Type": isMultipartData
                ? "multipart/form-data"
                : "application/json",
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*",
        };

        return config;
    },
    (error) => {
        // Handle request error here
        return Promise.reject(error);
    }
);
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("persist:root");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;