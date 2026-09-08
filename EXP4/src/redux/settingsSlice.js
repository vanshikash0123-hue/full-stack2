import { createSlice } from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { optimized: true },
  reducers: {
    toggleOptimized(state) {
      state.optimized = !state.optimized;
    },
  },
});

export const { toggleOptimized } = settingsSlice.actions;
export default settingsSlice.reducer;