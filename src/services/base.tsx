import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  function (config) {
    // TODO: 添加自定义config
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    // TODO: 添加response事件处理
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
);

export default axiosInstance;
