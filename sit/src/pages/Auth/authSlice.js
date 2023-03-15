import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: {},
  userData: [],
  bookmark: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.userId = action.payload;
    },
    getData: (state, action) => {
      state.userData = action.payload;
    },
    logout: (state) => {
      state.userId = {};
      state.userData = {};
      localStorage.removeItem("itsSession");
    },
    bookmark: (state, action) => {
      state.bookmark = action.payload;
    },
  },
});

export const { login, getData, logout, bookmark } = userSlice.actions;

export default userSlice.reducer;
