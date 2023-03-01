import { configureStore } from "@reduxjs/toolkit";
import userReducer from "~/pages/Auth/authSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
