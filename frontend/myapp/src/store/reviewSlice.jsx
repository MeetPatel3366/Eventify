import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import reviewApi from "../api/reviewApi";

export const createReview = createAsyncThunk(
  "review/createReview",
  async (formData) => {
    const res = await reviewApi.createReview(formData);
    return res.data;
  }
);

export const getEventReviews = createAsyncThunk(
  "review/getEventReviews",
  async (eventId) => {
    const res = await reviewApi.getEventReviews(eventId);
    return res.data;
  }
);

export const getMyReview = createAsyncThunk(
  "review/getMyReview",
  async (eventId) => {
    const res = await reviewApi.getMyReview(eventId);
    return res.data;
  }
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ eventId, rating, review }) => {
    const res = await reviewApi.updateReview(eventId, { rating, review });
    return res.data;
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (eventId) => {
    const res = await reviewApi.deleteReview(eventId);
    return res.data;
  }
);

export const getEventRatingSummary = createAsyncThunk(
  "review/getEventRatingSummary",
  async (eventId) => {
    const res = await reviewApi.getEventRatingSummary(eventId);
    return res.data;
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    loading: false,
    error: null,
    reviews: [],
    myReview: null,
    summary: null,
  },
  reducers: {
    resetReviewState: (state) => {
      state.loading = false;
      state.error = null;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReview = action.payload.review;
        if (Array.isArray(state.reviews)) {
          state.reviews.unshift(action.payload.review);
        }
      })

      .addCase(getEventReviews.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
      })

      .addCase(getMyReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyReview.fulfilled, (state, action) => {
        state.loading = false;
        state.myReview = action.payload.review;
      })

      .addCase(updateReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updatedReview = action.payload.data;
        state.myReview = updatedReview;

        const index = state.reviews.findIndex(
          (r) => r._id == updatedReview._id
        );
        if (index !== -1) {
          state.reviews[index] = updatedReview;
        }
      })

      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const deletedReviewId = action.payload.deletedReviewId;
        state.reviews = state.reviews.filter((r) => r._id !== deletedReviewId);
        state.myReview = null;
      })

      .addCase(getEventRatingSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEventRatingSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.data;
      })

      .addMatcher(
        (action) =>
          action.type.startsWith("review/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          console.log("review api error:", action.error);
          state.loading = false;
          state.error = action.error?.message || "something went wrong";
        }
      );
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
