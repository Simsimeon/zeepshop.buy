import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"
import adminProductSlice from "./admin/product-slice"
import shoppingProductsSlice from "./shop/product-slice"
import shoppingCartSlice from "./shop/cart-slice"

const Store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductSlice,
        shopProduct: shoppingProductsSlice,
        shopCart:shoppingCartSlice
    }
})


export default Store