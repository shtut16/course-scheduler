// Automatically logs out after session ends

import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login"; // force redirect
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
