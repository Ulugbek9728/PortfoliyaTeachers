import axios from "axios";
import {ApiName} from "../api/APIname";
import {notification} from "antd";

const axiosDefaults = () => {
    axios.defaults.baseURL = `${ApiName}`;
};

const getInstance = () => {
    axiosDefaults();
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("myInfo"))?.accessToken}`
        },
    });
    instance.interceptors.response.use((response) => response);
    return instance;
};

export {getInstance};
