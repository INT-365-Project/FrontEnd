import React from "react";

const Box = ({ children, styles, className }) => {
  let stylesProps = {
    borderRadius: styles?.borderRadius || 15,
    width: styles?.width || "100%",
    paddingY: styles?.paddingY || "20px",
    paddingX: styles?.paddingX || "40px",
    position: styles?.position || "absolute",
  };
  return (
    <div
      className={`relative bg-white lg:w-[70%] w-[90%]  ${className}`}
      style={{
        ...styles,
        transition: "2s",
        borderRadius: stylesProps.borderRadius,
        width: stylesProps.width,
        padding: `${stylesProps.paddingY} ${stylesProps.paddingX}`,
      }}
    >
      {children}
    </div>
  );
};

export default Box;
