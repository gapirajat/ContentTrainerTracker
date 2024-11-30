// src/features/general/generalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/apiService';

// 1. Define the async thunk for fetching the announcement
export const fetchAnnouncement = createAsyncThunk(
  'general/fetchAnnouncement',
  async (rejectWithValue) => {
    console.log("Fetching announcement");
    try {
      console.log("Fetching announcement");
      const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/announcement/view`);
      console.log("Response from fetchAnnouncement:", response);
      
      // Assuming the API returns { message: '', link: { text: '', url: '' } }
      return response.data;
      // return { message: '', link: { text: 'abc', url: 'www.google.com' } }
    } catch (error) {
      console.error("Error in fetchAnnouncement:", error);
      
      // Check if the error response has data
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      
      // Fallback to error message
      return rejectWithValue(error.message);
    }
  }
);

// 2. Define the initial state
const initialState = {
  message: '',
  link: null, // { text: '', url: '' }
  isVisible: false,
  loading: false,
  error: null,
};

// Helper function to determine visibility based on message
const shouldBeVisible = (message) => {
  return message != null && message.trim() !== '';
};

// 3. Create the slice with a consistent name
const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    // Synchronous reducers for announcement
    showAnnouncement: (state) => {
      state.isVisible = true;
    },
    hideAnnouncement: (state) => {
      state.isVisible = false;
    },
    setAnnouncement: (state, action) => {
      const { announcement, link } = action.payload ?? null;;
      // console.log("payload");
      state.message = announcement;
      state.link = link || null;
      state.isVisible = shouldBeVisible(announcement);
    },
    // You can add more general reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncement.fulfilled, (state, action) => {
        // console.log(action.payload[0].announcement);
        state.loading = false;
        state.message = action.payload?.announcement ?? null;
        state.link = action.payload.link || null;//not implemtned
        state.isVisible = shouldBeVisible(action.payload?.announcement ?? null);
      })
      .addCase(fetchAnnouncement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch announcement';
        state.isVisible = false; // Optionally hide announcement on error
      });
  },
});

export default generalSlice.reducer;

// 4. Export synchronous actions if any
export const { showAnnouncement, hideAnnouncement, setAnnouncement } = generalSlice.actions;

// 5. Selectors
export const selectAnnouncementMessage = (state) => state.general.message;
export const selectAnnouncementLink = (state) => state.general.link;
export const selectAnnouncementVisibility = (state) => state.general.isVisible;
export const selectAnnouncementLoading = (state) => state.general.loading;
export const selectAnnouncementError = (state) => state.general.error;
