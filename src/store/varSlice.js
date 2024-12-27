import { createSlice } from "@reduxjs/toolkit";
import { LANGUAGE_DATA } from "../config/constants"; // Assuming LANGUAGE_DATA is globally accessible

const initialState = {
  editor: {
    theme: 'oneDark',
    themec: '#282C34',
    language: 'c',
    version: '10.2.0',
    codeSnippet: `#include <stdio.h>\n\nint main() {\n\tprintf("Welcome to boardcode The code editor!");\n\treturn 0;\n}\n`,
    info: 'C does not have built-in Tree Set or Tree Map data structures, but you can use structures to build it.',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg',
    isLineWrapping: false,
    activeTab: null,
    activeCode: '',
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
    // setActiveTab: (state, action) => {
    //   state.editor.activeTab = action.payload;
    //   if (action.payload?.language) {
    //     state.editor.language = action.payload.language;
    //     console.log("action.payload.language",action.payload.language);
    //     console.log("LANGUAGE_DATA",LANGUAGE_DATA);
    //     const langData = LANGUAGE_DATA.find(
    //       (lang) => lang.name === action.payload.language
    //     );
    //     console.log("langData",langData.info);
    //     if (langData) {
    //       state.editor.info = langData.info;
    //       state.editor.icon = langData.icon;
    //       state.editor.version = langData.version;
    //     }
    //   }
    // },
    setActiveTab: (state, action) => {
      state.editor.activeTab = action.payload;
      if (action.payload?.language) {
        state.editor.language = action.payload.language;
        // console.log("action.payload.language", action.payload.language);
        // console.log("LANGUAGE_DATA", LANGUAGE_DATA);
        
        const langIndex = LANGUAGE_DATA.findIndex(
          (lang) => lang.language.toLowerCase() === action.payload.language.toLowerCase()
        );
       
        
        // console.log("langIndex", langIndex);
        
        if (langIndex !== -1) {
          state.editor.info = LANGUAGE_DATA[langIndex].info;
          state.editor.icon = LANGUAGE_DATA[langIndex].icon;
          state.editor.version = LANGUAGE_DATA[langIndex].version;
          // console.log("Updated state with language data:", LANGUAGE_DATA[langIndex]);
        } else {
          console.warn("Language not found in LANGUAGE_DATA");
          // Set defaults if language not found
          state.editor.info = "Language information not available";
          state.editor.icon = "";
          state.editor.version = "latest";
        }
      }
    },
    setActiveCode: (state, action) => {
      state.editor.activeCode = action.payload;
      state.editor.codeSnippet = action.payload;
    }
  },
});

export const { setEditorTheme, setEditorCode, setEditorLanguage, toggleLineWrapping,setThemecolor, setActiveTab,
  setActiveCode } = varSlice.actions;
export default varSlice.reducer;
