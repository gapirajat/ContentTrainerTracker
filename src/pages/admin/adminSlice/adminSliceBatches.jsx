import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/apiService";

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
  