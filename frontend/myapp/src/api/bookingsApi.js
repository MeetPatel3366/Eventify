import api from "./axiosInstance";

const bookingsApi = {
  booking: (formData) => api.post(`/bookings`, formData),
};

export default bookingsApi;
