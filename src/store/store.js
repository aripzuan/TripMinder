// store.js - Configures the Redux store for the app
// Combines the todo, timer, and auth slices

import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';
import timerReducer from './timerSlice';
import authReducer from './authSlice';

// Create the Redux store with all slices
const store = configureStore({
  reducer: {
    todo: todoReducer,
    timer: timerReducer,
    auth: authReducer,
  },
});

export default store; 