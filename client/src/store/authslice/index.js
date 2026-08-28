import { toast } from "@/components/ui/toast"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState ={
    isAuthenticated:false,
    user:null,
    isLoading:true,
}
export const registerUser = createAsyncThunk("/auth/register",
async(formData)=>{
    try{
        const response = await axios.post("http://localhost:5000/api/auth/register",formData,{
            withCredentials:true
        }
     )
     return response.data 

    }catch(error){
        const errorMessage =error.response?.data?.msg;
        const correctError = errorMessage.split(",")[1]
        
        toast.add({
        type: "error",
       title: " Sorry an error occurred while registering ",
       description:correctError, 
        
      })
    console.log(error.response?.data?.msg || " gooood works");
    
    
        
    }
}


)
export const loginUser = createAsyncThunk("/auth/login",
async(formData)=>{
    try{
        const response = await axios.post("http://localhost:5000/api/auth/login",formData,{
            withCredentials:true
        }
     )
     return response.data 

    }catch(error){
        const errorMessage =error.response?.data?.msg;
    
        
        toast.add({
        type: "error",
       title: " Sorry an error occurred during login ",
       description:errorMessage, 
        
      })
    console.log(error.response?.data?.msg || "good works");
    
    
        
    }
}


)
export const checkAuth = createAsyncThunk("/auth/check",
async()=>{
    try{
        const response = await axios.get("http://localhost:5000/api/auth/check",{
            withCredentials:true,
            headers:{
                "Cache-control":"no-store,no-cache,must-revalidate,proxy-revalidate",
                Expires:0
            }
        }
     )
     return response.data 

    }catch(error){
        const errorMessage =error.response?.data?.msg;
    
        
        toast.add({
        type: "error",
       title: " Sorry an error occurred during login ",
       description:errorMessage, 
        
      })
    console.log(error.response?.data?.msg || "good works");
    
    
        
    }
}


)

const authSlice = createSlice({
name:"auth",
initialState,
reducers:{
    setUser:(state,action)=>{

    }
},
extraReducers: (builder)=>{
    builder.addCase(registerUser.pending,(state)=>{
        state.isLoading = true
    }).addCase(registerUser.fulfilled,(state,action)=>{
        state.isLoading =false;
        state.user = null;
        state.isAuthenticated = false;
    }).addCase(registerUser.rejected,(state)=>{
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
    }).addCase(loginUser.pending,(state)=>{
        state.isLoading = true
    }).addCase(loginUser.fulfilled,(state,action)=>{
        state.isLoading =false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
    }).addCase(loginUser.rejected,(state)=>{
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
    }).addCase(checkAuth.pending,(state)=>{
        state.isLoading = true
    }).addCase(checkAuth.fulfilled,(state,action)=>{
        state.isLoading =false;
        console.log(action);
        state.user = action.payload !==undefined? action.payload.user:null;
        state.isAuthenticated = action.payload !==undefined ? true:false;;
    }).addCase(checkAuth.rejected,(state)=>{
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
    })
}
}
)


export const {setUser} =authSlice.actions;
export default authSlice.reducer;