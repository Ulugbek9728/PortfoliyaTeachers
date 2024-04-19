import axios from "axios";

const axiosDefaults = () => {
  axios.defaults.baseURL = "https://test.tdtu.uz/api/";
};

const getInstance = () => {
  axiosDefaults();
  const instance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });
  // instance.interceptors.request.use(config => config, error => {
  //     return Promise.reject(error)
  // });
  // instance.interceptors.response.use(response => response, error => {
  //     return Promise.reject(error)
  // });
  return instance;
};

export { getInstance };
