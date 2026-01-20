import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingsApi from "../api/bookingsApi";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData) => {
    const res = await bookingsApi.booking(bookingData);
    return res.data;
  },
);

export const verifyBookingPayment = createAsyncThunk(
  "booking/verify",
  async (data) => {
    const res = await bookingsApi.verifyBookingPayment(data);
    return res.data;
  },
);

export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async (bookingId) => {
    const res = await bookingsApi.cancelBooking(bookingId);
    return res.data;
  },
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async () => {
    const res = await bookingsApi.myBookings();
    return res.data.bookings;
  },
);

export const fetchMyEventBookings = createAsyncThunk(
  "booking/fetchMyEventBookings",
  async (eventID) => {
    const res = await bookingsApi.myEventBookings(eventID);
    return res.data;
  },
);

export const checkInBooking = createAsyncThunk(
  "booking/checkInBooking",
  async (bookingId) => {
    const res = await bookingsApi.checkInBooking(bookingId);
    return res.data.booking;
  },
);

export const fetchexportBookingsCSV = createAsyncThunk(
  "booking/fetchexportBookingsCSV",
  async (eventId) => {
    window.open(
      `${import.meta.env.VITE_BACKEND_URL}/bookings/event/${eventId}/export`,
      "_blank",
    );
  },
);

export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAllBookings",
  async (filter) => {
    const query = new URLSearchParams(filter).toString();
    const res = await bookingsApi.allBookings(query);
    return res.data.bookings;
  },
);

export const fetchBookingAnalytics = createAsyncThunk(
  "booking/fetchBookingAnalytics",
  async () => {
    const res = await bookingsApi.analytics();
    console.log("bookin analytics : ", res);
    return res.data;
  },
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    myEventBookings: [],
    allBookings: [],
    event: null,
    dailyBookings: [],
    dailyRevenue: [],
    topEvents: [],
    topOrganizers: [],
    booking: null,
    order: null,
    key: null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetBookingState: (state) => {
      state.myEventBookings = [];
      state.event = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = false;
        state.booking = action.payload.booking;
        state.order = action.payload.order;
        state.key = action.payload.key;
      })

      .addCase(verifyBookingPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(verifyBookingPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedBooking = action.payload.booking;
        const index = state.bookings.findIndex(
          (b) => b._id == updatedBooking._id,
        );
        if (index !== -1) {
          state.bookings[index] = updatedBooking;
        }
      })

      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })

      .addCase(fetchMyEventBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEventBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.myEventBookings = action.payload.bookings;
        state.event = action.payload.event;
      })

      .addCase(checkInBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkInBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myEventBookings.findIndex(
          (b) => b._id == action.payload._id,
        );
        if (index !== -1) {
          state.myEventBookings[index] = action.payload;
        }
      })

      .addCase(fetchexportBookingsCSV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchexportBookingsCSV.fulfilled, (state, action) => {
        state.loading = false;
      })

      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.allBookings = action.payload;
      })

      .addCase(fetchBookingAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyBookings = action.payload.dailyBookings;
        state.dailyRevenue = action.payload.dailyRevenue;
        state.topEvents = action.payload.topEvents;
        state.topOrganizers = action.payload.topOrganizers;
      })

      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          console.log("booking api error:", action.error);
          state.loading = false;
          state.error = action.error?.message || "something went wrong";
        },
      );
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
