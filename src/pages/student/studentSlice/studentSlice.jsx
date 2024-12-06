// src/features/batches/batchesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../api/apiService';

// 1. Define the async thunk for fetching batches by UID
export const fetchBatchesByUid = createAsyncThunk(
  'batches/fetchByUid',
  async ({ uid, authToken }, { rejectWithValue }) => {
    try {
      console.log("Fetching batches for UID:", uid);
      const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/batches/user/${uid}`);
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

// Thunk to fetch complaints
export const fetchComplaints = createAsyncThunk(
  'complaints/fetchComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/complaint/view`);
      console.log(response.data);
      return response.data; // Assume the API returns an array of complaints
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// Thunk to post a new complaint
export const postComplaint = createAsyncThunk(
  'complaints/postComplaint',
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${import.meta.env.VITE_APP_HOST2}/complaint/create`, complaintData);

      return response.data; // Assume the API returns the created complaint
    } catch (error) {
      // Handle errors
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


// 2. Define the initial state
const initialState = {
  batches: [],
  loading: false,
  error: null,
  // Complaints
  complaints: [],
  fetchStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  fetchError: null,
  postStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  postError: null,
};

// 3. Create the slice with a consistent name
const batchesSlice = createSlice({
  name: 'student',
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
        state.complaints = Array.isArray(action.payload) ? action.payload : [action.payload]; // Add the new complaint to the list
        alert('Your complaint has been submitted successfully!');
      })
      .addCase(postComplaint.rejected, (state, action) => {
        state.postStatus = 'failed';
        state.postError = action.payload || action.error.message;
        alert(`Failed to submit complaint: ${state.postError}`);
        
      });
  },
});


export default batchesSlice.reducer;

// 4. Export synchronous actions if any
export const { clearBatches } = batchesSlice.actions;

// 5. Selectors
export const selectBatches = (state) => state.student.batches;
export const selectBatchesLoading = (state) => state.student.loading;
export const selectBatchesError = (state) => state.student.error;

