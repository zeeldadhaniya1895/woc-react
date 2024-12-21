import { configureStore } from "@reduxjs/toolkit";
import varReducer from "./varSlice";

export const store = configureStore({
  reducer: {
    var: varReducer,
  }
});
