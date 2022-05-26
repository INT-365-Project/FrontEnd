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
    <div id="news-card" className="w-full lg:w-[95%] ">
      <div className="text-purple subtitle">Logs</div>
      <div className="rounded-xl drop-shadow-lg bg-white mt-[10px] mx-auto h-[400px] overflow-hidden ">
        <div className="pl-[10px] text-[14px] lg:text-[16px] lg:pl-[30px] pr-[20px] overflow-y-auto h-[330px] w-[90%] mt-[30px] mx-auto text-warmGray-500 ">
          {logs.map((l,index) => {
            return (
              <div key={index} className="flex justify-between pt-[20px] py-[5px] h-[70px]short-sub-title">
                <p className="w-[50%]">{l.topic}</p>
                <p >{l.createDate.slice(0,10)}</p>
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
