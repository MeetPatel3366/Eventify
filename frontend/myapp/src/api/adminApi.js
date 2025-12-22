import api from "./axiosInstance";
const adminApi = {
  pendingEvents: () => api.get("/events/pending"),

  // fetchOrganizers: () => api.get("/admin/pending-organizers"),

  // approveOrganizer: (id) => api.put(`/admin/approve-organizer/${id}`),

  // rejectOrganizer: (id) => api.put(`/admin/reject-organizer/${id}`),
};

export default adminApi;
