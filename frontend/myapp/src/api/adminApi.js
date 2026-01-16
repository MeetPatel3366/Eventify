import api from "./axiosInstance";
const adminApi = {
  fetchAdminStats: () => api.get("/admin/stats"),

  fetchAllUsers: () => api.get("/admin/users"),

  pendingEvents: () => api.get("/events/pending"),

  approvedEvents: () => api.get("/events/approved"),

  getAllEventsWithStats: () => api.get("/admin/all-events-stats"),

  rejectedEvents: () => api.get("/events/rejected"),

  approveEvent: (id) => api.patch(`/events/approve/${id}`),

  rejectEvent: (id, feedback) =>
    api.patch(`/events/reject/${id}`, { feedback }),

  fetchPendingOrganizers: () => api.get("/admin/pending-organizers"),

  fetchApprovedOrganizers: () => api.get("/admin/approved-organizers"),

  fetchRejectedOrganizers: () => api.get("/admin/rejected-organizers"),

  approveOrganizer: (id) => api.put(`/admin/approve-organizer/${id}`),

  rejectOrganizer: (id) => api.put(`/admin/reject-organizer/${id}`),

  fetchAllContactMessages: () => api.get("/admin/contact-messages"),

  fetchSingleContactMessage: (id) => api.get(`/admin/contact-message/${id}`),

  replyToContactMessage: (id) => api.post(`admin/contact-message/reply/${id}`),

  deleteUser: (id) => api.delete(`/admin/user/${id}`),

  getEventBookingsByEvent: (eventId) =>
    api.get(`/admin/events/${eventId}/bookings`),
};

export default adminApi;
