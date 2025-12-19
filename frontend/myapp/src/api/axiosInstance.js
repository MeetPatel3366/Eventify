import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status == 401) {
      console.error("session expired. redirect to login...");

      localStorage.removeItem("token");
      localStorage.removeItem("role");

      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
