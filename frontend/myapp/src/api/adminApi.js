import api from "./axiosInstance";
const adminApi = {
  pendingEvents: () => api.get("/events/pending"),

  approveEvent: (id) => api.patch(`/events/approve/${id}`),

  rejectEvent: (id) => api.patch(`/events/reject/${id}`),

  // fetchOrganizers: () => api.get("/admin/pending-organizers"),

  // approveOrganizer: (id) => api.put(`/admin/approve-organizer/${id}`),

  // rejectOrganizer: (id) => api.put(`/admin/reject-organizer/${id}`),
};

export default adminApi;
