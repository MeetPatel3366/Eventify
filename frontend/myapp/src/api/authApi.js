import api from "./axiosInstance";

const authApi = {
  register: (username, email, password, confirmpassword, role) =>
    api.post("/auth/register", {
      username,
      email,
      password,
      confirmpassword,
      role,
    }),

  login: (email, password) =>
    api.post("/auth/login", {
      email,
      password,
    }),

  verifyToken: () => api.get("/auth/verify"),

  verifyOtp: (email, otp) =>
    api.post("/auth/verify-otp", {
      email,
      otp,
    }),

  verifyLoginOtp: (email, otp) =>
    api.post("/auth/verify-login-otp", {
      email,
      otp,
    }),

  getMyProfile: () => api.get("/auth/me"),

  updateProfile: (formData) => api.put("/auth/me", formData),

  logout: () => api.get("/auth/logout"),
};

export default authApi;
