import api from "./axiosInstance";

const eventApi = {
  fetchAll: () => api.get("/events"),

  fetchOne: (id) => api.get(`/events/${id}`),

  fetchMy: () => api.get(`/events/my`),

  add: (formData) =>
    api.post(`/events`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  update: (id, formData) =>
    api.put(`/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  delete: (id) => api.delete(`/events/${id}`),
};

export default eventApi;
