import { configureStore } from "@reduxjs/toolkit";
import varReducer from "./varSlice";
import apiResponseReducer from "./apiResponseSlice";

export const store = configureStore({
  reducer: {
    var: varReducer,
    response: apiResponseReducer,
  }
});
