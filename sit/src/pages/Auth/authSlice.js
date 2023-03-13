import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  bookmark: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = {};
    },
    bookmark: (state, action) => {
      state.bookmark = action.payload;
    },
  },
});

export const { login, logout, bookmark } = userSlice.actions;

export default userSlice.reducer;
