import Head from "next/head";
import React, { useEffect, useState } from "react";
import Pagination from "../../components/common/Pagination";
import LogsLayout from "../../components/Logs/LogsLayout";
import PopupLogs from "../../components/Logs/PopupLogs";
import ReportServices from "../../services/report";
import { paginate } from "../../utils/paginate";

const Report = () => {
  const [logs, setLogs] = useState([]);
  const [openEyes, setOpenEyes] = useState(false);
  const [data, setData] = useState();
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilter] = useState({ s: "" ,sort:"" });
  const [currentPage,setCurrentPage] = useState(1);
  const handlePageChange = (page:any) =>{
    setCurrentPage(page)
  } 
  const pageSize = 10
  const paginateNews = paginate(logs,currentPage,pageSize)
  useEffect(() => {
    ReportServices.getReport()
      .then((res) => {
        setLogs(res.data.responseData);
        setFilteredLogs(res.data.responseData)
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  useEffect(() => {
    let filterData = logs.filter(
      (p) =>
        p.topic.toLowerCase().indexOf(filters.s.toLowerCase()) >= 0 ||
        p.createDate
          .slice(0, 10)
          .toLowerCase()
          .indexOf(filters.s.toLowerCase()) >= 0
    );
    if(filters.sort=='asc' || filters.sort=='desc' ){
      logs.sort((a,b)=>{
        new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        const diff = new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        if(diff===0) return 0;
        const sign = Math.abs(diff) / diff
        return filters.sort === 'asc' ? sign : -sign
      })
    }
    setFilteredLogs(filterData);
  }, [filters]);
  useEffect(() => {
    if (openEyes) {
      document.body.style.overflow = "hidden";
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openEyes]);

  const search = (s: any) => {
    console.log(s);
    setFilter({
      s,
      sort:""
    });
  };
  const sort = (sort) => {
    console.log(sort);
    setFilter({
      s:"",
      sort
    });
  };

  return (
    <div className="bg-[#F8F8F8] w-full min-h-screen px-[10px] lg:pl-[140px] pt-[120px]">
      <Head>
        <title>Report</title>
        <meta name="Chat" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {openEyes && <PopupLogs data={data} setOpenEyes={setOpenEyes} />}
      <div className="md:w-[95%]">
        <div className="flex justify-between items-center h-[128px] px-[20px]  md:px-[40px] bg-white rounded-[10px] shadow-lg">
          <div className="flex flex-col">
            <h1 className="text-[24px] text-black font-semibold pt-[10px]">
              ปัญหาทั้งหมด
            </h1>

            <div className="flex text-lfec relative mt-[10px]">
              <img
                src="/images/glass.svg"
                className="icon3"
                alt="pass"
                style={{
                  filter:
                    "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                }}
              />
              <input
                onKeyUp={(e) => search((e.target as HTMLInputElement).value)}
                type="text"
                className=" pl-[50px] border w-auto md:w-[400px] border-gray-300 text-gray-900 rounded-[10px] py-[4px] md:py-[8px] "
                placeholder="ค้นหาจากหัวข้อข่าว"
              />
              <div className="hidden md:block sm:ml-[20px] bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <select className="w-full" onChange={(e) => sort(e.target.value)}>
                  <option value="asc">Select</option>
                  <option value="asc">เรียงจากล่าสุด</option>
                  <option value="desc">เรียกจากเก่าสุด</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="block sm:hidden mt-[20px] md:ml-[100px] bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <select className="w-full">
            <option value="asc">Select</option>
            <option value="asc">เรียงจากล่าสุด</option>
            <option value="desc">เรียกจากเก่าสุด</option>
          </select>
        </div>
      </div>
      <div className="pt-[25px] pb-[40px] md:w-[95%]">
        <div className="bg-white min-h-[60px] rounded-[10px] border-b-[2px] text-[#919191] flex justify-between px-[30px] md:px-[40px] pt-[14px]">
          <h1 className="w-full">หัวข้อปัญหา</h1>
          <h1 className="w-full">วันที่แจ้ง</h1>
          <h1 className="w-full">สร้างโดย</h1>
          <h1></h1>
        </div>
        <LogsLayout
          logs={paginateNews}
          setData={setData}
          setOpenEyes={setOpenEyes}
        />
      </div>
      <Pagination items={logs.length} currentPage={currentPage} pageSize={pageSize} onPageChange={handlePageChange}/>
    </div>
  );
};

export default Report;
