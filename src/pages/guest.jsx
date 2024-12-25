import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Filerbar from "../components/filebar";
import CodeEditor from "../components/codeEditor";
import Terminal from "../components/terminal";
import Menubar from "../components/Menubar";

const Guest = ({onLogout}) => {
  const [fileSectionVisible, setFileSectionVisible] = useState(true);
  const [fileSectionWidth, setFileSectionWidth] = useState(0);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);

  return (
    <div className="h-screen flex flex-col overflow-hidden border-2 border-b-0 border-purple-800 shadow-lg border-r-purple-300"
    style={{
      background: "linear-gradient(135deg, #1E1E2E, #2A2A3D)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      
    }}>
      {/* Header */}
      <Navbar onLogout={onLogout} guest={true} />
      
      {/*Menubar */}
      <Menubar fileSectionVisible={fileSectionVisible} setFileSectionVisible={setFileSectionVisible} terminalVisible={terminalVisible} setTerminalVisible={setTerminalVisible} setTerminalHeight={setTerminalHeight} guest={true} />

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden bg-gray-800">       

        {/* IDE Section */}
        <CodeEditor fileSectionWidth={fileSectionWidth} fileSectionVisible={fileSectionVisible} />

      </div>

        {/* Terminal Section */}
      {terminalVisible && <Terminal terminalHeight={terminalHeight} setTerminalHeight={setTerminalHeight} setTerminalVisible={setTerminalVisible} />}
      

    </div>
  );
};

export default Guest;
