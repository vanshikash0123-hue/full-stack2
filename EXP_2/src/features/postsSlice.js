import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  { id: "1", title: "Welcome to Redux Toolkit", platformId: "1" },
  { id: "2", title: "Getting Started with React", platformId: "2" },
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, platformId) {
        return { payload: { id: nanoid(), title, platformId } };
      },
    },
    postRemoved(state, action) {
      return state.filter((post) => post.id !== action.payload);
    },
  },
});

export const { postAdded, postRemoved } = postsSlice.actions;
export default postsSlice.reducer;

// Selector
export const selectAllPosts = (state) => state.posts;