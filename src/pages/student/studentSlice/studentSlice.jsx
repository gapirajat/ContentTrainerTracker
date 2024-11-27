// src/features/batches/batchesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Define the async thunk for fetching batches by UID
export const fetchBatchesByUid = createAsyncThunk(
  'batches/fetchByUid',
  async ({ uid, authToken }, { rejectWithValue }) => {
    try {
      console.log("Fetching batches for UID:", uid);
      const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/batches/user/${uid}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Response from fetchBatchesByUid:", response);
      
      // Assuming the response data has the shape: { batches: [...] }
      return response.data.batches;
    } catch (error) {
      console.error("Error in fetchBatchesByUid:", error);
      
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
  batches: [],
  loading: false,
  error: null,
};

// 3. Create the slice with a consistent name
const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    // Add synchronous reducers here if needed
    // For example, to clear batches or reset state
    clearBatches: (state) => {
      state.batches = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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
  },
});

export default batchesSlice.reducer;

// 4. Export synchronous actions if any
export const { clearBatches } = batchesSlice.actions;

// 5. Selectors
export const selectBatches = (state) => state.batches.batches;
export const selectBatchesLoading = (state) => state.batches.loading;
export const selectBatchesError = (state) => state.batches.error;
