import Link from "next/link";
import React from "react";
import Popup from "../../components/common/Popup";

const PopupNews = ({ data, setIsPreview }) => {
  return (
    <Popup>
      <div className="w-full h-[50vh] drop-shadow-lg overflow-y-auto">
        <div className="border-b-[1.6px] w-full h-[40px] flex justify-end">
          <img
            src="/images/x.png"
            onClick={() => {
              setIsPreview(false);
            }}
            className="mt-[10px] mr-[20px] w-[15px] h-[15px] cursor-pointer"
            alt="x"
          />
        </div>
        <div className="pl-[4%] pr-[4%] pt-[2%]">
          <div className="flex">
            <div className="w-[200px] h-[140px] border-[#919191] border-[1.8px] rounded-[10px] relative">
              {data && (
                <img src={data.source} className="w-full" alt="default" />
              )}
            </div>
            <div className="pl-[4%]">
              <div className="flex pt-[4%]">
                <h1 className="text-[#919191] w-[100px] text-[16px]">
                  หัวข้อปัญหา
                </h1>{" "}
                <p className="w-[200px]">{data && data.title}</p>
              </div>
              <div className="flex pt-[4%]">
                <h1 className="text-[#919191] w-[100px] text-[16px]">
                  วันที่แจ้ง
                </h1>{" "}
                <p>{data && data.createDate.slice(0, 10)}</p>
              </div>
              <div className="flex pt-[4%]">
                <h1 className="text-[#919191] w-[100px] text-[16px]">
                  แจ้งโดย
                </h1>{" "}
                <p>{data && data.createBy}</p>
              </div>
            </div>
          </div>
          <h1 className="text-[#919191] w-[100px] text-[16px] mt-[4%]">
            รายละเอียด
          </h1>{" "}
          <div className="flex pt-[1%] mt-[2%] border-[#919191] border-[1.8px] rounded-[10px] min-h-[130px] overflow-y-scroll overflow-x-hidden">
            <textarea className="text-[14px] pl-[10px] w-full">
              {data && data.detail}
            </textarea>
          </div>
          <div className="flex justify-center pt-[14px] text-[16px] text-white">
            {data && (
              <Link
                href={{
                  pathname: `/news/${data.newId}`,
                  query: { query: data.newId },
                }}
                passHref
              >
                <button className="bg-[#336699] rounded-[5px] w-[134px] h-[28px]">
                  ดูรายละเอียดข่าว
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default PopupNews;
