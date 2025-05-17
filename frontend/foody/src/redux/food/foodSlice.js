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
export const fetchFoodPending = createAction("fetchFoodPending");
export const fetchFoodSuccess = createAction("fetchFoodSuccess");
export const fetchFoodFailed = createAction("fetchFoodFailed");

export const createFoodPending = createAction("createFoodPending");
export const createFoodSuccess = createAction("createFoodSuccess");
export const createFoodFailed = createAction("createFoodFailed");

export const updateFoodPending = createAction("updateFoodPending");
export const updateFoodSuccess = createAction("updateFoodSuccess");
export const updateFoodFailed = createAction("updateFoodFailed");

export const deleteFoodPending = createAction("deleteFoodPending");
export const deleteFoodSuccess = createAction("deleteFoodSuccess");
export const deleteFoodFailed = createAction("deleteFoodFailed");

// Slice
const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodPending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchFoodSuccess, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchFoodFailed, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(createFoodPending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createFoodSuccess, (state, action) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
        state.data = [action.payload, ...state.data];
      })
      .addCase(createFoodFailed, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })
      .addCase(updateFoodPending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(updateFoodSuccess, (state, action) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = true;
        const updatedFood = action.payload;
        state.data = state.data.map((f) =>
          f.id === updatedFood.id ? updatedFood : f
        );
      })
      .addCase(updateFoodFailed, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = false;
      })
      .addCase(deleteFoodPending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteFoodSuccess, (state, action) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
        const deletedFood = action.payload;
        state.data = state.data.filter((f) => f.id !== deletedFood.id);
      })
      .addCase(deleteFoodFailed, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export default foodSlice.reducer;
