import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput } from "../store/apiResponseSlice";
import { Rnd } from "react-rnd";
import Split from "react-split";
import { FaTimes } from "react-icons/fa";

export default function InputOutputTerminal({ terminalHeight, setTerminalHeight, setTerminalVisible }) {
  const dispatch = useDispatch();
  const { input, output, code } = useSelector((state) => state.response);

  const handleInputChange = (e) => {
    dispatch(setInput(e.target.value));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setInput(event.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setInput(event.target.result));
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCloseTerminal = () => {
    setTerminalVisible(false);
  };
  const sharedTextStyle = {
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    lineHeight: "1.5",
    wordBreak: "break-word",
    padding: "1rem",
    color: "#d1d5db", // Slightly lighter gray for better readability
  };

  return (
    <Rnd
      size={{ height: terminalHeight, width: "100%" }}
      maxHeight={735}
      minHeight={100}
      position={{ x: 0, y: window.innerHeight - terminalHeight - 0.5 }}
      onResizeStop={(e, direction, ref) => {
        setTerminalHeight(ref.offsetHeight);
      }}
      className="bg-gray-900 border-t border-gray-700 text-gray-400 flex flex-col absolute bottom-0"
      enableResizing={{ top: true }}
      disableDragging={true}
    >
      <Split
        className="flex flex-row h-full"
        sizes={[50, 50]}
        minSize={375}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={0}
        direction="horizontal"
        cursor="col-resize"
        style={{ display: "flex" }}
      >
        <div className="bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Input</h3>
            <input
              type="file"
              className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
              onChange={handleFileUpload}
            />
          </div>
          <textarea
            className="flex-1 bg-gray-900 rounded resize-none"
            style={sharedTextStyle}
            value={input}
            onChange={handleInputChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            placeholder="Enter input here, drag and drop a file, or upload a file"
          ></textarea>
        </div>

        <div
          className={`bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col border-l-4 ${code === 0 ? "border-green-400" : ""
            }${code && code !== 0 ? "border-red-400" : ""}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Output</h3>
            <button
              className="text-gray-400 hover:text-red-500 transition-colors"
              onClick={handleCloseTerminal}
              title="Close Terminal"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
          <div
            className={`flex-1 bg-gray-900 rounded text-sm overflow-auto`}
            style={{
              ...sharedTextStyle,
              color: code === 0 ? "#22c55e" : code && code !== 0 ? "#ef4444" : "#d1d5db",
            }}
          >
            {output || "Output will be shown here."}
          </div>

        </div>
      </Split>
    </Rnd>
  );

}
