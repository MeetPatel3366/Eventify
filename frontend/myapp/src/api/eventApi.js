import api from "./axiosInstance";

const eventApi = {
  fetchAll: () => api.get("/events"),

  fetchOne: (id) => api.get(`/events/${id}`),

  fetchMy: () => api.get(`/events/my`),

  fetchMyWithStats: () => api.get(`/events/my-with-stats`),

  add: (formData) => api.post(`/events`, formData),

  update: (id, formData) => api.put(`/events/${id}`, formData),

  delete: (id) => api.delete(`/events/${id}`),
};

export default eventApi;
