import { Head } from "next/document";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ReportServices from "../../services/report";

const problemDetail = () => {
  const router = useRouter();
  const { query } = router;
  const [pageRid,setPageRid] = useState("");
  const [reportData,setReportData] = useState(null)
  if (query.slug != undefined) {
    localStorage.setItem("rId", query.slug.toString());
  }
  if(query){
    console.log(query)
  }
  useEffect(() => {
    const rId = JSON.parse(localStorage.getItem("rId"));
    if (rId) {
      setPageRid(rId);
    }
  }, []);
  useEffect(() => {
    if (pageRid) {
      ReportServices.getReportById(pageRid)
        .then((res) => {
          setReportData(res.data.responseData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [pageRid]);
  if(reportData){
    console.log(reportData)
  }
  return (
    <div className="bg-[#F8F8F8] w-full min-h-screen px-[10px] lg:pl-[140px] pt-[120px]">
      {/* <Head>
        <title>Problems-Detail</title>
        <meta name="Detail" content="Detail" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <main className="min-h-screen relative w-full">
        <div className="md:w-[90%]">
          <div className="flex space-x-[15px]">
            <Link href="/report" passHref>
              <h1 className="text-[#919191] cursor-pointer hover:text-[#919191]/60">
                ปัญหาทั้งหมด
              </h1>
            </Link>
            <p className="text-[#919191] cursor-default">{">"}</p>
            <h1 className="text-[#336699] cursor-default">รายละเอียดปัญหา</h1>
          </div>
          <div className="flex justify-between items-center bg-white mb-[20px] rounded-[5px] px-[20px] pt-[10px] mt-[10px]">
            <div className="mb-[20px] ">
              <h1 className="text-[24px] font-bold pt-[10px]">
                รายละเอียดข่าว
              </h1>
            </div>
          </div>
          <div className="bg-white w-full min-h-[400px] mt-[20px] rounded-[5px]">
            <div className="border-b-[1.4px] h-[40px] rounded-[5px] md:pl-[100px] pl-[30px] pt-[10px] text-[#919191]">
              <h1>รายละเอียดปัญหา</h1>
              <div>
                <div className="text-body pb-[20px] pt-[40px] flex">
                  <label className="text-[#919191]  md:w-[20%]  tracking-wider ">
                    หัวข้อปัญหา
                  </label>
                  <h1 className="text-black  w-full pl-[10px] md:pl-[200px]">{reportData && reportData.topic}</h1>
                </div>
                <div className="pb-[20px] flex ">
                  <label className="text-[#919191] md:w-[20%]  tracking-wider pt-[20px]">
                    รายละเอียด
                  </label>
                  <h1 className="text-black md:ml-[140px] pl-[20px] w-full md:w-[50%]  pt-[10px] md:pr-[120px] border-[#919191] border-[1.6px] rounded-[10px]">
                    {reportData && reportData.description}
                  </h1>
                </div>
                <div className="pb-[20px] flex items-center">
                  <label className="text-[#919191] md:w-[20%]  tracking-wider pt-[20px]">
                    วันที่แจ้ง
                  </label>
                  <h1 className="text-black w-full pl-[20px] md:pl-[200px] pt-[10px] ">
                    {reportData && reportData.createDate.slice(0,10)}
                  </h1>
                </div>
                <div className="pb-[20px] flex items-center">
                  <label className="text-[#919191] md:w-[20%]  tracking-wider pt-[20px]">
                    แจ้งโดย
                  </label>
                  <h1 className="text-black w-full pl-[20px] md:pl-[200px] pt-[10px] ">
                    test
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-[20px]">
            <Link href="/report" passHref>
            <button className="transition-all duration-300 p-2 border-[1.6px] bg-[#336699] hover:border-[#336699] hover:bg-white rounded hover:text-black text-white text-[18px] ">ย้อนกลับ</button>
            </Link>
          </div>
      </main>
    </div>
  );
};

export default problemDetail;
