import React from 'react'

const LogsLayout = ({logs,setData,setOpenEyes}) => {
  const eyesDetail = (p: any) => {
    setData(p);
    setOpenEyes(true);
  };
  return (
    <div> {logs.map((p: any, index: any) => {
      return (
        <div key={index} className="bg-white h-[120px] md:h-[50px] rounded-[10px] border-b-[2px] pl-[15px] md:px-[40px] flex shadow-lg">
          <p className="w-[32%] my-auto md:pl-[5px]">{p.topic}</p>
          <p className="w-[32%] my-auto md:pr-[20px]">
            {p.createDate.slice(0, 10)}
          </p>
          <p className="w-[20%] my-auto">mock up person</p>
          <button
            onClick={() => eyesDetail(p)}
            className="border-[#919191] border-[1.7px] w-[30px] h-[30px] mt-[32px] md:mt-[12px] rounded-[5px] flex justify-center items-center my-auto"
          >
            <img
              src="/images/eyes.svg"
              alt=""
              style={{
                filter:
                  "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
              }}
            />
          </button>
        </div>
      );
    })}</div>
  )
}

export default LogsLayout