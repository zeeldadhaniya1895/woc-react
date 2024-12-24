// Import necessary dependencies from React and Redux
import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditorCode,
  setThemecolor,
} from "../store/varSlice";
// Import CodeMirror related dependencies
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, highlightActiveLine } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import {cpp} from "@codemirror/lang-cpp"
import { python } from "@codemirror/lang-python";
import { themess } from "../config/theme";
// Updated imports for folding and bracket matching
import { indentOnInput, bracketMatching, syntaxHighlighting } from "@codemirror/language";
import { highlightSelectionMatches } from "@codemirror/search";
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter, linter } from "@codemirror/lint";
import { searchKeymap } from "@codemirror/search";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";


//formate code
import prettier from "prettier/standalone";
import prettierPluginJava from "prettier-plugin-java";

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

// Custom lint function (example for linting JavaScript code)
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

// CodeEditor component
export default function CodeEditor({ fileSectionWidth, fileSectionVisible }) {
  const dispatch = useDispatch();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);

  const { theme, themec, language, codeSnippet, isLineWrapping, icon, info } =
    useSelector((state) => state.var.editor);

  useEffect(() => {
    const savedCode = sessionStorage.getItem("codeSnippet");
    if (savedCode) {
      dispatch(setEditorCode(savedCode));
    }
  }, [dispatch]);

  const themes = {
    oneDark,
    boysAndGirls,
    ayuLight,
    barf,
    cobalt,
    clouds,
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
          doc: codeSnippet,
          extensions: [
            basicSetup,
            cpp(),
            javascript({ typescript: true }),
            python(),
            themes[theme] || oneDark,
            isLineWrapping ? EditorView.lineWrapping : [],
            keymap.of([...defaultKeymap, ...closeBracketsKeymap, ...searchKeymap,...formatKeymap]),
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
  }, [theme, themec, isLineWrapping, dispatch, language]);

  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden relative ${
        fileSectionVisible ? "" : "flex-1"
      }`}
      style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
    >
      <div className="p-2 text-gray-200" style={{ backgroundColor: themec }}>
        <img
          src={icon}
          alt={`${language} Icon`}
          className="inline-block w-6 h-6 mr-2"
        />
        <span style={{ color: "GrayText" }}>
          {language.toUpperCase()}: {info}
        </span>
      </div>
      <div
        ref={editorContainerRef}
        className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
        style={{ height: "100%", backgroundColor: themec }}
      ></div>
    </div>
  );
}
