import { createSlice } from "@reduxjs/toolkit";
import { fetchResource } from "../../utils/fetchResource";
const initialState = {
  selectedDistricts: [],
  selectedCuisines: [],
  selectedSubCategories: [],
  districts: [],
  subCategories: [],
};

const resourceFilterSlice = createSlice({
  name: "resourceFilter",
  initialState,
  reducers: {
    setSelectedDistricts: (state, action) => {
      state.selectedDistricts = action.payload;
    },
    setSelectedCuisines: (state, action) => {
      state.selectedCuisines = action.payload;
    },
    setSelectedSubCategories: (state, action) => {
      state.selectedSubCategories = action.payload;
    },
    resetFilters: (state) => {
      state.selectedDistricts = [];
      state.selectedCuisines = [];
      state.selectedSubCategories = [];
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

        state.loading = false;
      })
      .addCase(fetchResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Unknown error";
      });
  },
});

export const {
  setSelectedDistricts,
  setSelectedCuisines,
  setSelectedSubCategories,
  resetFilters,
} = resourceFilterSlice.actions;

export default resourceFilterSlice.reducer;
