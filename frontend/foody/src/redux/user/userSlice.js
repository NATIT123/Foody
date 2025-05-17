import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
  isPending: false,
  isError: false,
  data: [],
  errors: [],
  isCreating: false,
  isCreateSuccess: false,
  isUpdating: false,
  isUpdatingSucess: false,
  isDelete: false,
  isDeleteSuccess: false,
};

// Actions
export const fetchUserPending = createAction("fetchUserPending");
export const fetchUserSuccess = createAction("fetchUserSuccess");
export const fetchUserFailed = createAction("fetchUserFailed");

export const createUserPending = createAction("createUserPending");
export const createUserSucess = createAction("createUserSuccess");
export const createUserFailed = createAction("createUserFailed");

export const updateUserPending = createAction("updateUserPending");
export const updateUserSuccess = createAction("updateUserSuccess");
export const updateUserFailed = createAction("updateUserFailed");

export const deleteUserPending = createAction("deleteUserPending");
export const deleteUserSuccess = createAction("deleteUserSuccess");
export const deleteUserFailed = createAction("deleteUserFailed");

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserPending, (state) => {
        state.isPending = true;
        state.isError = false;
      })
      .addCase(fetchUserSuccess, (state, action) => {
        state.isPending = false;
        state.isError = false;
        state.data = action.payload;
      })
      .addCase(fetchUserFailed, (state) => {
        state.isPending = false;
        state.isError = true;
      })
      .addCase(createUserPending, (state) => {
        state.isCreating = true;
        state.isCreateSuccess = false;
      })
      .addCase(createUserSucess, (state, action) => {
        state.isCreating = false;
        state.isCreateSuccess = true;
        state.data = [action.payload, ...state.data];
      })
      .addCase(createUserFailed, (state) => {
        state.isCreating = false;
        state.isCreateSuccess = false;
      })
      .addCase(updateUserPending, (state) => {
        state.isUpdating = true;
        state.isUpdatingSucess = false;
      })
      .addCase(updateUserSuccess, (state, action) => {
        state.isUpdating = false;
        state.isUpdatingSucess = true;
        const updatedUser = action.payload;
        state.data = state.data.map((u) =>
          u.id === updatedUser.id ? updatedUser : u
        );
      })
      .addCase(updateUserFailed, (state) => {
        state.isUpdating = false;
        state.isUpdatingSucess = false;
      })
      .addCase(deleteUserPending, (state) => {
        state.isDelete = true;
        state.isDeleteSuccess = false;
      })
      .addCase(deleteUserSuccess, (state, action) => {
        state.isDelete = false;
        state.isDeleteSuccess = true;
        const deletedUser = action.payload;
        state.data = state.data.filter((u) => u.id !== deletedUser.id);
      })
      .addCase(deleteUserFailed, (state) => {
        state.isDelete = false;
        state.isDeleteSuccess = false;
      });
  },
});

export default userSlice.reducer;
