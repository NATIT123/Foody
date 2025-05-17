import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  callAddFood,
  callDeleteFood,
  callFetchFoodsByRestaurant,
  callUpdateFood,
} from "../../services/api";

// Async thunks
export const fetchFoods = createAsyncThunk(
  "food/fetchFoods",
  async (restaurantId) => {
    const res = await callFetchFoodsByRestaurant(restaurantId);
    const data = res.data;
    return data;
  }
);

export const createFood = createAsyncThunk(
  "food/createFood",
  async (newFood, thunkAPI) => {
    const res = await callAddFood(newFood);
    const data = res.data;
    if (data && data.id) {
      thunkAPI.dispatch(fetchFoods());
    }
    return data;
  }
);

export const updateFood = createAsyncThunk(
  "food/updateFood",
  async (id, food, thunkAPI) => {
    const res = await callUpdateFood(id, food);
    const data = res.data;
    if (data && data.id) {
      thunkAPI.dispatch(fetchFoods());
    }
    return data;
  }
);

export const deleteFood = createAsyncThunk(
  "food/deleteFood",
  async (foodId, thunkAPI) => {
    await callDeleteFood(foodId);
    thunkAPI.dispatch(fetchFoods());
    return { id: foodId };
  }
);

// Initial state
const initialState = {
  foods: [],
  isPending: false,
  isError: false,
  isCreating: false,
  isCreateSuccess: false,
  isUpdating: false,
  isUpdatingSuccess: false,
  isDelete: false,
  isDeleteSuccess: false,
};

// Slice
const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    resetFoodState: (state) => {
      state.isCreateSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch foods
      .addCase(fetchFoods.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.isPending = false;
        state.foods = action.payload;
      })
      .addCase(fetchFoods.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      // Create food
      .addCase(createFood.pending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createFood.fulfilled, (state, action) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
      })
      .addCase(createFood.rejected, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })

      // Update food
      .addCase(updateFood.pending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(updateFood.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = true;
      })
      .addCase(updateFood.rejected, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = false;
      })

      // Delete food
      .addCase(deleteFood.pending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteFood.fulfilled, (state, action) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
      })
      .addCase(deleteFood.rejected, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export const { resetFoodState } = foodSlice.actions;

export default foodSlice.reducer;
