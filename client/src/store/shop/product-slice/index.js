import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const  initialState={
    isLoading:false,
    isDetailsLoading:false,
    products:[],
    productDetails:null
}
export const fetchAllShoppingViewProduct =createAsyncThunk(
    "/products/fetchAllShoppingViewProduct",
    async({filterParams,sortedParams})=>{


        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortedParams
        })
                const result = await axios.get(`http://localhost:5000/api/shop/products/get?${query}`)
                return result?.data?.data || []
    }
)
export const fetchProductDetails =createAsyncThunk(
    "/products/fetchProductDetails",
    async(id)=>{

                const result = await axios.get(`http://localhost:5000/api/shop/products/get/${id}`)
                return result?.data?.data || null
    }
)
const shoppingProductSlice = createSlice({
   name:"shoppingProducts",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
       builder.addCase(fetchAllShoppingViewProduct.pending,(state,action)=>{
        state.isLoading=true
       }).addCase(fetchAllShoppingViewProduct.fulfilled,(state,action)=>{
        console.log(action.payload);
        
        state.isLoading=false,
        state.products=action.payload
       }).addCase(fetchAllShoppingViewProduct.rejected,(state,action)=>{
        state.isLoading=false,
        state.products =[]
       }).addCase(fetchProductDetails.pending,(state)=>{
          state.isDetailsLoading=true
        
    }).addCase(fetchProductDetails.fulfilled,(state,action)=>{
              state.isDetailsLoading=false,
           console.log(action.payload,"details");
           
            state.productDetails=action.payload
       
       }).addCase(fetchProductDetails.rejected,(state)=>{
          state.isDetailsLoading=false;
        state.productDetails =null;
       })
    }
})

export default shoppingProductSlice.reducer