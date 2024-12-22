// Import React and react-rnd components
import React from 'react'
import { Rnd} from 'react-rnd'

// Export default Filebar component that takes fileSectionWidth and setFileSectionWidth as props
export default function Filerbar({fileSectionWidth,setFileSectionWidth}) {
  return (
    // Resizable component with specific configurations
    <Rnd
            // Set initial size with width from props and full height
            size={{ width: fileSectionWidth, height: "100%" }}
            // Set minimum width constraint
            minWidth={150}
            // Set maximum width constraint
            maxWidth={400}
            // Enable resizing only from right side
            enableResizing={{ right: true }}
            // Disable dragging functionality
            disableDragging={true}
            // Handle resize stop event and update width
            onResizeStop={(e, direction, ref) => {
              setFileSectionWidth(ref.offsetWidth);
            }}
            // Apply styling classes for appearance
            className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
          >
            {/* Sidebar title */}
            <h3 className="text-gray-400">Sidebar</h3>
    </Rnd>
        
  )
}