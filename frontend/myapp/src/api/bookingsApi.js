import api from "./axiosInstance";

const bookingsApi = {
  booking: (formData) => api.post(`/bookings`, formData),

  myBookings: () => api.get("/bookings/my"),

  myEventBookings: (eventID) => api.get(`/bookings/${eventID}`),

  checkInBooking: (bookingId) => api.patch(`/bookings/${bookingId}/check-in`),

  allBookings: (query) => api.get(`/bookings/all?${query}`),
};

export default bookingsApi;
