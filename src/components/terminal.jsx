// components/InputOutputTerminal.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInput } from "../store/apiResponseSlice";
import { Rnd } from "react-rnd";

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

  return (
    <Rnd
      size={{ height: terminalHeight, width: "100%" }}
      maxHeight={735}
      minHeight={100}
      position={{ x: 0, y: window.innerHeight - terminalHeight - 3 }}
      onResizeStop={(e, direction, ref) => {
        setTerminalHeight(ref.offsetHeight);
      }}
      className="bg-gray-900 border-t border-gray-700 text-gray-400 flex flex-col absolute bottom-0"
      enableResizing={{ top: true }}
      disableDragging={true}
    >
      <div className="flex flex-row h-full">
        {/* Input Section */}
        <div className="w-1/2 bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Input</h3>
            <input
              type="file"
              className="text-sm text-gray-400 file:mr-2 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
              onChange={handleFileUpload}
            />
          </div>

          <textarea
            className="flex-1 bg-gray-700 text-gray-200 p-2 rounded resize-none"
            value={input}
            onChange={handleInputChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            placeholder="Enter input here, drag and drop a file, or upload a file"
          ></textarea>
        </div>

        {/* Output Section */}
        <div
          className={`w-1/2 bg-gray-800 p-3 rounded text-sm overflow-auto flex flex-col ${
            code === 1 ? "border-red-500" : "border-green-500"
          } border-l-4`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-white">Output</h3>
            <button
              className="text-white bg-red-600 hover:bg-red-500 rounded px-3 py-1 text-sm"
              onClick={handleCloseTerminal}
            >
              Close
            </button>
          </div>
          <div
            className={`flex-1 bg-gray-700 p-2 rounded text-sm text-white overflow-auto ${
              code === 1 ? "text-red-400" : "text-green-400"
            }`}
          >
            {output || "Output will be shown here."}
          </div>
        </div>
      </div>
    </Rnd>
  );
}
