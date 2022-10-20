import React, { useState } from "react";
import Pagination from "../common/Pagination";
import {paginate} from "../../utils/paginate"
const NewsAdminLayout = ({
  adminUser,
  setIsOpen,
  sort,
  useData,
  isConvert,
  eyesDetail,
  removeNews,
  editNews,
  search,
}) => {
  const [currentPage,setCurrentPage] = useState(1);
  const pageSize = 5
  const handlePageChange = (page:any) =>{
    setCurrentPage(page)
  } 
  const paginateNews = paginate(useData,currentPage,pageSize)
  return (
    <div className="md:w-[95%] ">
      <div className="flex justify-between items-center mt-[80px] h-[148px] px-[10px] md:px-[40px] bg-white rounded-[10px] shadow-lg">
        <div className="flex flex-col">
          <div className="title text-black flex justify-between">
            <p>ข่าวทั้งหมด</p>
            {adminUser && (
              <div className="sm:hidden">
                <button
                  onClick={() => setIsOpen(true)}
                  className=" flex justify-between items-center space-x-[10px] text-white border-[2px] md:px-[14px] py-[18px] transition-all duration-300 bg-[#336699] rounded-[5px] h-[50%] p-1 "
                >
                  <img
                    src="/images/plus.svg"
                    className="md:block hidden"
                    alt=""
                    style={{
                      filter:
                        "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                    }}
                  />
                  <p className="text-[14px] pr-[10px]">สร้างข่าว</p>
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center mt-[8px]">
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
                className=" pl-[50px] border w-full  border-gray-300 text-gray-900  py-[4px] md:py-[8px] rounded-[10px] sm:w-[400px]"
                placeholder="ค้นหาจากหัวข้อข่าว"
              />
              <div className="hidden md:block sm:ml-[20px] bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <select
                  className="w-full"
                  onChange={(e) => sort(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="asc">เรียงจากล่าสุด</option>
                  <option value="desc">เรียกจากเก่าสุด</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {adminUser && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex justify-between items-center space-x-[10px] text-white border-[2px] md:px-[14px] py-[10px] transition-all duration-300 bg-[#336699] rounded-[5px] h-[50%] p-1 "
          >
            <img
              src="/images/plus.svg"
              className=""
              alt=""
              style={{
                filter:
                  "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
              }}
            />
            <p className="text-[12px] md:text-[14px] ">สร้างข่าว</p>
          </button>
        )}
      </div>
      <div className="pt-[40px] pb-[40px] ">
        <div className="bg-white min-h-[50px] rounded-[10px] border-b-[2px] text-[#919191] flex justify-between px-[30px] md:px-[100px] pt-[14px]">
          <h1 className="w-full pl-[70px]">หัวข้อข่าว</h1>
          <h1 className="w-full">วันที่ลงข่าว</h1>
          <h1 className="w-full">สร้างโดย</h1>
          <h1></h1>
        </div>
        {useData &&
          isConvert &&
          paginateNews.map((n: any, index: any) => {
            return (
              <div key={index} className=" bg-white h-[100px] md:h-[50px] rounded-[10px] border-b-[2px] px-[40px] flex shadow-lg">
                <img
                  src={n.source}
                  className="object-contain my-auto  w-[42px] h-[42px] relative lg:object-contain rounded-t-2xl lg:rounded-t-none  lg:rounded-l-2xl cursor-pointer"
                  alt="thumbnail"
                />
                <div className="flex flex-row md:justify-between w-full">
                  <p className="text-[14px] my-auto short-sub-title text-black pt-[10px] pl-[20px] w-full md:w-[30%]">
                    {n.title}
                  </p>
                  <p className="w-full my-auto md:w-[40%] pt-[10px] md:pl-[80px]">
                    {n.createDate.slice(0, 10)}
                  </p>
                  <p className="w-full my-auto md:w-[40%] pt-[10px]">
                    {n.createBy}
                  </p>
                  <div className="hidden md:flex flex-col md:flex-row space-x-[6px]">
                    <button
                      onClick={() => eyesDetail(n)}
                      className="border-[#919191] border-[1.7px] w-[30px] h-[30px] mt-[8px] rounded-[5px] flex justify-center items-center"
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
                    <button
                      className="border-[#919191] border-[1.7px] w-[30px] h-[30px] mt-[8px] rounded-[5px] flex justify-center items-center"
                      onClick={() => editNews(n)}
                    >
                      <img
                        src="/images/edit.svg"
                        alt=""
                        style={{
                          filter:
                            "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                        }}
                      />
                    </button>
                    <button
                      className="border-[#919191] border-[1.7px] w-[30px] h-[30px] mt-[8px] rounded-[5px] flex justify-center items-center"
                      onClick={() => removeNews(n.newId)}
                    >
                      <img
                        src="/images/delete.svg"
                        alt=""
                        style={{
                          filter:
                            "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                        }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        <Pagination
          items={useData.length}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NewsAdminLayout;
