import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReportServices from '../../services/report';
const Logs = () => {
  const [logs,setLogs] = useState([]);
  useEffect(()=>{
    ReportServices.getReport().then((res) => {
      setLogs(res.data.responseData);
    })
    .catch((err) => {
      console.log(err.response);
    });
  },[])
  return (
    <div id="news-card" className="w-full lg:w-[80%] ">
      <div className="mt-[10px] bg-white py-[10px] px-[18px] text-black subtitle flex justify-between drop-shadow-lg rounded-[5px] ">
        <p className="text-[24px] font-semibold">
          ปัญหา
        </p>
        <Link href="/report" passHref>
        <div
            className="transition-all duration-300 px-[12px] py-[4px] bg-[#336699] rounded-[5px] 
      hover:bg-[#336699]/40 text-white text-[16px] hover:text-black cursor-pointer"
          >
            ดูทั้งหมด  
          </div>
          </Link>
      </div>
      <div className="rounded-xl drop-shadow-lg bg-white mt-[20px] mx-auto h-[300px] overflow-hidden ">
        <div className=" text-[14px] lg:text-[16px] overflow-y-auto h-[330px] w-full mt-[10px] mx-auto ">
          <div className="flex justify-between pt-[20px] py-[5px] h-[60px border-b-[2px] text-[#919191]">
            <p className="pl-[20px]">
            หัวข้อปัญหา
            </p>
            <p className="pr-[20px]">
            วันที่แจ้ง
            </p>
          </div>
          {logs && logs.map((l,index) => {
            return (
              <div key={index} className="flex justify-between pt-[20px] py-[5px] h-[60px] short-sub-title border-b-[2px] ">
                <p className="w-[50%] pl-[20px]">{l.topic}</p>
                <p className="pr-[20px]">{l.createDate.slice(0,10)}</p>
                {/* <p>{dateFormat(publishedAt, "dd mmm yy")}</p> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Logs;
