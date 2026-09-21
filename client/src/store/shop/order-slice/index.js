import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	order: null,
	orders: [],
	payment: null,
	error: null,
};

export const createOrder = createAsyncThunk(
	"order/createOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/shop/order/create",
				orderData,
				{ withCredentials: true },
			);

			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.response?.data?.msg ||
					"Unable to create order",
			);
		}
	},
);

export const verifyOrderPayment = createAsyncThunk(
	"order/verifyOrderPayment",
	async (reference, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/shop/order/verify?reference=${encodeURIComponent(reference)}`,
				{ withCredentials: true },
			);

			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.response?.data?.msg ||
					"Unable to verify payment",
			);
		}
	},
);

export const fetchUserOrders = createAsyncThunk(
	"order/fetchUserOrders",
	async (userId, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/shop/order/user/${userId}`,
				{ withCredentials: true },
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Unable to load orders",
			);
		}
	},
);

export const fetchAllOrders = createAsyncThunk(
	"order/fetchAllOrders",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				"http://localhost:5000/api/shop/order/all",
				{ withCredentials: true },
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Unable to load orders",
			);
		}
	},
);

export const updateOrderStatus = createAsyncThunk(
	"order/updateOrderStatus",
	async ({ orderId, status }, { rejectWithValue }) => {
		try {
			const response = await axios.put(
				`http://localhost:5000/api/shop/order/${orderId}/status`,
				{ status },
				{ withCredentials: true },
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Unable to update order status",
			);
		}
	},
);

const orderSlice = createSlice({
	name: "shopOrder",
	initialState,
	reducers: {
		clearOrderState: (state) => {
			state.order = null;
			state.orders = [];
			state.payment = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.order = action.payload.data?.order || null;
				state.payment = action.payload.data?.payment || null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to create order";
			})
			.addCase(verifyOrderPayment.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(verifyOrderPayment.fulfilled, (state, action) => {
				state.isLoading = false;
				state.order = action.payload.data || state.order;
			})
			.addCase(verifyOrderPayment.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to verify payment";
			})
			.addCase(fetchUserOrders.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchUserOrders.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orders = action.payload.data || [];
			})
			.addCase(fetchUserOrders.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to load orders";
			})
			.addCase(fetchAllOrders.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchAllOrders.fulfilled, (state, action) => {
				state.isLoading = false;
				state.orders = action.payload.data || [];
			})
			.addCase(fetchAllOrders.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to load orders";
			})
			.addCase(updateOrderStatus.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateOrderStatus.fulfilled, (state, action) => {
				state.isLoading = false;
				const updatedOrder = action.payload.data;
				state.orders = state.orders.map((item) =>
					item._id === updatedOrder._id ? updatedOrder : item,
				);
				state.order = updatedOrder;
			})
			.addCase(updateOrderStatus.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload || "Unable to update order status";
			});
	},
});

export const { clearOrderState } = orderSlice.actions;
export default orderSlice.reducer;
