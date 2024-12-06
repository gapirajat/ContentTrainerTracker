import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/apiService";
// Define the async thunk for fetching coordinators
export const fetchAllCoordinators = createAsyncThunk(
    'coordinators/fetchAll',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/users/coordinator/all');
        // Assuming the API returns data in response.data
        // console.log('coordinators/fetchAll')
        return response.data;
      } catch (error) {
        // Handle errors appropriately
        // You can customize error handling based on your API's error structure
        if (error.response && error.response.data) {
          return rejectWithValue(error.response.data);
        }
        return rejectWithValue(error.message);
      }
    }
  );

  // Define and export a function that takes the builder and adds cases
export const coordinatorsExtraReducers = (builder) => {
    builder
      .addCase(fetchAllCoordinators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCoordinators.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload,'action.payload')
        state.coordinators = action.payload; // Adjust based on your API's response structure
      })
      .addCase(fetchAllCoordinators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch coordinators';
      });
  };