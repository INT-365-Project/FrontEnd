import React from "react";
import _ from "lodash";
const Pagination = ({ items, pageSize, currentPage, onPageChange }) => {
  const pageCount = items / pageSize;
  if (Math.ceil(pageCount) == 1) return null;
  const pages = _.range(1, pageCount + 1);
  const handleNext = () => {
    if (currentPage < pages.length) {
      onPageChange(currentPage + 1);
    }
  };
  const handlePrevious = () => {
    if (currentPage >1 ) {
      onPageChange(currentPage-1);
    }
  };
  return (
    <div className="flex items-center justify-center py-10 lg:px-0 sm:px-6 px-4">
      <div className="lg:w-full w-full  flex items-center justify-between  border-gray-200 dark:border-gray-700">

        <div className="flex text-[#8F90A6]">
          <p>Result {currentPage} of {pages.length}</p>
        </div>
        <div className="flex justify-between space-x-[18px] mr-[16px]">
            <div onClick={()=>handlePrevious()} className="flex items-center pt-3 text-gray-600 dark:text-gray-200  hover:text-indigo-700 cursor-pointer">
            <img src="/images/next.png" alt="next" className="rotate-180"/>

        </div>
        <div
          onClick={() => handleNext()}
          className="flex items-center pt-3 text-gray-600 dark:text-gray-200  hover:text-indigo-700 cursor-pointer"
        >
          <img src="/images/next.png" alt="next" />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
