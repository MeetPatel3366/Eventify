import api from "./axiosInstance";

const authApi = {
  register: (username, email, password, confirmpassword, role) =>
    api.post("/auth/register", { username, email, password, confirmpassword, role }),

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
