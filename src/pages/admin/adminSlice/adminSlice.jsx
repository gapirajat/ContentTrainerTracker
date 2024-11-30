// src/store/announcementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from "../../../api/apiService";
// Async thunk for fetching the current announcement
export const fetchAnnouncement = createAsyncThunk(
  "announcement/fetchAnnouncement",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/announcement/view`);
      console.log(response.data,"announcement/fetchAnnouncement" )
      return response.data; // Adjust based on your API's response structure
    } catch (error) {
      // Extract error message
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to fetch announcement.";
      return rejectWithValue(message);
    }
// return { message: 'a', link: { text: 'abc', url: 'www.google.com' } }
// return { message: 'a' }
  }
);

// Async thunk for setting an announcement
export const setAnnouncement = createAsyncThunk(
  "announcement/setAnnouncement",
  async (announcement, { rejectWithValue }) => {
    try {
      const response = await api.put(`${import.meta.env.VITE_APP_HOST2}/announcement/update`, {
        announcement,
      });
      return response.data; // Assuming response.data is the new announcement
    } catch (error) {
      // Extract error message
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to set announcement.";
      return rejectWithValue(message);
    }
  }
);

// Async thunk for removing an announcement
export const removeAnnouncement = createAsyncThunk(
  "announcement/removeAnnouncement",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put(`${import.meta.env.VITE_APP_HOST2}/announcement/update`, {
        announcement: ""});
      return response.data; // Adjust based on your API's response structure
    } catch (error) {
      // Extract error message
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Failed to remove announcement.";
      return rejectWithValue(message);
    }
  }
);

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    currentAnnouncement: null, // Initialize as null or an appropriate default
    loading: false,
    error: null,
    successMessage: "",
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Handle fetchAnnouncement
    builder
      .addCase(fetchAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        // console.log(action.payload[0].announcement);
        state.loading = false;
        state.currentAnnouncement = action.payload[0]; // Ensure payload matches currentAnnouncement structure
      })
      .addCase(fetchAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch announcement.";
      });

    // Handle setAnnouncement
    builder
      .addCase(setAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(setAnnouncement.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnnouncement = action.payload[0]; // Directly assign the payload
        state.successMessage = "Announcement set successfully!";
      })
      .addCase(setAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to set announcement.";
      });

    // Handle removeAnnouncement
    builder
      .addCase(removeAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(removeAnnouncement.fulfilled, (state) => {
        state.loading = false;
        state.currentAnnouncement = null;
        state.successMessage = "Announcement removed successfully!";
      })
      .addCase(removeAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove announcement.";
      });
  },
});

export const { clearMessages } = announcementSlice.actions;

export default announcementSlice.reducer;
