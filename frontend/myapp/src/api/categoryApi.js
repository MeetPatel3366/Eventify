import api from "./axiosInstance";

const categoryApi = {
  getAllCategories: () => api.get("/categories"),

  createCategory: (name) => api.post("/categories", { name }),

  editCategory: (id, name) => api.put(`/categories/${id}`, { name }),

  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export default categoryApi;
