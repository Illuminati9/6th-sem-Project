//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/middleware/assignmentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchAssignmentsForClassroom = createAsyncThunk(
  'assignments/fetchAssignmentsForClassroom',
  async (classroomCode, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("No token available");

      const response = await axios.get(`http://localhost:8000/api/assignment/getAll/${classroomCode}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      console.log("Assignments fetched successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAssignmentDetailById = createAsyncThunk(
  'assignments/fetchAssignmentDetailById',
  async (assignmentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("No token available");

      const response = await axios.get(`http://localhost:8000/api/assignment/get/${assignmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      console.log("Assignment detail fetched successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async ({ classroomCode, assignmentData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return rejectWithValue("No token available");

      const response = await axios.post(`http://localhost:8000/api/assignment/create/${classroomCode}`, assignmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status !== 200) {
        return rejectWithValue(response.data.message);
      }
      console.log("Assignment created successfully:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const assignmentSlice = createSlice({
  name: 'assignments',
  initialState: {
    assignments: [],
    assignment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAssignments: (state) => {
      state.assignments = [];
      state.assignment = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Extra reducers for fetching assignments for a classroom
    builder
      .addCase(fetchAssignmentsForClassroom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentsForClassroom.fulfilled, (state, action) => {
        state.assignments = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssignmentsForClassroom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Extra reducers for fetching a single assignment detail by id
      .addCase(fetchAssignmentDetailById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignmentDetailById.fulfilled, (state, action) => {
        state.assignment = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssignmentDetailById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAssignments } = assignmentSlice.actions;
export default assignmentSlice.reducer;