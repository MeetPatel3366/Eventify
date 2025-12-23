import api from "./axiosInstance";
const adminApi = {
  pendingEvents: () => api.get("/events/pending"),

  approvedEvents: () => api.get("/events/approved"),

  rejectedEvents: () => api.get("/events/rejected"),

  approveEvent: (id) => api.patch(`/events/approve/${id}`),

  rejectEvent: (id, feedback) =>
    api.patch(`/events/reject/${id}`, { feedback }),

  // fetchOrganizers: () => api.get("/admin/pending-organizers"),

  // approveOrganizer: (id) => api.put(`/admin/approve-organizer/${id}`),

  // rejectOrganizer: (id) => api.put(`/admin/reject-organizer/${id}`),
};

export default adminApi;
