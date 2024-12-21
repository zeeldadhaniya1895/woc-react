import React from 'react'
import { Rnd } from 'react-rnd'

export default function terminal({terminalHeight, setTerminalHeight}) {
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
      <h3 className="mb-2">Terminal</h3>
      <div className="flex-1 bg-gray-800 p-3 rounded text-sm overflow-auto">
        <p>Input/Output will be shown here.</p>
      </div>
    </Rnd>
  )
}
