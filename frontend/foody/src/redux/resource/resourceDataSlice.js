import { createSlice } from "@reduxjs/toolkit";
import { fetchResource } from "../../utils/fetchResource";
const initialState = {
  cities: [],
  categories: [],
  cuisines: [],
  selectedCity: null,
  selectedCategory: null,
  loading: false,
  error: null,
};

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResource.fulfilled, (state, action) => {
        const { type, data } = action.payload;
        state[type] = data;

        // Auto-select first item if not already selected
        if (type === "cities" && !state.selectedCity && data.length > 0) {
          state.selectedCity = data[0];
        }
        if (
          type === "categories" &&
          !state.selectedCategory &&
          data.length > 0
        ) {
          state.selectedCategory = data[0];
        }

        state.loading = false;
      })
      .addCase(fetchResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unknown error";
      });
  },
});

export const {
  setSelectedCity,
  setSelectedCategory,
  setSelectedCuisines,
  setSelectedDistricts,
  setSelectedSubCategories,
} = resourceSlice.actions;
export default resourceSlice.reducer;
