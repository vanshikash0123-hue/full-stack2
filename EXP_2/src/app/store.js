import { configureStore } from "@reduxjs/toolkit";
import platformsReducer from "../features/platformsSlice";
import postsReducer from "../features/postsSlice";

export const store = configureStore({
  reducer: {
    platforms: platformsReducer,
    posts: postsReducer,
  },
});