import api from "./axiosInstance";

const bookingsApi = {
  booking: (formData) => api.post(`/bookings`, formData),

  myBookings: () => api.get("/bookings/my"),
};

export default bookingsApi;
