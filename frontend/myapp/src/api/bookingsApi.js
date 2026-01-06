import api from "./axiosInstance";

const bookingsApi = {
  booking: (formData) => api.post(`/bookings`, formData),

  myBookings: () => api.get("/bookings/my"),

  myEventBookings: (eventID) => api.get(`/bookings/${eventID}`),
};

export default bookingsApi;
