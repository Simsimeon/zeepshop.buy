import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	products: [],
	pagination: {
		totalItems: 0,
		currentPage: 1,
		totalPages: 0,
		limit: 20,
	},
	error: null,
	keyword: "",
};

export const searchProducts = createAsyncThunk(
	"search/searchProducts",
	async ({ keyword, page = 1, limit = 20 }, { rejectWithValue }) => {
		try {
			const params = new URLSearchParams({
				keyword: keyword.trim(),
				page: String(page),
				limit: String(limit),
			});
			const response = await axios.get(
				`http://localhost:5000/api/shop/search/?${params.toString()}`,
			);

			return {
				...response.data,
				keyword: keyword.trim(),
			};
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.response?.data?.msg ||
					"Unable to search products",
			);
		}
	},
);

const searchSlice = createSlice({
	name: "search",
	initialState,
	reducers: {
		clearSearch: (state) => {
			state.products = [];
			state.pagination = initialState.pagination;
			state.error = null;
			state.keyword = "";
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(searchProducts.pending, (state, action) => {
				state.isLoading = true;
				state.error = null;
				state.keyword = action.meta.arg.keyword.trim();
			})
			.addCase(searchProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload.data || [];
				state.pagination = action.payload.pagination || initialState.pagination;
				state.keyword = action.payload.keyword;
			})
			.addCase(searchProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.products = [];
				state.error = action.payload || "Unable to search products";
			});
	},
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
 