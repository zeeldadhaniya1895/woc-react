import React from 'react'
import { Rnd} from 'react-rnd'

export default function Filerbar({fileSectionWidth,setFileSectionWidth}) {
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
            className="bg-gray-900 border-r border-gray-700 flex flex-col justify-start items-center p-4"
          >
            <h3 className="text-gray-400">Sidebar</h3>
    </Rnd>
        
  )
}
