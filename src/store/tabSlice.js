import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tabs: [
    {
      id: "tab1",
      name: "Untitled 1",
      code: "// Start coding here...",
    },
  ],
  activeTab: {
    id: "tab1",
    name: "Untitled 1",
    code: "// Start coding here...",
  },
};

const tabSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    addTab: (state) => {
      const newTab = {
        id: `tab${state.tabs.length + 1}`,
        name: `Untitled ${state.tabs.length + 1}`,
        code: "// New file",
      };
      state.tabs.push(newTab);
      state.activeTab = newTab;
    },
    closeTab: (state, action) => {
      state.tabs = state.tabs.filter((tab) => tab.id !== action.payload.id);
      if (state.activeTab.id === action.payload.id) {
        state.activeTab = state.tabs[0] || null;
      }
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { addTab, closeTab, setActiveTab } = tabSlice.actions;
export default tabSlice.reducer;
