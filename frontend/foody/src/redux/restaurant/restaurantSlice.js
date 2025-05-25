import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  callCreateRestaurant,
  callDeleteRestaurant,
  callFetchListRestaurant,
  callFetchOwnerRestaurants,
  callFetchRestaurantsByFields,
  callFetchRestaurantsOwnerByFields,
  callUpdateRestaurant,
} from "../../services/api";

// Async Thunks
export const fetchRestaurants = createAsyncThunk(
  "restaurant/fetchRestaurants",
  async (currentPage) => {
    const res = await callFetchListRestaurant(currentPage);
    return res;
  }
);

export const fetchOwnerRestaurants = createAsyncThunk(
  "restaurant/fetchOwnerRestaurants",
  async ({ userId, currentPage }) => {
    const res = await callFetchOwnerRestaurants(userId, currentPage);
    const data = res.data;
    return data;
  }
);

export const fetchRestaurantsByFields = createAsyncThunk(
  "restaurant/fetchRestaurantsByFields",
  async ({ currentPage, searchQuery }, thunkAPI) => {
    if (searchQuery === undefined) {
      thunkAPI.dispatch(fetchRestaurants(currentPage));
    } else {
      const res = await callFetchRestaurantsByFields(currentPage, searchQuery);
      return res.data.data;
    }
  }
);

export const fetchRestaurantsOwnerByFields = createAsyncThunk(
  "restaurant/fetchRestaurantsOwnerByFields",
  async ({ userId, currentPage, searchQuery }, thunkAPI) => {
    if (searchQuery === undefined) {
      thunkAPI.dispatch(fetchRestaurants(currentPage));
    } else {
      const res = await callFetchRestaurantsOwnerByFields(
        userId,
        currentPage,
        searchQuery
      );
      const data = res.data;
      return data;
    }
  }
);

export const createRestaurant = createAsyncThunk(
  "restaurant/createRestaurant",
  async (newRestaurant, thunkAPI) => {
    const res = await callCreateRestaurant(newRestaurant);
    const data = res.data;
    if (data && data.id) {
      thunkAPI.dispatch(fetchRestaurants());
    }
    return data;
  }
);

export const updateRestaurant = createAsyncThunk(
  "restaurant/updateRestaurant",
  async ({ restaurantId, restaurant }, thunkAPI) => {
    const res = callUpdateRestaurant(restaurantId, restaurant);
    const data = res.data;
    if (data && data.id) {
      thunkAPI.dispatch(fetchRestaurants());
    }
    return data;
  }
);

export const deleteRestaurant = createAsyncThunk(
  "restaurant/deleteRestaurant",
  async (restaurantId, thunkAPI) => {
    await callDeleteRestaurant(restaurantId);
    thunkAPI.dispatch(fetchRestaurants());
    return { id: restaurantId };
  }
);

// Initial State
const initialState = {
  restaurants: [],
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
const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    resetRestaurantState: (state) => {
      state.isCreateSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchRestaurants.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.isPending = false;
        state.restaurants = action.payload.data.data;
      })
      .addCase(fetchRestaurants.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      // Fetch
      .addCase(fetchOwnerRestaurants.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchOwnerRestaurants.fulfilled, (state, action) => {
        state.isPending = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchOwnerRestaurants.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      // Fetch
      .addCase(fetchRestaurantsByFields.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchRestaurantsByFields.fulfilled, (state, action) => {
        state.isPending = false;
        state.restaurants = action.payload;
      })
      .addCase(fetchRestaurantsByFields.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      // Create
      .addCase(createRestaurant.pending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createRestaurant.fulfilled, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
      })
      .addCase(createRestaurant.rejected, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })

      // Update
      .addCase(updateRestaurant.pending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(updateRestaurant.fulfilled, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = true;
      })
      .addCase(updateRestaurant.rejected, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = false;
      })

      // Delete
      .addCase(deleteRestaurant.pending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteRestaurant.fulfilled, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
      })
      .addCase(deleteRestaurant.rejected, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export const { resetRestaurantState } = restaurantSlice.actions;

export default restaurantSlice.reducer;
