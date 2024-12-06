// src/store/announcementSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchComplaints, postComplaint } from "./adminSliceIssue";
import { fetchBatchesByUid } from "./adminSliceBatches";
import { coordinatorsExtraReducers } from "./adminSliceCoordinators";

import api from "../../../api/apiService";
import { dashboardExtraReducers, processtrainerStatsExtraReducers } from "./adminSliceDashboard";


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
    // loading: false,
    // error: null,
    successMessage: "",
    //batches
    batches: [],
    loading: false,
    error: null,
    //complaints
    complaints: [],
    fetchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    fetchError: null,
    postStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    postError: null,
    //coordinators
    coordinators: [],
    //dashboard,
    data: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = "";
    },
    clearBatches: (state) => {
        state.batches = [];
        state.loading = false;
        state.error = null;
      },
  },
  extraReducers: (builder) => {
    // Handle fetchBatchesByUid for feedback
    builder
    .addCase(fetchBatchesByUid.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchBatchesByUid.fulfilled, (state, action) => {
      state.loading = false;
      state.batches = action.payload; // action.payload is the batches array
    })
    .addCase(fetchBatchesByUid.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch batches';
    });

    // Handle fetchAnnouncement
    builder
      .addCase(fetchAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        // console.log(action.payload[0].announcement);
        state.loading = false;
        state.currentAnnouncement = action.payload ?? null; // Ensure payload matches currentAnnouncement structure
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
        state.currentAnnouncement = action.payload ?? null; // Directly assign the payload
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

      // Handle fetchComplaints
      builder
      .addCase(fetchComplaints.pending, (state) => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.complaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.payload || action.error.message;
      });

    // Handle postComplaint
    builder
      .addCase(postComplaint.pending, (state) => {
        state.postStatus = 'loading';
        state.postError = null;
      })
      .addCase(postComplaint.fulfilled, (state, action) => {
        state.postStatus = 'succeeded';
        state.complaints = Array.isArray(action.payload) ? action.payload : [action.payload];
      })
      .addCase(postComplaint.rejected, (state, action) => {
        state.postStatus = 'failed';
        state.postError = action.payload || action.error.message;
        alert(`Failed to submit complaint: ${state.postError}`);
        
      });

      coordinatorsExtraReducers(builder)
      dashboardExtraReducers(builder)
      processtrainerStatsExtraReducers(builder)
  },
});

export const { clearMessages } = announcementSlice.actions;

export default announcementSlice.reducer;

export const selectBatches = (state) => state.admin.batches;
export const selectBatchesLoading = (state) => state.admin.loading;
export const selectBatchesError = (state) => state.admin.error;