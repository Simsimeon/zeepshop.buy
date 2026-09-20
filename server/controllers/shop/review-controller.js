const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../../errors");
const Review = require("../../model/Review.model");
const Product = require("../../model/product.model");
const Order = require("../../model/Order.model");

function getAuthenticatedUserId(req) {
	return req.user?.userInfo?.userId || req.user?.userId || req.user?._id;
}

function getAuthenticatedUserRole(req) {
	return req.user?.userInfo?.role || req.user?.role;
}

function getAuthenticatedUsername(req) {
	return req.user?.userInfo?.username || req.user?.username;
}

function getProductId(req) {
	return req.params.productId || req.body.productId;
}

function getReviewId(req) {
	return req.params.reviewId || req.params.id;
}

function validateReviewInput({ rating, title, comment }) {
	const numericRating = Number(rating);

	if (
		!Number.isInteger(numericRating) ||
		numericRating < 1 ||
		numericRating > 5 ||
		typeof title !== "string" ||
		!title.trim() ||
		typeof comment !== "string" ||
		!comment.trim()
	) {
		throw new BadRequestError("Rating, title, and comment are required");
	}

	return {
		rating: numericRating,
		title: title.trim(),
		comment: comment.trim(),
	};
}
const getAllReviews = async (req, res) => {
	const allReviews = await Review.find({})
		.populate({
			path: "product",
			select: "title image Brand price salePrice",
		})
		.populate({
			path: "user",
			select: "username email",
		})
		.sort({ _id: -1 });

	return res.status(StatusCodes.OK).json({
		success: true,
		data: allReviews,
	});
};

async function createReview(req, res) {
	const userId = getAuthenticatedUserId(req);
	const productId = getProductId(req);

	if (!userId || !productId) {
		throw new BadRequestError("User and product are required");
	}

	if (getAuthenticatedUserRole(req) === "admin") {
		throw new UnauthorizedError("Admins cannot create product reviews");
	}

	if (!mongoose.isValidObjectId(productId)) {
		throw new BadRequestError("Invalid product id");
	}

	const product = await Product.findById(productId);
	if (!product) {
		throw new NotFoundError("Product not found");
	}

	const isProductCreator =
		String(product.user) === String(userId) ||
		(product.productCreator && product.productCreator === getAuthenticatedUsername(req));

	if (isProductCreator) {
		throw new UnauthorizedError("You cannot review your own product");
	}

	const confirmedOrder = await Order.findOne({
		userId: String(userId),
		orderStatus: "confirmed",
		"cartItem.productId": String(productId),
	});

	if (!confirmedOrder) {
		throw new UnauthorizedError("You can review only products you have purchased");
	}

	const reviewData = validateReviewInput(req.body);
	const existingReview = await Review.findOne({ product: productId, user: userId });

	if (existingReview) {
		throw new BadRequestError("You have already reviewed this product");
	}

	const review = await Review.create({
		...reviewData,
		product: productId,
		user: userId,
	});

	return res.status(StatusCodes.CREATED).json({
		success: true,
		data: review,
	});
}

async function updateReview(req, res) {
	const userId = getAuthenticatedUserId(req);
	const reviewId = getReviewId(req);

	if (!userId || !reviewId || !mongoose.isValidObjectId(reviewId)) {
		throw new BadRequestError("Invalid review credentials");
	}

	if (getAuthenticatedUserRole(req) === "admin") {
		throw new UnauthorizedError("Admins cannot update reviews");
	}

	const review = await Review.findOne({ _id: reviewId, user: userId });
	if (!review) {
		throw new NotFoundError("Review not found");
	}

	const reviewData = validateReviewInput({
		rating: req.body.rating ?? review.rating,
		title: req.body.title ?? review.title,
		comment: req.body.comment ?? review.comment,
	});

	review.set(reviewData);
	await review.save();

	return res.status(StatusCodes.OK).json({
		success: true,
		data: review,
	});
}

async function deleteReview(req, res) {
	const userId = getAuthenticatedUserId(req);
	const reviewId = getReviewId(req);

	if (!userId || !reviewId || !mongoose.isValidObjectId(reviewId)) {
		throw new BadRequestError("Invalid review credentials");
	}

	const isAdmin = getAuthenticatedUserRole(req) === "admin";
	const review = await Review.findById(reviewId);
	if (!review) {
		throw new NotFoundError("Review not found");
	}

	if (!isAdmin && String(review.user) !== String(userId)) {
		throw new UnauthorizedError("You can only delete your own review");
	}

	const productId = review.product;
	await review.deleteOne();
	await Review.calculateAverageRating(productId);

	return res.status(StatusCodes.OK).json({
		success: true,
		message: "Review deleted successfully",
	});
}

module.exports = { createReview, updateReview, deleteReview,getAllReviews };
