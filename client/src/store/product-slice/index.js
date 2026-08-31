import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState={
    products: [],
    isLoading:false
}
export const addNewProduct = createAsyncThunk("/product/addnewproduct",
   async (formData) =>{
const result = await axios.post("http://localhost:5000/api/admin/products/addproduct", formData, {
    withCredentials: true,
    headers:{
        "Content-Type":"application/json",
    }
});
return result?.data
  
   }
)
export const fetchAllProduct = createAsyncThunk("/product/fetchallproduct",
   async () =>{
const result = await axios.get("http://localhost:5000/api/admin/products/getallproduct", {
    withCredentials: true,
});
return result?.data
  
   }
)
export const editProduct = createAsyncThunk("/product/editProduct",
   async ({id,formData}) =>{
const result = await axios.put(`http://localhost:5000/api/admin/product/editproduct/${id}`,formData,{
    headers :{
        "Content-Type":"application/json",
    },
    withCredentials:true,
});
return result?.data
  
   }
)
export const deleteProduct = createAsyncThunk("/product/deleteproduct",
   async ({id}) =>{
const result = await axios.delete(`http://localhost:5000/api/admin/products/deleteproduct/${id}`,{
    withCredentials:true,
});
return result?.data
  
   }
)

const AdminProductSlice= createSlice({
  name:"adminProductSlice",
  initialState,
  reducer:{},
  extraReducers: (builder)=>{
    builder.addCase(fetchAllProduct.pending,(state)=>{
        state.isLoading = true;
    }).addCase(fetchAllProduct.fulfilled,(state,action)=>{
        state.isLoading = false,
        state.products = action.payload
        console.log(action.payload.data);
        
    }).addCase(fetchAllProduct.rejected,(state,action)=>{
        state.isLoading = false,
        state.products = [] 
    })
}
})


export default AdminProductSlice.reducer