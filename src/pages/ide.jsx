// import React, { useState } from "react";
// import { Rnd } from "react-rnd";
// import Navbar from "../components/Navbar";
// import Terminal from "../components/Terminal";


// const App = () => {
//   const [fileSectionVisible, setFileSectionVisible] = useState(true);
//   const [fileSectionWidth, setFileSectionWidth] = useState(250);
//   const [terminalVisible, setTerminalVisible] = useState(false);
//   const [terminalHeight, setTerminalHeight] = useState(100);

//   return (
//     <div className="h-screen flex flex-col">
//       {/* Header */}
//       <Navbar />
//       <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
//         <button
//           onClick={() => setFileSectionVisible(!fileSectionVisible)}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
//         >
//           Toggle Sidebar
//         </button>
//         <button
//           onClick={() => setTerminalVisible(!terminalVisible)}
//           className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
//         >
//           Toggle Terminal
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-1 relative overflow-hidden bg-gray-800">
//         {/* File Sidebar */}
//         {fileSectionVisible && (
//           <Rnd
//             size={{ width: fileSectionWidth,height: '100%' }}
//             minWidth={150}
//             maxWidth={400}
//             enableResizing={{ right: true }}
//             disableDragging={true}
//             onResizeStop={(e, direction, ref, delta, position) => {
//               setFileSectionWidth(ref.offsetWidth);
//             }}
//             className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
//           >
//             <h3 className="text-gray-400">Sidebar</h3>
//           </Rnd>
//         )}

//         {/* IDE Section */}
//         <div
//           className={flex flex-1 flex-col overflow-hidden relative ${fileSectionVisible ? '' : 'flex-1'}}
//           style={{ marginLeft: fileSectionVisible ? fileSectionWidth : 0 }}
//         >
//           <div className="flex-1 bg-gray-800 p-5 overflow-auto text-gray-400">
//             <h3>IDE Content Area</h3>
//           </div>
//         </div>
//         {/* <div  className="absolute  w-full"> */}
//           {/* Terminal Section */}
         
//           {/* </div> */}
//       </div>
//        {terminalVisible && (
//         // <Terminal terminalheight={terminalHeight} setTerminalHeight={setTerminalHeight} />
//             <Rnd
//               size={{ height: terminalHeight, width: "100%" }}
//               style={{bottom: 0}}
//               minHeight={100}
//               maxHeight={400}
//               enableResizing={{ top: true }}
//               disableDragging={true}
//               // position={{y:window.innerHeight - 100}}
//               position={null}
//               onResizeStop={(e, direction, ref, delta, position) => {
//                 setTerminalHeight(ref.offsetHeight);
//               }}
//               className="bg-gray-900 absolute bottom-0 border-t border-gray-700 text-gray-400 flex flex-col p-4"
//             >
//               <h3 className="mb-2">Terminal</h3>
//               <div className="flex-1 bg-gray-800 p-3 rounded text-sm overflow-auto">
//                 <p>Input/Output will be shown here.</p>
//               </div>
//             </Rnd>
//           )}
//       </div>
//     // </div>
//   );
// };

// export default App;


import React, { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { EditorView } from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import Navbar from "../components/Navbar";

const App = () => {
  const [fileSectionVisible, setFileSectionVisible] = useState(true);
  const [fileSectionWidth, setFileSectionWidth] = useState(250);
  const [terminalVisible, setTerminalVisible] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(250);
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
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Navbar />
      <div className="bg-gray-900 text-white p-2 flex justify-between items-center">
        <button
          onClick={() => setFileSectionVisible(!fileSectionVisible)}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Toggle Sidebar
        </button>
        <button
          onClick={() => {
            setTerminalVisible(!terminalVisible);
            setTerminalHeight(250);
          }}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Toggle Terminal
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 relative overflow-hidden bg-gray-800">
        {/* File Sidebar */}
        {fileSectionVisible && (
          <Rnd
            size={{ width: fileSectionWidth, height: "100%" }}
            minWidth={150}
            maxWidth={400}
            enableResizing={{ right: true }}
            disableDragging={true}
            onResizeStop={(e, direction, ref) => {
              setFileSectionWidth(ref.offsetWidth);
            }}
            className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
          >
            <h3 className="text-gray-400">Sidebar</h3>
          </Rnd>
        )}

        {/* IDE Section */}
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
      </div>

      {/* Terminal Section */}
      {terminalVisible && (
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
