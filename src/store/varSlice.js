import { createSlice } from "@reduxjs/toolkit";
import { LANGUAGE_DATA } from "../config/constants"; // Assuming LANGUAGE_DATA is globally accessible

const initialState = {
  editor: {
    theme: 'oneDark',
    language: 'c',
    version: '10.2.0',
    codeSnippet: `#include <stdio.h>\n\nint main() {\n\tprintf("Welcome to boardcode The code editor!");\n\treturn 0;\n}\n`,
    info: 'C does not have built-in Tree Set or Tree Map data structures, but you can use structures to build it.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
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
    toggleLineWrapping: (state) => {
      state.editor.isLineWrapping = !state.editor.isLineWrapping;
    },
  },
});

export const { setEditorTheme, setEditorCode, setEditorLanguage, toggleLineWrapping } = varSlice.actions;
export default varSlice.reducer;
