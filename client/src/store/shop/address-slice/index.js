import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState ={
    isLoading:false,
    addressList:[]
}

export const addNewAddress = createAsyncThunk("/address/addNewAddress",async function(formData){
  const response = await axios.post(`http://localhost:5000/api/shop/address/add`,formData,{
      withCredentials: true,
  })  

 return response.data;

})

export const fetchAllAddress = createAsyncThunk("/address/fetchAllAddresses",async function(userId){
  const response = await axios.get(`http://localhost:5000/api/shop/address/get/${userId}`,{
    withCredentials:true,
  })  

 return response.data;

})
export const editAddress = createAsyncThunk("/address/editAddress",async function({userId,addressId,formData}){
  const response = await axios.put(`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,formData,{
    withCredentials:true,
  })  

 return response.data;

})
export const deleteAddress = createAsyncThunk("/address/deleteAddress",async function({userId,addressId}){
  const response = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`,{
    withCredentials:true,
  });  

 return response.data;

})


const addressSlice=createSlice({
    name:'address',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase(addNewAddress.pending,(state)=>{
          state.isLoading=true  
        }).addCase(addNewAddress.fulfilled,(state,action)=>{
          state.isLoading=false
        }).addCase(addNewAddress.rejected,(state)=>{
          state.isLoading=false
        }).addCase(fetchAllAddress.pending,(state)=>{
          state.isLoading=true
        }).addCase(fetchAllAddress.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.addressList= action.payload.data  
        }).addCase(fetchAllAddress.rejected,(state)=>{
            state.isLoading=false,
            state.addressList=[]  
        })
    }
})


export default addressSlice.reducer;