import React, { useEffect, useRef, useState } from "react";
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
import { LANGUAGE_DATA } from "../config/constants";
import { executeCode } from "../API/api";
import {javascript} from "@codemirror/lang-javascript";

export default function CodeEditor({ fileSectionWidth, fileSectionVisible }) {
  const dispatch = useDispatch();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  const [output, setOutput] = useState(""); // State to store code execution output
  const [loading, setLoading] = useState(false); // Loading state
  const [input, setInput] = useState(""); // State for user input

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

  useEffect(() => {
    const savedCode = sessionStorage.getItem("codeSnippet");
    if (savedCode) {
      dispatch(setEditorCode(savedCode));
    }
  }, [dispatch]);

  useEffect(() => {
    if (editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: codeSnippet,
          extensions: [
            basicSetup,
            javascript(),
            themes[theme] || oneDark,
            isLineWrapping ? EditorView.lineWrapping : [],
            keymap.of(defaultKeymap),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newCode = update.state.doc.toString();
                sessionStorage.setItem("codeSnippet", newCode);
                dispatch(setEditorCode(newCode));
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

  const runCode = async () => {
    setLoading(true);
    try {
      const result = await executeCode(language, version, codeSnippet, input);
      console.log(result);
      if (result.code === 0) {
        setOutput(result.output);
      } else {
        setOutput(`Error:\n${result.output}`);
      }
    } catch (error) {
      setOutput(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden relative ${
        fileSectionVisible ? "" : "flex-1"
      }`}
      style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
    >
      <div className="flex items-center p-2 bg-gray-700 text-gray-300">
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

        <button
          className="px-3 py-1 bg-gray-500 text-white rounded"
          onClick={handleLineWrapping}
        >
          {isLineWrapping ? "Disable Wrapping" : "Enable Wrapping"}
        </button>

        <button
          className="ml-auto px-3 py-1 bg-green-500 text-white rounded"
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>

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

      <div className="p-2 bg-gray-800">
        <textarea
          className="w-full h-16 p-2 text-gray-800"
          placeholder="Enter input for your code here (if any)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
      </div>

      <div
        ref={editorContainerRef}
        className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
        style={{ height: "100%" }}
      ></div>

      <div className="p-2 bg-gray-900 text-green-400 overflow-auto h-32">
        <strong>Output:</strong>
        <pre>{output}</pre>
      </div>
    </div>
  );
}
