
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import Navbar from "../components/Navbar";
import Filerbar from "../components/filebar";
import CodeEditor from "../components/codeEditor";
import Terminal from "../components/terminal";
import Menubar from "../components/Menubar";

const App = () => {
  const [fileSectionVisible, setFileSectionVisible] = useState(true);
  const [fileSectionWidth, setFileSectionWidth] = useState(250);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Navbar />
      
      {/*Menubar */}
      <Menubar fileSectionVisible={fileSectionVisible} setFileSectionVisible={setFileSectionVisible} terminalVisible={terminalVisible} setTerminalVisible={setTerminalVisible} />

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden bg-gray-800">
        
        {/* File Sidebar */}
        {fileSectionVisible &&<Filerbar fileSectionWidth={fileSectionWidth} setFileSectionWidth={setFileSectionWidth} />}
        {/* IDE Section */}
        <div
          className={`flex flex-1 flex-col overflow-hidden relative ${
            fileSectionVisible ? "" : "flex-1"
          }`}
          style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
        >
          <div className="flex-1 bg-gray-800 p-5 overflow-auto text-gray-400">
            <h3>IDE Content Area</h3>
          </div>
        </div>
      </div>

      {/* Terminal Section */}
      {terminalVisible && (
        <Rnd
          size={{ height: terminalHeight, width: "100%" }}
          position={{ x: 0, y: window.innerHeight - terminalHeight }}
          onResizeStop={(e, direction, ref) => {
            setTerminalHeight(ref.offsetHeight);
          }}
          className="bg-gray-900 border-t border-gray-700 text-gray-400 flex flex-col absolute bottom-0"
          enableResizing={{ top: true }}
          disableDragging={true}
        >
          <h3 className="mb-2">Terminal</h3>
          <div className="flex-1 bg-gray-800 p-3 rounded text-sm overflow-auto">
            <p>Input/Output will be shown here.</p>
          </div>
        </Rnd>
      )}
    </div>
  );
};

export default App;
