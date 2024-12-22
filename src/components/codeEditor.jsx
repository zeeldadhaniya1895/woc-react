import React, { useEffect, useRef} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setEditorCode,
} from "../store/varSlice";

import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { oneDark } from "@codemirror/theme-one-dark";
import { boysAndGirls, ayuLight, barf, cobalt, clouds } from "thememirror";
import { defaultKeymap } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeEditor({ fileSectionWidth, fileSectionVisible }) {
  const dispatch = useDispatch();
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);


  const { theme, language, codeSnippet, isLineWrapping, icon, info} =
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
  }, [theme, isLineWrapping, dispatch, language]);


  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden relative ${fileSectionVisible ? "" : "flex-1"
        }`}
      style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
    >
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

      <div
        ref={editorContainerRef}
        className="flex-1 bg-gray-800 h-full overflow-auto text-gray-400"
        style={{ height: "100%" }}
      ></div>

    </div>
  );
}
