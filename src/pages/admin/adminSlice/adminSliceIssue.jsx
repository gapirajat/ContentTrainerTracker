import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/apiService";

// Thunk to fetch complaints
export const fetchComplaints = createAsyncThunk(
    'complaints/fetchComplaints',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get(`${import.meta.env.VITE_APP_HOST2}/complaint/admin/view`);
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
        const response = await api.post(`${import.meta.env.VITE_APP_HOST2}/complaint/admin/create`, complaintData);
  
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

  export const updateStatus = createAsyncThunk(
    'complaints/postComplaint',
    async (complaint, { rejectWithValue }) => {
      try {
        const response = await api.put(`${import.meta.env.VITE_APP_HOST2}/complaint/resolve/${complaint.complaintId}`,
            {
                isResolved: true
            }
        );
  
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