// timerSlice.js - Redux slice for the global trip countdown timer
// Handles setting and clearing the trip date

import { createSlice } from '@reduxjs/toolkit';

// Initial state for the timer (no date set)
const initialState = {
  targetDate: null, // ISO string
};

// Create the timer slice with reducers for set/clear actions
const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    // Set the trip target date
    setTargetDate: (state, action) => {
      state.targetDate = action.payload;
    },
    // Clear the trip target date
    clearTargetDate: (state) => {
      state.targetDate = null;
    },
  },
});

// Export actions for use in components
export const { setTargetDate, clearTargetDate } = timerSlice.actions;
// Export the reducer for the store
export default timerSlice.reducer; 