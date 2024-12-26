import { createSlice } from "@reduxjs/toolkit";
import { LANGUAGE_DATA } from "../config/constants"; // Assuming LANGUAGE_DATA is globally accessible

const initialState = {
  editor: {
    theme: 'oneDark',
    themec: '#282C34',
    
      language: 'javascript',
      version: '18.15.0',
      codeSnippet: `function welcome() {\n\tconsole.log("Welcome to boardcode The code editor!");\n}\n\nwelcome();\n`,
      info: 'JavaScript does not have built-in Queue and Priority Queue data structures so you may use datastructures-js/queue and datastructures-js/priority-queue instead.',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
      isLineWrapping: false,
  }
};

const varSlice = createSlice({
  name: "var",
  initialState,
  reducers: {
    setEditorTheme: (state, action) => {
      state.editor.theme = action.payload;
    },
    setEditorCode: (state, action) => {
      state.editor.codeSnippet = action.payload;
    },
    setEditorLanguage: (state, action) => {
      const selectedLanguage = LANGUAGE_DATA.find(
        (language) => language.language === action.payload
      );
      if (selectedLanguage) {
        state.editor = {
          ...state.editor,
          language: selectedLanguage.language,
          version: selectedLanguage.version,
          codeSnippet: selectedLanguage.codeSnippet,
          info: selectedLanguage.info,
          icon: selectedLanguage.icon,
        };
      }
    },
    setThemecolor: (state, action) => {
      state.editor.themec = action.payload;
    },
    toggleLineWrapping: (state) => {
      state.editor.isLineWrapping = !state.editor.isLineWrapping;
    },
  },
});

export const { setEditorTheme, setEditorCode, setEditorLanguage, toggleLineWrapping,setThemecolor } = varSlice.actions;
export default varSlice.reducer;
