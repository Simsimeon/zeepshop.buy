import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice"
import adminProductSlice from "./admin/product-slice"
import shoppingProductsSlice from "./shop/product-slice"
import shoppingCartSlice from "./shop/cart-slice"
import shopAddressSlice from "./shop/address-slice"
const Store = configureStore({
    reducer:{
        auth:authReducer,
        adminProducts:adminProductSlice,
        shopProduct: shoppingProductsSlice,
        shopCart:shoppingCartSlice,
        shopAddress: shopAddressSlice
    }
})


export default Store