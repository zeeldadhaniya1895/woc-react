import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  input:"",
  output:"",
  code:""
};

const apiResponseSlice = createSlice({
  name: "apiResponse",
  initialState,
  reducers: {
    setInput: (state, action) => {
      state.input = action.payload;
    },
    setOutput: (state, action) => {
      state.output = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setAll: (state, action) => {
      state.input = "";
      state.output = action.payload.output;
      state.code = action.payload.code;
    }
  },
});

export const { setInput, setOutput, setCode,setAll } = apiResponseSlice.actions;   
export default apiResponseSlice.reducer;