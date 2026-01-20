import api from "./axiosInstance";

const bookingsApi = {
  booking: (formData) => api.post(`/bookings`, formData),

  verifyBookingPayment: (formData) => api.post(`/bookings/verify`, formData),

  cancelBooking: (bookingId) => api.post(`/bookings/${bookingId}/cancel`),

  myBookings: () => api.get("/bookings/my"),

  myEventBookings: (eventID) => api.get(`/bookings/${eventID}`),

  checkInBooking: (bookingId) => api.patch(`/bookings/${bookingId}/check-in`),

  allBookings: (query) => api.get(`/bookings/all?${query}`),

  analytics: () => api.get("/bookings/analytics"),
};

export default bookingsApi;
