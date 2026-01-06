import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bookingsApi from "../api/bookingsApi";

export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData) => {
    const res = await bookingsApi.booking(bookingData);
    return res.data.booking;
  }
);

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async () => {
    const res = await bookingsApi.myBookings();
    return res.data.bookings;
  }
);

export const fetchMyEventBookings = createAsyncThunk(
  "booking/fetchMyEventBookings",
  async (eventID) => {
    const res = await bookingsApi.myEventBookings(eventID);
    return res.data;
  }
);

export const checkInBooking = createAsyncThunk(
  "booking/checkInBooking",
  async (bookingId) => {
    const res = await bookingsApi.checkInBooking(bookingId);
    return res.data.booking;
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    myEventBookings: [],
    event: null,
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
        state.success = true;
      })

      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
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
          (b) => b._id == action.payload._id
        );
        if (index !== -1) {
          state.myEventBookings[index] = action.payload;
        }
      })

      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          console.error("booking api error:", action.error);
          state.loading = false;
          state.error = action.error?.message || "something went wrong";
        }
      );
  },
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer;
