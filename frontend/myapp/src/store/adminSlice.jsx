import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";

export const fetchPendingEvents = createAsyncThunk(
  "admin/fetchPendingEvents",
  async () => {
    const res = await adminApi.pendingEvents();
    return res.data.events;
  }
);

export const fetchApprovedEvents = createAsyncThunk(
  "admin/fetchApprovedEvents",
  async () => {
    const res = await adminApi.approvedEvents();
    return res.data.events;
  }
);

export const fetchRejectedEvents = createAsyncThunk(
  "admin/fetchRejectedEvents",
  async () => {
    const res = await adminApi.rejectedEvents();
    return res.data.events;
  }
);

export const approveEvent = createAsyncThunk(
  "admin/approveEvent",
  async (id) => {
    const res = await adminApi.approveEvent(id);
    return res.data.event;
  }
);

export const rejectEvent = createAsyncThunk(
  "admin/rejectEvent",
  async ({ id, feedback }) => {
    const res = await adminApi.rejectEvent(id, feedback);
    return res.data.event;
  }
);

export const fetchPendingOrganizers = createAsyncThunk(
  "admin/fetchPendingOrganizers",
  async () => {
    const res = await adminApi.fetchPendingOrganizers();
    return res.data.organizers;
  }
);

export const fetchApprovedOrganizers = createAsyncThunk(
  "admin/fetchApprovedOrganizers",
  async () => {
    const res = await adminApi.fetchApprovedOrganizers();
    return res.data.organizers;
  }
);

export const fetchRejectedOrganizers = createAsyncThunk(
  "admin/fetchRejectedOrganizers",
  async () => {
    const res = await adminApi.fetchRejectedOrganizers();
    return res.data.organizers;
  }
);

export const approveOrganizer = createAsyncThunk(
  "admin/approveOrganizer",
  async (id) => {
    const res = await adminApi.approveOrganizer(id);
    return res.data.organizer;
  }
);

export const rejectOrganizer = createAsyncThunk(
  "admin/rejectOrganizer",
  async (id) => {
    const res = await adminApi.rejectOrganizer(id);
    return res.data.organizer;
  }
);

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchAdminStats",
  async () => {
    const res = await adminApi.fetchAdminStats();
    return res.data.stats;
  }
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async () => {
    const res = await adminApi.fetchAllUsers();
    return res.data.customers;
  }
);

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id) => {
  const res = await adminApi.deleteUser(id);
  return res.data.deleteUser;
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {},
    pendingEvents: [],
    approvedEvents: [],
    rejectedEvents: [],
    pendingOrganizers: [],
    approvedOrganizers: [],
    rejectedOrganizers: [],
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      .addCase(fetchPendingEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingEvents = action.payload;
      })

      .addCase(fetchApprovedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedEvents = action.payload;
      })

      .addCase(fetchRejectedEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRejectedEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedEvents = action.payload;
      })

      .addCase(approveEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedEvents.push(action.payload);
        state.pendingEvents = state.pendingEvents.filter(
          (event) => event._id !== action.payload._id
        );
      })

      .addCase(rejectEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedEvents.push(action.payload);
        state.pendingEvents = state.pendingEvents.filter(
          (event) => event._id !== action.payload._id
        );
      })

      .addCase(fetchPendingOrganizers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPendingOrganizers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOrganizers = action.payload;
      })

      .addCase(fetchApprovedOrganizers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApprovedOrganizers.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedOrganizers = action.payload;
      })

      .addCase(fetchRejectedOrganizers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRejectedOrganizers.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedOrganizers = action.payload;
      })

      .addCase(approveOrganizer.pending, (state) => {
        state.loading = true;
      })
      .addCase(approveOrganizer.fulfilled, (state, action) => {
        state.loading = false;
        state.approvedOrganizers.push(action.payload);
        state.pendingOrganizers = state.pendingOrganizers.filter(
          (organizer) => organizer._id !== action.payload._id
        );
      })

      .addCase(rejectOrganizer.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectOrganizer.fulfilled, (state, action) => {
        state.loading = false;
        state.rejectedOrganizers.push(action.payload);
        state.pendingOrganizers = state.pendingOrganizers.filter(
          (organizer) => organizer._id !== action.payload._id
        );
      })

      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUsers = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload._id;

        state.allUsers = state.allUsers.filter(
          (user) => user._id !== deletedId
        );

        state.approvedOrganizers = state.approvedOrganizers.filter(
          (org) => org._id !== deletedId
        );
      })

      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          console.log("admin api error:", action.error);
          state.loading = false;
          state.error = action.error?.message || "something went wrong";
        }
      );
  },
});

export default adminSlice.reducer;
