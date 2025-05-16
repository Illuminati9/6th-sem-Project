//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/middleware/announcementSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAnnouncements = createAsyncThunk(
  'announcement/fetchAnnouncements',
  async (classroomId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/comment/get",
        { classroomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch announcements"
      );
    }
  }
);

const announcementSlice = createSlice({
  name: 'announcement',
  initialState: {
    comments: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAnnouncements: (state) => {
      state.comments = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnnouncements } = announcementSlice.actions;
export default announcementSlice.reducer;