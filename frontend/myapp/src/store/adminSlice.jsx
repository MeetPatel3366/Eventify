import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";


export const fetchPendingEvents = createAsyncThunk("admin/fetchPendingEvents", async () => {
    const res = await adminApi.pendingEvents();
    return res.data.events;
})

export const approveEvent = createAsyncThunk("admin/approveEvent", async (id) => {
    const res = await adminApi.approveEvent(id)
    return res.data.event;
})

export const rejectEvent = createAsyncThunk("admin/rejectEvent", async (id) => {
    const res = await adminApi.rejectEvent(id)
    return res.data.event;
})

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        pendingEvents: [],
        approvedEvents: [],
        rejectedEvents: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPendingEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPendingEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingEvents = action.payload;
            })

            .addCase(approveEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(approveEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.approvedEvents.push(action.payload)
                state.pendingEvents = state.pendingEvents.filter(
                    (event) => event._id !== action.payload._id
                );
            })

            .addCase(rejectEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.rejectedEvents.push(action.payload)
                state.pendingEvents = state.pendingEvents.filter(
                    (event) => event._id !== action.payload._id
                );
            })

            .addMatcher(
                (action) => action.type.endsWith("rejected"),
                (state, action) => {
                    console.error("event api error:", action.error);
                    state.loading = false;
                    state.error = action.error?.message || "something went wrong"
                }
            )
    }
})


export default adminSlice.reducer;