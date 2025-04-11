import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import classroomsReducer from './classroomThunk';
import classroomDetailReducer from './classroomDetailSlice';
import announcementReducer from './announcementSlice';
import assignmentReducer from './assignmentSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  user: userReducer,
  classrooms: classroomsReducer,
  classroomDetail: classroomDetailReducer,
  announcement: announcementReducer,
  assignment: assignmentReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export default store;
