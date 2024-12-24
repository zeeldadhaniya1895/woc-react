// Import necessary dependencies from React and Redux
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setEditorCode, setThemecolor } from "../store/varSlice";
// Import CodeMirror related dependencies
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { themess } from "../config/theme";

// CodeEditor component that takes fileSectionWidth and fileSectionVisible as props
export default function CodeEditor({
  fileSectionWidth,
  fileSectionVisible,
  fileName,
  language,
  content,
  onContentChange,
}) {
  // Initialize Redux dispatch
  const dispatch = useDispatch();
  // Create refs for editor container and editor instance
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  // Get editor state from Redux store
  const { theme, themec, language: reduxLanguage, codeSnippet, isLineWrapping, icon, info } =
    useSelector((state) => state.var.editor);

  // Load saved code from session storage on component mount
  useEffect(() => {
    const savedCode = sessionStorage.getItem("codeSnippet");
    if (savedCode) {
      dispatch(setEditorCode(savedCode));
    }
  }, [dispatch]);

  // Define available themes for the editor
  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
  };

  // Initialize and configure CodeMirror editor
  useEffect(() => {
    const themecc = themess.filter((themes) => themes.name == theme)[0].color;
    dispatch(setThemecolor(themecc));

    if (editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: content || codeSnippet, // Use content prop if provided, otherwise fallback to codeSnippet
          extensions: [
            basicSetup,
            javascript(),
            themes[theme] || oneDark,
            isLineWrapping ? EditorView.lineWrapping : [],
            keymap.of(defaultKeymap),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newCode = update.state.doc.toString();
                onContentChange(newCode); // Call onContentChange on content update
                dispatch(setEditorCode(newCode)); // Dispatch to Redux
              }
            }),
          ],
        }),
        parent: editorContainerRef.current,
      });
    }

    // Cleanup function to destroy editor instance when component unmounts
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [theme, themec, isLineWrapping, dispatch, content, codeSnippet, onContentChange, language]);

  // Render the editor component
  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden relative ${fileSectionVisible ? "" : "flex-1"}`}
      style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
    >
      {/* Header section showing language icon and info */}
      <div className="p-2 text-gray-200" style={{ backgroundColor: themec }}>
        <strong> {fileName} </strong> 
        <img src={icon} alt={`${language} Icon`} className="inline-block w-6 h-6 mr-2" />
        <span style={{ color: "GrayText" }}>
          {language.toUpperCase()}: {info}
        </span>
      </div>

      {/* CodeMirror editor container */}
      <div
        ref={editorContainerRef}
        className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
        style={{ height: "100%", backgroundColor: themec }}
      ></div>
    </div>
  );
}
