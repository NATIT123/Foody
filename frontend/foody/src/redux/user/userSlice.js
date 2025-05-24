import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  callCreateUser,
  callDeleteUser,
  callFetchListUser,
  callFetchUserByFields,
  callUpdateUser,
} from "../../services/api";

// Thunks
export const fetchListUsers = createAsyncThunk(
  "users/fetchList",
  async (currentPage) => {
    const response = await callFetchListUser(currentPage);
    return response;
  }
);

export const createNewUser = createAsyncThunk(
  "users/createNewUser",
  async (newUser, thunkAPI) => {
    const response = await callCreateUser(newUser);
    const data = response.data;
    if (data && data.id) {
      thunkAPI.dispatch(fetchListUsers());
    }
    return data;
  }
);

export const fetchUserByFields = createAsyncThunk(
  "users/fetchUserByFields",
  async ({ currentPage, searchQuery }, thunkAPI) => {
    console.log("searchQuery", searchQuery);
    if (searchQuery === undefined) {
      thunkAPI.dispatch(fetchListUsers(currentPage));
    } else {
      const response = await callFetchUserByFields(currentPage, searchQuery);
      return response;
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (args, thunkAPI) => {
    const response = await callUpdateUser(args.userId, args.user);
    const data = response.data;
    if (response.status === "success") {
      thunkAPI.dispatch(fetchListUsers(args.currentPage));
    }
    return data.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId, thunkAPI) => {
    await callDeleteUser(userId);
    thunkAPI.dispatch(fetchListUsers());
    return { id: userId };
  }
);

// Initial state
const initialState = {
  listUsers: [],
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
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.isCreateSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchListUsers.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchListUsers.fulfilled, (state, action) => {
        state.isPending = false;
        state.listUsers = action.payload.data.data;
      })
      .addCase(fetchListUsers.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      .addCase(fetchUserByFields.pending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchUserByFields.fulfilled, (state, action) => {
        state.isPending = false;
        state.listUsers = action.payload.data.data;
      })
      .addCase(fetchUserByFields.rejected, (state) => {
        state.isPending = false;
        state.isError = true;
      })

      // Create user
      .addCase(createNewUser.pending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createNewUser.fulfilled, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
      })
      .addCase(createNewUser.rejected, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = true;
      })
      .addCase(updateUser.rejected, (state) => {
        state.isUpdating = false;
        state.isUpdatingSuccess = false;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
      })
      .addCase(deleteUser.rejected, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;
