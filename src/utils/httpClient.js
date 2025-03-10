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


const axiosFaculty = () => {
    axios.defaults.baseURL = `https://api-id.tdtu.uz`;
};

const getFacultyList = () => {
    axiosFaculty();
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
        },
    });
    instance.interceptors.response.use((response) => response, (error) => {
        notification.error(
            {
                message:'Faculty error',
                duration: 1,
                placement: 'top'
            }
        )
    });
    return instance;
};

export {getInstance, getFacultyList};
