import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  { id: "1", name: "Twitter" },
  { id: "2", name: "Instagram" },
  { id: "3", name: "LinkedIn" },
];

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    platformAdded: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(name) {
        return { payload: { id: nanoid(), name } };
      },
    },
    platformRemoved(state, action) {
      return state.filter((platform) => platform.id !== action.payload);
    },
  },
});

export const { platformAdded, platformRemoved } = platformsSlice.actions;
export default platformsSlice.reducer;

// Selector
export const selectAllPlatforms = (state) => state.platforms;