const express = require("express");
const {
	createOrder,
	verifyOrderPayment,
	getUserOrders,
	getAllOrders,
	updateOrderStatus,
} = require("../../controllers/shop/createOrder");
const authMiddleware = require("../../utils/authMiddleware");

const Routes = express.Router();

Routes.post("/create", authMiddleware,authMiddleware.authorizePermissions("user"), createOrder);
Routes.get("/verify", authMiddleware,authMiddleware.authorizePermissions("user") ,verifyOrderPayment);
Routes.get("/user/:userId", authMiddleware,authMiddleware.authorizePermissions("user") ,getUserOrders);
Routes.get("/all", authMiddleware,authMiddleware.authorizePermissions("admin") ,getAllOrders);
Routes.put("/:id/status", authMiddleware,authMiddleware.authorizePermissions("admin") ,updateOrderStatus);

module.exports = Routes;
