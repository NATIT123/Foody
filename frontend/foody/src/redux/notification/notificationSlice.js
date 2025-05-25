import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  callAddNotification,
  callFetchNotification,
  callMarkAllNotificationAsRead,
} from "../../services/api";

export const addNotification = createAsyncThunk(
  "notification/addNotification",
  async ({ message, userId }, { rejectWithValue }) => {
    try {
      const notification = {
        description: message,
        userId,
      };

      const res = await callAddNotification(notification);

      const data = res.data;
      if (res.status === "error" || res.status === "fail") {
        return rejectWithValue(data.message || "Failed to add notification");
      }
      return {
        _id: data.data,
        description: message,
        isRead: false,
        userId,
        createdAt: data.createdAt,
        active: false,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Error adding notification");
    }
  }
);

export const fetchNotifications = createAsyncThunk(
  "notification/fetchNotifications",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await callFetchNotification(userId);
      const data = res.data;

      if (res.status === "fail" || res.status === "error") {
        return rejectWithValue(res.message || "Failed to fetch notifications");
      }

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Fetch error");
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notification/markAllAsRead",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await callMarkAllNotificationAsRead(userId);
      const data = res.data;
      if (res.status === "fail" || res.status === "error") {
        return rejectWithValue(data.message || "Failed to mark all as read");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err.message || "Mark read error");
    }
  }
);

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadExists: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadExists = action.payload.some((n) => !n.isRead);

        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          isRead: true,
        }));
        state.unreadExists = false;
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        state.unreadExists = true;
      })
      .addCase(addNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = notificationSlice.actions;
export default notificationSlice.reducer;
