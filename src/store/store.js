import { configureStore } from "@reduxjs/toolkit";
import varReducer from "./varSlice";
import apiResponseReducer from "./apiResponseSlice";
import tabReducer from "./tabSlice";

export const store = configureStore({
  reducer: {
    var: varReducer,
    response: apiResponseReducer,
    tabs: tabReducer,
  }
});
