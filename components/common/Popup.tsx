import React from 'react'
import Box from './Box'

const Popup = ({children,isChat,isImage}) => {
  return (
    <div  className={`bg-black/20 fixed z-[200] top-[0] left-0 h-full w-full drop-shadow-2xl  flex items-center justify-center`}>
      <Box 
          isChat={isChat}
          isImage={isImage}
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