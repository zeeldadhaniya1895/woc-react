

export default function Menubar() {
  return (
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
  )
}
