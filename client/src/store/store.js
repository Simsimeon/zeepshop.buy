import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"
import adminProductSlice from "./product-slice"

const Store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductSlice
    }
})


export default Store