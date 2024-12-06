import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/apiService";

export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchDashboard',
    async (dashboardName = 'trainer stats', { rejectWithValue }) => {
      try {
        const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/dashboard/get-dashboard`);
        // {
        //     params: { name: dashboardName },
        //   }
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          // Server error response
          return rejectWithValue(error.response.data);
        }
        // Network or unexpected error
        return rejectWithValue({ error: 'Something went wrong' });
      }
    }
  );

  export const processTrainerStats = createAsyncThunk(
    'trainer/processTrainerStats',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/dashboard/trainer`);
        return response.data;
      } catch (error) {
        if (error.response && error.response.data) {
          // Server error response
          return rejectWithValue(error.response.data);
        }
        // Network or unexpected error
        return rejectWithValue({ error: 'Something went wrong' });
      }
    }
  );
  

export const dashboardExtraReducers =  (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        console.log(action.payload, "dashboard data")
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch dashboard';
      });
  }

export const processtrainerStatsExtraReducers =  (builder) => {
    builder
      .addCase(processTrainerStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(processTrainerStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action.payload)
        state.data = action.payload.dashboard[0];
      })
      .addCase(processTrainerStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch trainer stats';
      });
  }
