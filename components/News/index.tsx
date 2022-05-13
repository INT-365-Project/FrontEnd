import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare,faTrashCan} from '@fortawesome/free-solid-svg-icons'
const data = [
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
  {
    cover:
      "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
    title: "Seminar Red-hat company",
    short_subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    publish_at: "12-12-2021",
  },
];

const News = () => {
  return (
    <div id="news-card" className="w-[95%] lg:w-full mt-[30px] lg:mt-0">
      <div className="flex justify-between"><div className="text-purple subtitle">News</div><div className="transition-all duration-300 px-[20px] border-[1.7px] border-purple rounded-2xl hover:bg-purple text-purple hover:text-white cursor-pointer">See All</div></div>
      {data.map((n, index) => {
        if (index <= 5) {
          return (
            <div key={index} className="rounded-2xl drop-shadow-lg mt-[12px] bg-white w-full h-[110px] flex">
              <div className="w-[200px]  rounded-l-2xl h-full bg-red-300">
                  <img src={n.cover} className="object-cover h-full rounded-l-2xl" alt="" />
              </div>
              <div className="w-full flex lg:flex-row flex-col">
              <div className=" lg:w-[50%] pl-[10px] lg:pl-[40px] lg:my-auto lg:pt-0 pt-[10px]">
                      <p className="text-[14px] text-purple">{n.title}</p>
                      <p className="text-[12px] text-warmGray-500 short-sub-title">{n.short_subtitle}</p>
                  </div>
                  <div className="lg:w-[10%] flex pl-[20px] text-[14px] my-auto space-x-2 ">
                      <button className="flex space-x-1 border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl">
                      <FontAwesomeIcon icon={faPenToSquare} className="h-[16px] cursor-pointer"></FontAwesomeIcon>
                        </button>
                      <button className="flex space-x-1 border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl">
                      <FontAwesomeIcon icon={faTrashCan} className="h-[16px] relative top-0 cursor-pointer"></FontAwesomeIcon>
                        </button>
                  </div>
                  </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default News;
