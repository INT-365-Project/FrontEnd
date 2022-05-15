import React from 'react'
import Box from './Box'

const Popup = ({children}) => {
  return (
    <div className='absolute z-[200] top-[-730px] left-0 h-full w-full bg-black/[.15] flex items-center justify-center'>
      <Box styles={{
          // width: "80%",
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