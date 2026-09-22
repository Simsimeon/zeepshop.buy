import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

/**
 * Hero image API — mirrors server/routes/common/heroimage.js
 *
 * GET  /api/heroimage  -> { success, data: HeroImage[] }   (admin only)
 * POST /api/heroimage  -> { success, data: HeroImage }     (admin only)
 *
 * The POST body is `{ image }`, where `image` must be either:
 *   - a base64 data URL, e.g. "data:image/png;base64,iVBORw0..."
 *   - an http(s) URL pointing to an image
 * Validated server-side: real image content sniffed from magic bytes,
 * declared MIME must match, max 5MB.
 */
const HERO_IMAGE_URL = "http://localhost:5000/api/heroimage";

const initialState = {
  isLoading: false,
  isSubmitting: false,
  isDeleting: false,
  deletingId: null,
  heroImages: [],
  error: null,
};

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || error.response?.data?.msg || fallback;
}

export const getHeroImages = createAsyncThunk(
  "heroImage/getHeroImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(HERO_IMAGE_URL, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load hero images"),
      );
    }
  },
);

export const addHeroImage = createAsyncThunk(
  "heroImage/addHeroImage",
  async (image, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        HERO_IMAGE_URL,
        { image },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to add hero image"),
      );
    }
  },
);

export const deleteHeroImage = createAsyncThunk(
  "heroImage/deleteHeroImage",
  async (heroImageId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${HERO_IMAGE_URL}/${heroImageId}`, {
        withCredentials: true,
      });
      return { ...response.data, heroImageId };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to delete hero image"),
      );
    }
  },
);

const heroImageSlice = createSlice({
  name: "heroImage",
  initialState,
  reducers: {
    clearHeroImageError: (state) => {
      state.error = null;
    },
    clearHeroImages: (state) => {
      state.heroImages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHeroImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHeroImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.heroImages = action.payload.data || [];
      })
      .addCase(getHeroImages.rejected, (state, action) => {
        state.isLoading = false;
        state.heroImages = [];
        state.error = action.payload || "Unable to load hero images";
      })
      .addCase(addHeroImage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(addHeroImage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload.data) {
          state.heroImages.push(action.payload.data);
        }
      })
      .addCase(addHeroImage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || "Unable to add hero image";
      })
      .addCase(deleteHeroImage.pending, (state, action) => {
        state.isDeleting = true;
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deleteHeroImage.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deletingId = null;
        state.heroImages = state.heroImages.filter(
          (heroImage) => heroImage._id !== action.payload.heroImageId,
        );
      })
      .addCase(deleteHeroImage.rejected, (state, action) => {
        state.isDeleting = false;
        state.deletingId = null;
        state.error = action.payload || "Unable to delete hero image";
      });
  },
});

export const { clearHeroImageError, clearHeroImages } = heroImageSlice.actions;
export default heroImageSlice.reducer;
