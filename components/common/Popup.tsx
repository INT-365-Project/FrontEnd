import React from 'react'
import Box from './Box'

const Popup = ({children,isChat}) => {
  return (
    <div className={` absolute z-[200] top-[0] left-0 h-full w-full drop-shadow-2xl  flex items-center justify-center`}>
      <Box 
          isChat={isChat}
          styles={{
          borderRadius: 10,
          paddingY: "0",
          paddingX: "0",
          width:"50%",
        }}
        className=""
        >
          {children}
      </Box>
    </div>
  )
}

export default Popup