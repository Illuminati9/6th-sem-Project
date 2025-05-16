//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/middleware/classroomDetailSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClassroomDetails = createAsyncThunk(
  'classroomDetail/fetchClassroomDetails',
  async (classroomId, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token || localStorage.getItem('token');
      if (!token) return rejectWithValue('No token available');

      const response = await axios.get(`http://localhost:8000/api/classroom/get/${classroomId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      console.log("Classroom details fetched successfully:", response.data);
      return response.data.classroom;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAnnouncement = createAsyncThunk(
  'classroomDetail/createAnnouncement',
  async ({ content, classroomId }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token || localStorage.getItem('token');
      if (!token) return rejectWithValue('No token available');

      const response = await axios.post(
        'http://localhost:8000/api/comment/create',
        { content, classroomId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const classroomDetailSlice = createSlice({
  name: 'classroomDetail',
  initialState: {
    classroom: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearClassroomDetails: (state) => {
      state.classroom = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassroomDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassroomDetails.fulfilled, (state, action) => {
        state.classroom = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchClassroomDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClassroomDetails } = classroomDetailSlice.actions;
export default classroomDetailSlice.reducer;