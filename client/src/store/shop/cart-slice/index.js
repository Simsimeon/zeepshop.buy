import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    isLoading: false,
    cartItem :[],
}

  export const addToCart = createAsyncThunk("cart/add", async function({userId,productId,quantity}){

    const response = await axios.post(`http://localhost:5000/api/shop/cart/add`,{
        userId,
        productId,
        quantity
    }, {
        withCredentials: true,
    })
  
  return response.data
  })
  export const fetchCartItem = createAsyncThunk("cart/fetchCartItem", async function(userId){

        const response = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`, {
                withCredentials: true,
        })
  
  return response.data
  })
    export const deleteCartItem = createAsyncThunk("cart/deleteCartItem", async function({userId, productId}){

        const response = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`, {
                withCredentials: true,
        })
  
  return response.data
  })
    export const updateCartQuantity = createAsyncThunk("cart/updateCartQuantity", async function({userId, productId, quantity}){

    const response = await axios.put(`http://localhost:5000/api/shop/cart/update-cart`,{
        userId,
        productId,
        quantity
    }, {
        withCredentials: true,
    })
  
  return response.data
  })
 const shoppingCartSlice = createSlice({
    name:"shoppingCart",
    initialState,
    reducers(){

    },
    extraReducers(builder){
    builder.addCase(addToCart.pending,(state)=>{
        state.isLoading = true
    }).addCase(addToCart.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.cartItem = action.payload.data
    }).addCase(addToCart.rejected,(state)=>{
        state.isLoading = false,
        state.cartItem=[]
    }).addCase(fetchCartItem.pending,(state)=>{
        state.isLoading = true
    }).addCase(fetchCartItem.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.cartItem = action.payload.data
    }).addCase(fetchCartItem.rejected,(state)=>{
        state.isLoading = false,
        state.cartItem=[]
    }).addCase(updateCartQuantity.pending,(state)=>{
        state.isLoading = true
    }).addCase(updateCartQuantity.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.cartItem = action.payload.data
    }).addCase(updateCartQuantity.rejected,(state)=>{
        state.isLoading = false,
        state.cartItem=[]
    }).addCase(deleteCartItem.pending,(state)=>{
        state.isLoading = true
    }).addCase(deleteCartItem.fulfilled,(state,action)=>{
        state.isLoading = false;
        state.cartItem = action.payload.data
    }).addCase(deleteCartItem.rejected,(state)=>{
        state.isLoading = false,
        state.cartItem=[]
    })
    }
 })



 export default shoppingCartSlice.reducer