import Link from "next/link";
import React from "react";
import Popup from "../common/Popup";

const PopupLogs = ({ setOpenEyes , data }) => {
  return (
    <Popup isImage={false} isChat={false}>
      <div className="w-full h-[40vh] drop-shadow-lg overflow-y-auto">
        <div className="border-b-[1.6px] w-full h-[40px] flex justify-end">
          <img
            src="/images/X.png"
            onClick={() => {
              setOpenEyes(false);
            }}
            className="mt-[10px] mr-[20px] w-[15px] h-[15px] cursor-pointer"
            alt="x"
          />
        </div>
        <div className="pl-[4%] pr-[4%] pt-[2%]">
          <div className="flex pt-[4%]">
            <h1 className="text-[#919191] w-[100px] text-[16px]">หัวข้อปัญหา</h1> <p className="">{data.topic}</p>
          </div>
          <div className="flex pt-[4%]">
            <h1 className="text-[#919191] w-[100px] text-[16px]">วันที่แจ้ง</h1> <p>{data.createDate.slice(0,10)}</p>
          </div> 
          {/* <div className="flex pt-[4%]">
            <h1 className="text-[#919191] w-[100px] text-[16px]">แจ้งโดย</h1> <p>mock up person</p>
          </div> */}
          <div className="flex pt-[1%] mt-[4%] border-[#919191] border-[1.8px] rounded-[10px] min-h-[180px] overflow-y-scroll overflow-x-hidden">
            <h1 className="text-[#919191] w-[100px] text-[16px]">รายละเอียด</h1> <p className="text-[14px] w-[200px]">{data.description}</p>
          </div>
          <div className="flex justify-center pt-[14px] text-[16px] text-white">
            <Link  href={{
                        pathname: `/report/[slug]`,        
                      }}
                      as={`/report/${data.reportId}`}
                      passHref>
            <button className="bg-[#336699] rounded-[5px] w-[134px] h-[28px]">ดูรายละเอียดปัญหา</button>
            </Link>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupLogs;
