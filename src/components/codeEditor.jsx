// Import necessary dependencies from React and Redux
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditorCode,
  setThemecolor,
  setActiveTab, setActiveCode
} from "../store/varSlice";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { themess } from "../config/theme";
import { indentOnInput, bracketMatching } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter, linter } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
// import { oneDark } from '@codemirror/theme-one-dark';
// import { githubLight } from '@codemirror/theme-github';  // Changed import
import authService from "../appwrite/auth.service";
import { updateTabCode } from "../appwrite/database.service";
import { LANGUAGE_DATA } from "../config/constants";
// Formate code
import prettier from "prettier/standalone";
import prettierPluginJava from "prettier-plugin-java";

// Helper function to download a file
function downloadFile(content, fileName) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

function formatCode(editor) {
  const code = editor.state.doc.toString(); // Get the current code

  try {
    const formattedCode = prettier.format(code, {
      parser: "java", // Use the Java parser for all code
      plugins: [prettierPluginJava],
      tabWidth: 6, // Set tab width
      useTabs: false, // Use spaces instead of tabs
    });

    editor.dispatch({
      changes: { from: 0, to: code.length, insert: formattedCode },
    });
  } catch (error) {
    console.error("Formatting error:", error);
  }
}

function myLinter(view) {
  const diagnostics = [];
  const doc = view.state.doc.toString();

  if (doc.includes("error")) {
    diagnostics.push({
      from: doc.indexOf("error"),
      to: doc.indexOf("error") + 5,
      severity: "error",
      message: "This is an example error.",
    });
  }

  return diagnostics;
}

export default function CodeEditor({
  fileSectionWidth,
  fileSectionVisible,
  activeTab,
  activeCode,
}) {
  const dispatch = useDispatch();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const { theme, themec, language, codeSnippet, isLineWrapping, icon, info} =
    useSelector((state) => state.var.editor);

  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
  };

  const fileExtensions = {  javascript: "js",  python: "py",  cpp: "cpp",  java: "java",  c:"c",  csharp: "cs",  go: "go",  html: "html",  css: "css",  php: "php",  ruby: "rb",rust: "rs",kotlin: "kt",swift: "swift",typescript: "ts",  lua: "lua",  sql: "sql",  r: "r",  perl: "pl",  haskell: "hs",  dart: "dart",  scala: "scala",  elixir: "ex",  clojure: "clj",};

  // Handle code updates when tab changes
  useEffect(() => {
    // console.log("CodeEditor received activeTab:", activeTab); // Debug log
  // console.log("CodeEditor received activeCode:", activeCode); // Debug log
  
    if (activeTab && activeCode && editorRef.current) {
      const transaction = editorRef.current.state.update({
        changes: {
          from: 0,
          to: editorRef.current.state.doc.length,
          insert: activeCode
        }
      });
      editorRef.current.dispatch(transaction);
    }
  }, [activeTab, activeCode]);

    // Auto-save function
    const saveCode = async (code) => {
      try {
        const user = await authService.getCurrentUser();
        if (user && activeTab) {
          await updateTabCode(user.email, activeTab.id, code);
          dispatch(setActiveCode(code));
          dispatch(setActiveTab(activeTab));
        }
      } catch (error) {
        console.error('Error saving code:', error);
      }
    };

  useEffect(() => {
    const themecc = themess.filter((themes) => themes.name === theme)[0].color;
    dispatch(setThemecolor(themecc));

    const formatKeymap = [
      {
        key: "Ctrl-Shift-x",
        run: (editorView) => {
          formatCode(editorView);
          return true; // Prevent default action
        },
      },
    ];

    if (editorContainerRef.current && !editorRef.current) {
      editorRef.current = new EditorView({
        state: EditorState.create({
          doc: activeCode|| codeSnippet,
          extensions: [
            basicSetup,
            cpp(),
            javascript({ typescript: true }),
            python(),
            themes[theme] || oneDark,
            isLineWrapping ? EditorView.lineWrapping : [],
            keymap.of([
              ...defaultKeymap,
              ...closeBracketsKeymap,
              ...searchKeymap,
              ...formatKeymap,
            ]),
            autocompletion(),
            lintGutter(),
            linter(myLinter),
            closeBrackets(),
            bracketMatching(),
            indentOnInput(),
            highlightActiveLine(),
            highlightSelectionMatches(),
            EditorState.tabSize.of(6),
            EditorView.updateListener.of((update) => {
              if (update.docChanged) {
                const newCode = update.state.doc.toString();
                dispatch(setEditorCode(newCode));
                 // Debounce auto-save
                 if (autoSaveTimerRef.current) {
                  clearTimeout(autoSaveTimerRef.current);
                }
                
                autoSaveTimerRef.current = setTimeout(() => {
                  saveCode(newCode);
                }, 2000);
              }
            }),
            // theme === "vs-dark" ? oneDark :  oneDark,
            // EditorView.lineWrapping.of(isLineWrapping),
            // activeTab?.language ? langs[activeTab.language]() : langs.javascript()
         
          ],
        }),
        parent: editorContainerRef.current,
      });
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [theme, themec, isLineWrapping, dispatch, language,activeTab]);

  const handleDownload = () => {
    const code = editorRef.current.state.doc.toString();
    const fileExtension = fileExtensions[language] || "txt";
    const fileName = `code.${fileExtension}`;
    downloadFile(code, fileName);
  };
  // const handleDownload = () => {
  //   if (editorRef.current) {
  //     const code = editorRef.current.state.doc.toString();
  //     const fileName = activeTab?.name || `code.${language}`;
  //     const blob = new Blob([code], { type: 'text/plain' });
  //     const url = URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = fileName;
  //     link.click();
  //     URL.revokeObjectURL(url);
  //   }
  // };
  return (
    <div
  className={`flex flex-1 flex-col overflow-hidden relative ${
    fileSectionVisible ? "" : "flex-1"
  }`}
  style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
>
  {/* Header Section */}
  <div
    className="p-2 text-gray-200 relative flex items-center justify-between"
    style={{ backgroundColor: themec }}
  >
    {/* Language Icon and Info */}
    <div>
      <img
        src={icon}
        alt={`${language} Icon`}
        className="inline-block w-6 h-6 mr-2"
      />
      <span style={{ color: "GrayText" }}>
      {/* {activeTab?.name || `code.${language} `} */}
        { language.toUpperCase()}: {info}
        {/* {activeTab.language.toUpperCase()}: {info} */}
      </span>
    </div>

    {/* Download Button with Icon */}
    <button
      onClick={handleDownload}
      className="absolute right-4 top-2 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none shadow-md transition-all"
      aria-label="Download Code"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 12l-7.5 7.5L4.5 12m7.5 7.5V3"
        />
      </svg>
    </button>
  </div>

  {/* Code Editor Container */}
  <div
    ref={editorContainerRef}
    className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
    style={{ height: "100%", backgroundColor: themec }}
  ></div>
</div>

  );
}
