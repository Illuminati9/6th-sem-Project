//// filepath: /Users/sridhar/Sridhar/Personal/Acads/6th-sen-frontend-new/src/middleware/reducer.js
import { combineReducers, createSlice } from '@reduxjs/toolkit';
import { fetchClassrooms } from './classroomThunk';
import classroomDetailReducer from './classroomDetailSlice';
import announcementReducer from './announcementSlice';
import assignmentReducer from './assignmentSlice';

const initialAppState = {
  auth: {
    isAuthenticated: false,
    user: null,
  },
  user:{
    user: null,
    loading: false,
    error: null,
  },
  classrooms: {
    joinedClassrooms: [],
    loading: false,
    error: null,
  },
  classroomDetail: {
    loading: false,
    error: null,
    classroom: null,
  },
  assignment: {
    assignment: null,
    loading: false,
    error: null,
  },
};

const appSlice = createSlice({
  name: 'app',
  initialState: initialAppState,
  reducers: {
    loginSuccess: (state, action) => {
      state.auth.isAuthenticated = true;
      state.auth.user = action.payload;
    },
    logout: (state) => {
      state.auth.isAuthenticated = false;
      state.auth.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassrooms.pending, (state) => {
        state.classrooms.loading = true;
        state.classrooms.error = null;
      })
      .addCase(fetchClassrooms.fulfilled, (state, action) => {
        state.classrooms.joinedClassrooms = action.payload;
        state.classrooms.loading = false;
      })
      .addCase(fetchClassrooms.rejected, (state, action) => {
        state.classrooms.loading = false;
        state.classrooms.error = action.payload;
      });
  },
});

export const { loginSuccess, logout } = appSlice.actions;

const rootReducer = combineReducers({
  app: appSlice.reducer,
  classroomDetail: classroomDetailReducer,
  announcement: announcementReducer,
  assignment: assignmentReducer,
});

export default rootReducer;