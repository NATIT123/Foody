import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false,
  isError: false,
  data: [],
  errors: [],
  isCreating: false,
  isCreateSuccess: false,
  isUpdating: false,
  isUpdatingSuccess: false,
  isDelete: false,
  isDeleteSuccess: false,
};

// Actions
export const fetchRestaurantPending = createAction("fetchRestaurantPending");
export const fetchRestaurantSuccess = createAction("fetchRestaurantSuccess");
export const fetchRestaurantFailed = createAction("fetchRestaurantFailed");

export const createRestaurantPending = createAction("createRestaurantPending");
export const createRestaurantSuccess = createAction("createRestaurantSuccess");
export const createRestaurantFailed = createAction("createRestaurantFailed");

export const updateRestaurantPending = createAction("updateRestaurantPending");
export const updateRestaurantSuccess = createAction("updateRestaurantSuccess");
export const updateRestaurantFailed = createAction("updateRestaurantFailed");

export const deleteRestaurantPending = createAction("deleteRestaurantPending");
export const deleteRestaurantSuccess = createAction("deleteRestaurantSuccess");
export const deleteRestaurantFailed = createAction("deleteRestaurantFailed");

// Slice
const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantPending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchRestaurantSuccess, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchRestaurantFailed, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(createRestaurantPending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createRestaurantSuccess, (state, action) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
        state.data = [action.payload, ...state.data];
      })
      .addCase(createRestaurantFailed, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })
      .addCase(updateRestaurantPending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(updateRestaurantSuccess, (state, action) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = true;
        const updatedRestaurant = action.payload;
        state.data = state.data.map((r) =>
          r.id === updatedRestaurant.id ? updatedRestaurant : r
        );
      })
      .addCase(updateRestaurantFailed, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = false;
      })
      .addCase(deleteRestaurantPending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteRestaurantSuccess, (state, action) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
        const deletedRestaurant = action.payload;
        state.data = state.data.filter((r) => r.id !== deletedRestaurant.id);
      })
      .addCase(deleteRestaurantFailed, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export default restaurantSlice.reducer;
