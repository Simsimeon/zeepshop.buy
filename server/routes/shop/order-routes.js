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

Routes.post("/create", authMiddleware, createOrder);
Routes.get("/verify", authMiddleware, verifyOrderPayment);
Routes.get("/user/:userId", authMiddleware, getUserOrders);
Routes.get("/all", authMiddleware, getAllOrders);
Routes.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = Routes;
