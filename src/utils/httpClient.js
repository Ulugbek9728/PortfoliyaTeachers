import axios from "axios";
import {ApiName} from "../api/APIname";
import {notification} from "antd";

const axiosDefaults = () => {
    axios.defaults.baseURL = `${ApiName}`;
};


const fulInfo = JSON.parse(localStorage.getItem("myInfo"));


const getInstance = () => {
    axiosDefaults();
    const instance = axios.create({
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${fulInfo?.accessToken}`
        },
    });
    instance.interceptors.response.use((response) => response, (error) => {
        localStorage.removeItem("myInfo");
        notification.error(
            {
                message:'Login error',
                duration: 1,
                placement: 'top'
            }
        )
    });
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
