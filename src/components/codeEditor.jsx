import React, { useState, useEffect, useRef } from "react";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

export default function codeEditor({fileSectionWidth,fileSectionVisible}) {
      const editorContainerRef = useRef(null);
      const editorRef = useRef(null);
        useEffect(() => {
          if (editorContainerRef.current && !editorRef.current) {
            editorRef.current = new EditorView({
              state: EditorState.create({
                doc: "// Write your code here\nconsole.log('Hello, CodeMirror!');",
                extensions: [basicSetup, javascript()],
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
        }, []);
  return (
    <div
              className={`flex flex-1 flex-col overflow-hidden relative ${
                fileSectionVisible ? "" : "flex-1"
              }`}
              style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
            >
              <div
                ref={editorContainerRef}
                className="flex-1 bg-gray-800 p-5 overflow-auto text-gray-400"
                style={{ height: "100%" }}
              ></div>
    </div>
  )
}
