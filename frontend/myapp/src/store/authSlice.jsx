import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authApi from "../api/authApi";

export const verifyToken=createAsyncThunk(
    "auth/verifyToken",
    async(_,{getState,rejectWithValue})=>{
        try {
            const token=getState().auth.token
            const res=await authApi.verifyToken(token)
    
            if(!res.data.success)
            {
                return rejectWithValue("Invalid Token")
            }
    
            return {role:localStorage.getItem("role"),token}
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const authSlice=createSlice({
    name:"auth",
    initialState:{
        loading:true,
        token:localStorage.getItem("token"),
        role:localStorage.getItem("role")
    },
    reducers:{
        setAuth:(state,action)=>{
            state.token=action.payload.token;
            state.role=action.payload.role;
            localStorage.setItem("token",action.payload.token);
            localStorage.setItem("role",action.payload.role);
        },
        logout:(state)=>{
            state.token=null;
            state.role=null;
            localStorage.clear();
        },
        stopLoding:(state)=>{
            state.loading=false;
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(verifyToken.pending,(state)=>{
                state.loading=true;
            })
            .addCase(verifyToken.fulfilled,(state,action)=>{
                state.loading=false;
                state.role=action.payload.role;
                state.token=action.payload.token;
            })
            .addCase(verifyToken.rejected,(state)=>{
                state.loading=false;
                state.role=null;
                state.token=null;
                localStorage.clear()
            })
    }
})

export const {setAuth,logout,stopLoding}=authSlice.actions;
export default authSlice.reducer;