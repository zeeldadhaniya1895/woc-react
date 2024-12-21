import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditorTheme,
  setEditorLanguage,
  setEditorCode,
  toggleLineWrapping,
} from "../store/varSlice";

import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { LANGUAGE_DATA } from "../config/constants";

export default function CodeEditor({ fileSectionWidth, fileSectionVisible }) {
  const dispatch = useDispatch();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  // Access editor state from Redux
  const { theme, language, codeSnippet, isLineWrapping, icon, info, version } =
    useSelector((state) => state.var.editor);

  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
  };

  // Load codeSnippet from sessionStorage if available
  useEffect(() => {
    const savedCode = sessionStorage.getItem("codeSnippet");
    if (savedCode) {
      dispatch(setEditorCode(savedCode));
    }
  }, [dispatch]);

  // Update sessionStorage whenever the code changes
  useEffect(() => {
    if (editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: codeSnippet,
          extensions: [
            basicSetup,
            themes[theme] || oneDark,
            javascript(),
            isLineWrapping ? EditorView.lineWrapping : [],
            keymap.of(defaultKeymap),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newCode = update.state.doc.toString();
                sessionStorage.setItem("codeSnippet", newCode); // Save code to sessionStorage
                dispatch(setEditorCode(newCode)); // Update Redux state
              }
            }),
          ],
        }),
        parent: editorContainerRef.current,
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [theme, codeSnippet, isLineWrapping, dispatch]);

  const handleThemeChange = (e) => {
    dispatch(setEditorTheme(e.target.value));
  };

  const handleLanguageChange = (e) => {
    dispatch(setEditorLanguage(e.target.value));
  };

  const handleLineWrapping = () => {
    dispatch(toggleLineWrapping());
  };

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden relative ${
        fileSectionVisible ? "" : "flex-1"
      }`}
      style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
    >
      <div className="flex items-center p-2 bg-gray-700 text-gray-300">
        {/* Language Dropdown */}
        <select
          className="mr-2 px-3 py-1 bg-gray-800 text-white rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          {LANGUAGE_DATA.map((lang, index) => (
            <option key={index} value={lang.language}>
              {lang.language.toUpperCase()} (v{lang.version})
            </option>
          ))}
        </select>

        {/* Theme Dropdown */}
        <select
          className="mr-2 px-3 py-1 bg-gray-800 text-white rounded"
          value={theme}
          onChange={handleThemeChange}
        >
          {Object.keys(themes).map((themeKey, index) => (
            <option key={index} value={themeKey}>
              {themeKey}
            </option>
          ))}
        </select>

        {/* Line Wrapping Toggle */}
        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={handleLineWrapping}
        >
          {isLineWrapping ? "Disable Wrapping" : "Enable Wrapping"}
        </button>
      </div>

      {/* Language Info */}
      <div className="p-2 bg-gray-800 text-gray-200">
        <img
          src={icon}
          alt={`${language} Icon`}
          className="inline-block w-6 h-6 mr-2"
        />
        <span>
          {language.toUpperCase()}: {info}
        </span>
      </div>

      {/* Code Editor */}
      <div
        ref={editorContainerRef}
        className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
        style={{ height: "100%" }}
      ></div>
    </div>
  );
}
