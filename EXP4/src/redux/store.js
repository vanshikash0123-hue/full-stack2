import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    settings: settingsReducer,
  },
});