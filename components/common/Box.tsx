import React from "react";

const Box = ({ children, styles, className ,isChat,isImage}) => {
  let stylesProps = {
    borderRadius: styles?.borderRadius || 15,
    width: styles?.width || "100%",
    paddingY: styles?.paddingY || "20px",
    paddingX: styles?.paddingX || "40px",
    position: styles?.position || "absolute",
  };
  return (
    <>
    {!isImage ? 
    <div
      className={`relative bg-white ${ isChat ? 'md:w-[660px] md:h-[600px]' : 'md:w-[560px] md:h-[450px]'} w-full  ${className}`}
      style={{
        ...styles,
        transition: "2s",
        width: stylesProps.width,
        padding: `${stylesProps.paddingY} ${stylesProps.paddingX}`,
      }}
    >
      {children}
    </div>
    :
    <div
      className={`relative bg-white md:w-auto h-auto md:h-[80%] w-[90%]  ${className}`}
      style={{
        ...styles,
        transition: "2s",
        width: stylesProps.width,
        padding: `${stylesProps.paddingY} ${stylesProps.paddingX}`,
      }}
    >
      {children}
    </div>
    }
    
    </> 
  );
};

export default Box;
