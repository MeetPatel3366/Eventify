import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.verifyToken(); //cookie auto sent

      if (!res.data.success) {
        return rejectWithValue("Invalid Token");
      }

      return { role: res.data.role };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const getMyProfile = createAsyncThunk(
  "auth/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMyProfile(); //cookie auto sent

      if (!res.data.success) {
        return rejectWithValue("Failed to fetch profile");
      }

      return res.data.profile;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await authApi.updateProfile(formData);
      return res.data.profile;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: true,
    profileLoading: false,
    updateLoading: false,
    role: localStorage.getItem("role"),
    isAuthenticated: false,
    user: null,
  },
  reducers: {
    setAuth: (state, action) => {
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      localStorage.clear();
    },
    stopLoding: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.loading = false;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        localStorage.setItem("role", action.payload.role);
      })
      .addCase(verifyToken.rejected, (state) => {
        state.loading = false;
        state.role = null;
        state.isAuthenticated = false;
        localStorage.clear();
      })

      .addCase(getMyProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(getMyProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload;
      })

      .addCase(updateMyProfile.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.user = action.payload;
      });
  },
});

export const { setAuth, logout, stopLoding } = authSlice.actions;
export default authSlice.reducer;
