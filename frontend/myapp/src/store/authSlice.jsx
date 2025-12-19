import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

export const verifyToken = createAsyncThunk(
    "auth/verifyToken",
    async (_, { rejectWithValue }) => {
        try {
            const res = await authApi.verifyToken() //cookie auto sent

            if (!res.data.success) {
                return rejectWithValue("Invalid Token")
            }

            return { role: res.data.role }
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: true,
        role: localStorage.getItem("role"),
        isAuthenticated: false
    },
    reducers: {
        setAuth: (state, action) => {
            state.role = action.payload.role;
            state.isAuthenticated=true;
            localStorage.setItem("role", action.payload.role);
        },
        logout: (state) => {
            state.isAuthenticated=false;
            state.role = null;
            localStorage.clear();
        },
        stopLoding: (state) => {
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyToken.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyToken.fulfilled, (state, action) => {
                state.loading = false;
                state.role = action.payload.role;
                state.isAuthenticated = true
                localStorage.setItem("role", action.payload.role);
            })
            .addCase(verifyToken.rejected, (state) => {
                state.loading = false;
                state.role = null;
                state.isAuthenticated = false;
                localStorage.clear()
            })
    }
})

export const { setAuth, logout, stopLoding } = authSlice.actions;
export default authSlice.reducer;