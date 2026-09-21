const express = require("express");
const { addToCart, fetchCartItem, updateCartItemQuantity, deleteCartItem } = require("../../controllers/shop/cart-controller");
const authMiddleware = require("../../utils/authMiddleware");

const Routes = express.Router();


Routes.post("/add", authMiddleware,authMiddleware.authorizePermissions("user"), addToCart)
Routes.get("/get/:userId", authMiddleware,authMiddleware.authorizePermissions("user"), fetchCartItem)
Routes.put("/update-cart", authMiddleware,authMiddleware.authorizePermissions("user"), updateCartItemQuantity)
Routes.delete("/:userId/:productId", authMiddleware,authMiddleware.authorizePermissions("user"), deleteCartItem)




module.exports = Routes