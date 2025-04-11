//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/middleware/classroomThunk.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClassrooms = createAsyncThunk(
  'classrooms/fetchClassrooms',
  async (_, { getState, rejectWithValue }) => {
    try {
      console.log('Fetching classrooms...');
      const state = getState();
      const token = state.user.token || localStorage.getItem('token');
      if (!token) return rejectWithValue('No token available');
      
      const response = await axios.get('http://localhost:8000/api/classroom/getAll', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      return response.data.classrooms;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const classroomsSlice = createSlice({
  name: 'classrooms',
  initialState: {
    classrooms: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.loading = false;
        state.classrooms = action.payload;
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const fetchClassroomByCode = createAsyncThunk(
  'classrooms/fetchClassroomByCode',
  async (classroomCode, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const token = state.user.token || localStorage.getItem('token');
      if (!token) return rejectWithValue('No token available');
      
      const response = await axios.get(`http://localhost:8000/api/classroom/get/${classroomCode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      return response.data.classroom;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export default classroomsSlice.reducer;