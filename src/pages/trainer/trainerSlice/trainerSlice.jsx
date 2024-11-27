// src/features/batches/batchesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Define the async thunk for fetching batches by UID
export const fetchBatchesByUid = createAsyncThunk(
  'batches/fetchByUid',
  async (props, { rejectWithValue }) => {
    try {
      console.log("fetching batches of trainer...");
      console.log(props.authToken);
      const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/batches/uid/${props.uid}`, {
        headers: { Authorization: `Bearer ${props.authToken}` },
      });
      console.log(response);
      return response.data; // Assuming the response data is the batches array
    } catch (error) {
      console.log("fetchBatchesByUid");
      console.log(error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
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
  name: 'batches', // Changed from 'trainer' to 'batches'
  initialState,
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchesByUid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchesByUid.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload;
      })
      .addCase(fetchBatchesByUid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch batches';
      });
  },
});

export default batchesSlice.reducer;

// Selectors remain the same
export const selectBatches = (state) => state.batches?.batches;
export const selectBatchesLoading = (state) => state.batches?.loading;
export const selectBatchesError = (state) => state.batches?.error;
