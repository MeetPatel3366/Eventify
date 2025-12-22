import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminApi from "../api/adminApi";


export const fetchPendingEvents=createAsyncThunk("admin/fetchPendingEvents",async()=>{
    const res=await adminApi.pendingEvents();
    return res.data.events;
})

const adminSlice=createSlice({
    name:"admin",
    initialState:{
        pendingEvents:[],
        loading:false,
        error:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchPendingEvents.pending,(state)=>{
            state.loading=true;
        })
        .addCase(fetchPendingEvents.fulfilled,(state,action)=>{
            state.loading=false;
            state.pendingEvents=action.payload;
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