const express = require("express");
const {
	createReview,
	updateReview,
	deleteReview,
    getAllReviews,
} = require("../../controllers/shop/review-controller");
const authMiddleware = require("../../utils/authMiddleware");

const Routes = express.Router();
Routes.get("/",authMiddleware,authMiddleware.authorizePermissions("admin"), getAllReviews)
Routes.post("/product/:productId", authMiddleware,authMiddleware.authorizePermissions("user"), createReview);
Routes.put("/:reviewId", authMiddleware,authMiddleware.authorizePermissions("user") ,updateReview);
Routes.delete("/:reviewId", authMiddleware,authMiddleware.authorizePermissions("user") ,deleteReview);

module.exports = Routes;
