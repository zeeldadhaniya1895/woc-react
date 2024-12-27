import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../components/Navbar";
import Filerbar from "../components/filebar";
import CodeEditor from "../components/codeEditor";
import Terminal from "../components/terminal";
import Menubar from "../components/Menubar";
import ChatWithAI from "../components/ChatWithAI";
import {setActiveCode,setActiveTab} from "../store/varSlice";
const Ide = ({ onLogout }) => {
  const [fileSectionVisible, setFileSectionVisible] = useState(true);
  const [fileSectionWidth, setFileSectionWidth] = useState(250);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);
  const [activeTab, setactiveTab] = useState(null);
  const [activeCode, setactiveCode] = useState("");

const dispatch = useDispatch();
  const handleTabSelect = (tab, code) => {
    setactiveTab(tab);
    setactiveCode(code);
    dispatch(setActiveTab(tab));
    dispatch(setActiveCode(code));
  };

  return (
    <div
      className="h-screen flex flex-col overflow-hidden border-2 border-b-0 border-purple-800 shadow-lg border-r-purple-300"
      style={{
        background: "linear-gradient(135deg, #1E1E2E, #2A2A3D)",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
        
      }}
    >
      {/* Header */}
      <Navbar onLogout={onLogout} guest={false} />
      
      {/*Menubar */}
      <Menubar fileSectionVisible={fileSectionVisible} setFileSectionVisible={setFileSectionVisible} terminalVisible={terminalVisible} setTerminalVisible={setTerminalVisible} setTerminalHeight={setTerminalHeight} guest={false} className="left-0"
      // onCreateEditor={onCreateEditor}
       />

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden bg-gray-800">
        {/* File Sidebar */}
        
        {fileSectionVisible && (
          <Filerbar
            fileSectionWidth={fileSectionWidth}
            setFileSectionWidth={setFileSectionWidth}
            setFileSectionVisible={setFileSectionVisible}
            onTabSelect={(tab,code)=>{handleTabSelect(tab,code)}}
            activeTab={activeTab}
            
            // style={{
            //   zIndex:100,
            // }}
          />
        )}
       

        {/* IDE Section */}
        <CodeEditor
          fileSectionWidth={fileSectionWidth}
          fileSectionVisible={fileSectionVisible}
          activeTab={activeTab}
          activeCode={activeCode}
          guest={false}
        />
      </div>

        <ChatWithAI />

      {/* Terminal Section */} 
      {terminalVisible && (
        <Terminal
          terminalHeight={terminalHeight}
          setTerminalHeight={setTerminalHeight}
          setTerminalVisible={setTerminalVisible}
         
        />
      )}
      
      
      
    </div>
  );
};

export default Ide;
