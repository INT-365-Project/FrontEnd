import React from 'react'
import Box from './Box'

const Popup = ({children,className}) => {
  return (
    <div className={` absolute z-[200] ${className}   left-0 h-full w-full drop-shadow-lg bg-black/[.15] flex items-center justify-center`}>
      <Box styles={{
          borderRadius: 50,
          paddingY: "3%",
          paddingX: "3%",
        }}
        className="animate-fadeIn"
        >
          {children}
      </Box>
    </div>
  )
}

export default Popup