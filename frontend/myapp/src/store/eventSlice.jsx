import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import eventApi from "../api/eventApi";

export const fetchEvents = createAsyncThunk("events/fetchAll", async () => {
    const res = await eventApi.fetchAll();
    return res.data.events;
})

export const fetchEvent = createAsyncThunk("events/fetchOne", async (id) => {
    const res = await eventApi.fetchOne(id);
    return res.data.event;
})

export const fetchMyEvents = createAsyncThunk("events/fetchMy", async () => {
    const res = await eventApi.fetchMy();
    return res.data.events;
})

export const addEvent = createAsyncThunk("events/add", async (formData) => {
    const res = await eventApi.add(formData)
    return res.data.event;
})

export const updateEvent = createAsyncThunk("events/update", async ({ id, formData }) => {
    const res = await eventApi.update(id, formData)
    return res.data.updatedEvent;
})

export const deleteEvent = createAsyncThunk("events/delete", async (id) => {
    await eventApi.delete(id)
    return id;
})

const eventSlice = createSlice({
    name: "event",
    initialState: {
        events: [],
        myEvents: [],
        event: null,
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })

            .addCase(fetchEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.event = action.payload;
            })

            .addCase(fetchMyEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.myEvents = action.payload;
            })

            .addCase(addEvent.pending, (state) => {
                state.loading = true
            })
            .addCase(addEvent.fulfilled, (state, action) => {
                state.loading = false
                state.events.push(action.payload)
                state.myEvents.push(action.payload)
            })

            .addCase(updateEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEvent.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.events.findIndex((e) => e._id == action.payload._id);
                if (index !== -1) {
                    state.events[index] = action.payload
                }
            })

            .addCase(deleteEvent.pending, (state) => {
                state.loading = true
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.events = state.events.filter((e) => e._id !== action.payload)
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

export default eventSlice.reducer;