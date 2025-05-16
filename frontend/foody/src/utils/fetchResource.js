import { createAsyncThunk } from "@reduxjs/toolkit";
export const fetchResource = createAsyncThunk(
  "resources/fetchResource",
  async ({ url, type }, thunkAPI) => {
    try {
      const res = await fetch(url);
      const json = await res.json();

      if (json.status === "fail" || json.status === "error") {
        throw new Error(json.message || "Unknown error");
      }

      const result = json.data?.data || json.data;
      return { type, data: result };
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error.message, type });
    }
  }
);
