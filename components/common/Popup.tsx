import React from 'react'
import Box from './Box'

const Popup = ({children}) => {
  return (
    <div className={` absolute z-[200] top-[0]   left-0 h-full w-full drop-shadow-lg bg-black/[.15] flex items-center justify-center`}>
      <Box styles={{
          borderRadius: 10,
          paddingY: "0",
          paddingX: "0",
          width:"40%"
        }}
        className=""
        >
          {children}
      </Box>
    </div>
  )
}

export default Popup