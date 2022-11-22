import React from "react";

const FlexMessage = ({ bubbleText }) => {
  return (
    <>
      <div onClick={()=>{console.log('hi')}} className=" flex flex-col mt-[10px] pt-[20px] shadow-2xl bg-white-200 w-[260px] min-h-[60px] rounded-[15px] pb-[10px]">
       <div className="">
        {/* t */}
       <img src="https://www.sit.kmutt.ac.th/wp-content/uploads/2018/03/IMG_3452.jpg" className="rounded-t-[15px] object-cover" alt="img" />
        </div> 
        <div className="px-[10px] py-[10px] min-h-[80px] text-ellipsis overflow-hidden break-words">
        <p className="text-[14px] font-meduim">{bubbleText.topic === "" ? 'Topic' : bubbleText.topic }</p>
      <p className="text-[12px] max-w-prose"> {bubbleText.content === "" ? 'Content' : bubbleText.content}</p>
      <div className="pt-[10px]">
      <button className="text-[14px] rounded-[4px] text-white bg-green-400 py-[10px] w-full">{bubbleText.button === "" ? 'Button' : bubbleText.button}</button>
        </div>
        </div>

    </div>
    </>
  );
};

export default FlexMessage;
