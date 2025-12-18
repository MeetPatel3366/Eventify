import api from "./axiosInstance";
const adminApi = {
  fetchOrganizers: () => api.get("/admin/pending-organizers"),

  approveOrganizer: (id) => api.put(`/admin/approve-organizer/${id}`),

  rejectOrganizer: (id) => api.put(`/admin/reject-organizer/${id}`),
};

export default adminApi;
