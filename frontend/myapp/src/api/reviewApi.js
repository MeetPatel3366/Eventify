import api from "./axiosInstance";

const reviewApi = {
  createReview: (formData) => api.post("/review/create", formData),

  getEventReviews: (eventId) => api.get(`/review/${eventId}`),

  getMyReview: (eventId) => api.get(`/review/my/${eventId}`),

  updateReview: (eventId, formData) => api.put(`/review/${eventId}`, formData),

  deleteReview: (eventId) => api.delete(`/review/${eventId}`),

  getEventRatingSummary: (eventId) => api.get(`/review/summary/${eventId}`),
};

export default reviewApi;
