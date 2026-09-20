const express = require("express");
const {
	createReview,
	updateReview,
	deleteReview,
    getAllReviews,
} = require("../../controllers/shop/review-controller");
const authMiddleware = require("../../utils/authMiddleware");

const Routes = express.Router();
Routes.get("/",getAllReviews)
Routes.post("/product/:productId", authMiddleware, createReview);
Routes.put("/:reviewId", authMiddleware, updateReview);
Routes.delete("/:reviewId", authMiddleware, deleteReview);

module.exports = Routes;
