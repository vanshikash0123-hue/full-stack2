import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  posts: [
    { id: nanoid(), title: 'Product launch teaser', platform: 'Instagram', status: 'draft', date: null },
    { id: nanoid(), title: 'Behind the scenes reel', platform: 'TikTok', status: 'draft', date: null },
    { id: nanoid(), title: 'Customer testimonial', platform: 'LinkedIn', status: 'draft', date: null },
  ],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare({ title, platform, date }) {
        return {
          payload: {
            id: nanoid(),
            title,
            platform,
            status: date ? 'scheduled' : 'draft',
            date: date || null,
          },
        };
      },
    },
    updatePost(state, action) {
      const { id, changes } = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) Object.assign(post, changes);
    },
    schedulePost(state, action) {
      const { id, date } = action.payload;
      const post = state.posts.find((p) => p.id === id);
      if (post) {
        post.date = date;
        post.status = 'scheduled';
      }
    },
    unschedulePost(state, action) {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.date = null;
        post.status = 'draft';
      }
    },
    deletePost(state, action) {
      state.posts = state.posts.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPost, updatePost, schedulePost, unschedulePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;