import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import eventReducer from "./eventSlice";
import adminReducer from "./adminSlice";
import bookingReducer from "./bookingSlice";
import reviewReducer from "./reviewSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    admin: adminReducer,
    booking: bookingReducer,
    review: reviewReducer,
  },
});
