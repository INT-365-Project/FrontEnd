import Link from "next/link";
import React, { useState } from "react";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/Pagination";

const UsersLayout = ({ search, sort, useData,isConvert}) => {
  const [currentPage,setCurrentPage] = useState(1);
  const pageSize = 9
  const handlePageChange = (page:any) =>{
    setCurrentPage(page)
  } 
  const paginateNews = paginate(useData,currentPage,pageSize)
  return (
    <div className="md:w-[95%] ">
    <div className="flex justify-between items-center mt-[20px] h-[80px] px-[10px] md:px-[20px] bg-white rounded-[10px] shadow-lg">
      <div className="flex flex-col w-full">
        <div className="mt-[8px] ">
          <div className="flex text-lfec relative">
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
              className=" pl-[50px] border w-full  border-gray-300 text-gray-900  py-[4px] md:py-[8px] rounded-[10px] sm:w-[90%]"
              placeholder="ค้นหาจากหัวข้อข่าว"
            />
              <div className="ml-[4px] sm:ml-[20px] bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 md:w-[10%] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <select className="w-full" onChange={(e) => sort(e.target.value)}>
            <option value="">Select</option>
            <option value="asc">เรียงจากล่าสุด</option>
            <option value="desc">เรียกจากเก่าสุด</option>
          </select>
        </div>
          </div>
        </div>
      </div>
    </div>
    <div className="pt-[40px] pb-[40px] w-full relative mt-[10px]">
      <div >
        <h1 className="w-full text-[24px] font-bold ">ข่าวทั้งหมด</h1>
      </div>
      <div className="flex flex-wrap mx-auto items-center">
      {useData &&
        isConvert &&
        paginateNews.map((n: any, index: any) => {
          return (
            <Link
            href={{
              pathname: `/news/${n.newId}`,
              query: { query: n.newId },
            }}
            passHref
          >
            <div data-aos="fade-up" className=" min-h-[246px] w-full lg:w-[31%] overflow-hidden shadow-lg rounded-[15px] mt-[14px] lg:mr-[18px] bg-white">
              <div className="overflow-hidden h-[248px]">
                <img src={n.source} className="w-full h-auto" alt="" />
              </div>
              <div className="px-6 py-4">
                <div className="font-bold mb-2 text-[16px]">{n.title}</div>
                <div className="flex items-center space-x-[10px]">
                <img src="images/date.png" alt="" />
                <p className="text-[#919191] text-[12px] text-base">
                  {n.createDate.slice(0, 10)}
                </p>
                </div>
              </div>
            </div>
            </Link>
          );
        })}
        </div>
    </div>
    <Pagination
          items={useData.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
  </div>
  );
};

export default UsersLayout;
