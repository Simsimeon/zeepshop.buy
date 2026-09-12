const express = require("express");
const { addToCart, fetchCartItem, updateCartItemQuantity, deleteCartItem } = require("../../controllers/shop/cart-controller");
const authMiddleware = require("../../utils/authMiddleware");

const Routes = express.Router();


Routes.post("/add", authMiddleware, addToCart)
Routes.get("/get/:userId", authMiddleware, fetchCartItem)
Routes.put("/update-cart", authMiddleware, updateCartItemQuantity)
Routes.delete("/:userId/:productId", authMiddleware, deleteCartItem)




module.exports = Routes