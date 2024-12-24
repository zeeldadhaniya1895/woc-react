// Import React and react-rnd components
import React from "react";
import { Rnd } from "react-rnd";
import { FaTimes } from "react-icons/fa";

// Export default Filerbar component that takes fileSectionWidth and setFileSectionWidth as props
export default function Filerbar({ fileSectionWidth, setFileSectionWidth, setFileSectionVisible }) {
  return (
    <Rnd
      size={{ width: fileSectionWidth, height: "100%" }}
      minWidth={150}
      maxWidth={400}
      enableResizing={{ right: true }}
      disableDragging={true}
      onResizeStop={(e, direction, ref) => {
        setFileSectionWidth(ref.offsetWidth);
      }}
      className="bg-gray-900 border-r border-gray-700 flex flex-col relative"
    >
      {/* Close button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
        onClick={() => setFileSectionVisible(false)}
        title="Close Sidebar"
      >
        <FaTimes className="w-5 h-5" />
      </button>

      {/* Sidebar title */}
      <div className="flex items-center justify-between w-full px-4 py-2 border-b border-gray-700">
        <h3 className="text-lg font-bold text-gray-200">File Explorer</h3>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-sm px-4">
        <p>Manage your files here</p>
        <p className="mt-2 text-xs italic">Drag and resize the sidebar</p>
      </div>
    </Rnd>
  );
}
