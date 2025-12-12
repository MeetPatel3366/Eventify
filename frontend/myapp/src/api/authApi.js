import api from "./axiosInstance";

const authApi = {
  register: (email, password, role) =>
    api.post("/auth/register", { email, password, role }),

  login: (email, password) =>
    api.post("/auth/login", {
      email,
      password,
    }),

  verifyToken: (token) =>
    api.get("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default authApi;
