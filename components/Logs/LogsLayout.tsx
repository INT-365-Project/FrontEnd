import React from 'react'

const LogsLayout = ({logs,setData,setOpenEyes}) => {
  const eyesDetail = (p: any) => {
    setData(p);
    setOpenEyes(true);
  };
  return (
    <div> {logs.map((p: any, index: any) => {
      return (
        <div key={index} className="bg-white md:min-h-[140px] rounded-[10px] border-b-[2px] pl-[15px] md:px-[40px] pb-[20px]  shadow-lg">
          <p className="pt-[10px] pb-[6px]"><span className='text-[#919191]'>หัวข้อปัญหา</span> {p.topic}</p>
          <p className="my-auto md:pr-[20px] pb-[6px] flex">
          <span className='text-[#919191]'>วันที่แจ้ง</span><p className='pl-[25px]'>{p.createDate.slice(0, 10)}</p> 
          </p>
          <p className="my-auto pb-[6px] flex"> <span className='text-[#919191]'>แจ้งโดย</span> <p className='pl-[25px]'>mock up person</p> </p>
          <button
            onClick={() => eyesDetail(p)}
            className="border-[#919191] border-[1.7px] w-[30px] h-[30px]  rounded-[5px] flex justify-center items-center my-auto ml-[80px]"
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