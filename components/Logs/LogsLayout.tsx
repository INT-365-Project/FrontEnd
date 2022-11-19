import React from 'react'

const LogsLayout = ({logs,setData,setOpenEyes}) => {
  const eyesDetail = (p: any) => {
    setData(p);
    setOpenEyes(true);
  };
  return (
    <div> {logs.map((p: any, index: any) => {
      return (
        <div key={p.reportId} onClick={()=>eyesDetail(p)} className=" cursor-pointer min-h-[110px] md:min-h-[50px] flex bg-white   justify-between rounded-[10px] border-b-[2px] pl-[15px] md:px-[40px] pb-[20px]  shadow-lg">
          <p className="pt-[10px] w-auto md:w-[200px] flex items-center"> {p.topic}</p>
          <div className="my-auto flex">
          <p className='pt-[10px]  pl-[25px] '>{p.createDate.slice(0, 10)}</p> 
          </div>
          <div className="my-auto md:ml-[120px] pb-[6px] flex pt-[10px] "> <p className='pl-[25px]'>users</p> </div>
          <button
            onClick={() => eyesDetail(p)}
            className="hidden mt-[10px]  border-[#919191] border-[1.7px] w-[30px] h-[30px]  rounded-[5px] md:flex justify-center items-center my-auto ml-[80px]"
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