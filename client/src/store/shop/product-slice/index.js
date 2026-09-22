import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const PRODUCTS_URL = "http://localhost:5000/api/shop/products";

/** How long a cached product response stays fresh. */
const CACHE_TTL_MS = 5 * 60 * 1000;

const initialState = {
  isLoading: false,
  isDetailsLoading: false,
  products: [],
  productDetails: null,
  error: null,
  /** { [filter+sort key]: { products, fetchedAt } } */
  listCache: {},
  /** { [productId]: { product, fetchedAt } } */
  detailsCache: {},
};

function buildListCacheKey({ filterParams, sortedParams }) {
  const filters = Object.keys(filterParams || {})
    .sort()
    .map((key) => {
      const value = filterParams[key];
      const normalized = Array.isArray(value)
        ? [...value].sort().join(",")
        : String(value);
      return `${key}=${normalized}`;
    })
    .join("&");

  return `${sortedParams || "default"}::${filters}`;
}

function getFreshCacheEntry(entry) {
  if (!entry) return null;
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS ? entry : null;
}

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.response?.data?.msg || fallback;
}

export const fetchAllShoppingViewProduct = createAsyncThunk(
  "/products/fetchAllShoppingViewProduct",
  async ({ filterParams, sortedParams }, { getState, rejectWithValue }) => {
    const cacheKey = buildListCacheKey({ filterParams, sortedParams });
    const cached = getFreshCacheEntry(
      getState().shopProduct.listCache[cacheKey],
    );

    // Serve from cache without a network round trip.
    if (cached) {
      return { cacheKey, products: cached.products, fromCache: true };
    }

    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortedParams,
      });
      const result = await axios.get(`${PRODUCTS_URL}/get?${query}`);

      return {
        cacheKey,
        products: result?.data?.data || [],
        fromCache: false,
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load products"));
    }
  },
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id, { getState, rejectWithValue }) => {
    const cached = getFreshCacheEntry(getState().shopProduct.detailsCache[id]);

    if (cached) {
      return { id, product: cached.product, fromCache: true };
    }

    try {
      const result = await axios.get(`${PRODUCTS_URL}/get/${id}`);

      return { id, product: result?.data?.data || null, fromCache: false };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load product details"),
      );
    }
  },
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    /** Call after a product is created, edited, or deleted. */
    invalidateProductCache: (state) => {
      state.listCache = {};
      state.detailsCache = {};
    },
    invalidateProductDetails: (state, action) => {
      if (action.payload) {
        delete state.detailsCache[action.payload];
      } else {
        state.detailsCache = {};
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllShoppingViewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllShoppingViewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;

        // Only write to the cache on a real network response.
        if (!action.payload.fromCache) {
          state.listCache[action.payload.cacheKey] = {
            products: action.payload.products,
            fetchedAt: Date.now(),
          };
        }
      })
      .addCase(fetchAllShoppingViewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.products = [];
        state.error = action.payload || "Unable to load products";
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isDetailsLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isDetailsLoading = false;
        state.productDetails = action.payload.product;

        if (!action.payload.fromCache) {
          state.detailsCache[action.payload.id] = {
            product: action.payload.product,
            fetchedAt: Date.now(),
          };
        }
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isDetailsLoading = false;
        state.productDetails = null;
        state.error = action.payload || "Unable to load product details";
      });
  },
});

export const { invalidateProductCache, invalidateProductDetails } =
  shoppingProductSlice.actions;
export default shoppingProductSlice.reducer;