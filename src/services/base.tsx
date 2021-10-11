import { notification } from 'antd';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  // withCredentials: true
});

axiosInstance.interceptors.request.use(
  function (config) {
    // TODO: 添加自定义config
    console.log(config)
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    const { code, msg } = response.data
    if (code !== 200) {
      notification.error({
        message: 'Fetch Error',
        description: msg
      })
      return Promise.reject(msg)
    }
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  }
);

export default axiosInstance;
