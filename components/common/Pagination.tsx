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
          <p>Result {pageSize} of {items}</p>
          {/* {pages.map((page) => {
            return (
              <p
                key={page}
                onClick={() => onPageChange(page)}
                className={`${
                  page === currentPage
                    ? "text-indigo-700 dark:text-indigo-400 border-t border-indigo-400"
                    : " text-gray-600 dark:text-gray-200  hover:text-indigo-700 dark:hover:text-indigo-400"
                } text-sm font-medium leading-none cursor-pointer border-t border-transparent hover:border-indigo-400 pt-3 mr-4 px-2`}
              >
                {page}
              </p>
            );
          })} */}
        </div>
        <div className="flex justify-between space-x-[18px] mr-[16px]">
            <div onClick={()=>handlePrevious()} className="flex items-center pt-3 text-gray-600 dark:text-gray-200  hover:text-indigo-700 cursor-pointer">
            <img src="/images/next.png" alt="next" className="rotate-180"/>
          {/* <p className="text-sm ml-3 font-medium leading-none ">Previous</p> */}
        </div>
        <div
          onClick={() => handleNext()}
          className="flex items-center pt-3 text-gray-600 dark:text-gray-200  hover:text-indigo-700 cursor-pointer"
        >
          {/* <p className="text-sm font-medium leading-none mr-3">Next</p> */}
          <img src="/images/next.png" alt="next" />
          {/* <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.1665 4H12.8332"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 7.33333L12.8333 4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.5 0.666687L12.8333 4.00002"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg> */}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
