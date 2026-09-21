import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	reviews: [],
	error: null,
};

function getErrorMessage(error, fallback) {
	return error.response?.data?.message || error.response?.data?.msg || fallback;
}

export const createReview = createAsyncThunk(
	"review/createReview",
	async ({ productId, rating, title, comment }, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				`http://localhost:5000/api/reviews/product/${productId}`,
				{ rating, title, comment },
				{ withCredentials: true },
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				getErrorMessage(error, "Unable to create review"),
			);
		}
	},
);

export const getAllReviews = createAsyncThunk(
	"review/getAllReviews",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("http://localhost:5000/api/reviews");
			return response.data;
		} catch (error) {
			return rejectWithValue(
				getErrorMessage(error, "Unable to load reviews"),
			);
		}
	},
);

export const updateReview = createAsyncThunk(
	"review/updateReview",
	async ({ reviewId, rating, title, comment }, { rejectWithValue }) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/api/reviews/${reviewId}`,
				{ rating, title, comment },
				{ withCredentials: true },
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				getErrorMessage(error, "Unable to update review"),
			);
		}
	},
);

export const deleteReview = createAsyncThunk(
	"review/deleteReview",
	async (reviewId, { rejectWithValue }) => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/reviews/${reviewId}`,
				{ withCredentials: true },
			);
			return { ...response.data, reviewId };
		} catch (error) {
			return rejectWithValue(
				getErrorMessage(error, "Unable to delete review"),
			);
		}
	},
);

const reviewSlice = createSlice({
	name: "review",
	initialState,
	reducers: {
		clearReviewError: (state) => {
			state.error = null;
		},
		clearReviews: (state) => {
			state.reviews = [];
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllReviews.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getAllReviews.fulfilled, (state, action) => {
				state.isLoading = false;
				state.reviews = action.payload.data || [];
			})
			.addCase(getAllReviews.rejected, (state, action) => {
				state.isLoading = false;
				state.reviews = [];
				state.error = action.payload || "Unable to load reviews";
			})
			.addCase(createReview.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createReview.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload.data) {
					state.reviews.unshift(action.payload.data);
				}
			})
			.addCase(createReview.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to create review";
			})
			.addCase(updateReview.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateReview.fulfilled, (state, action) => {
				state.isLoading = false;
				const updatedReview = action.payload.data;
				state.reviews = state.reviews.map((review) =>
					review._id === updatedReview?._id ? updatedReview : review,
				);
			})
			.addCase(updateReview.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to update review";
			})
			.addCase(deleteReview.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteReview.fulfilled, (state, action) => {
				state.isLoading = false;
				state.reviews = state.reviews.filter(
					(review) => review._id !== action.payload.reviewId,
				);
			})
			.addCase(deleteReview.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to delete review";
			});
	},
});

export const { clearReviewError, clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
