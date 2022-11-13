import React, { useContext, useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { useAppContext } from "../../../pages/_app";
import { useRouter } from "next/router";

const Content = ({ isOpen, setIsOpen }) => {
  const { adminUser, isLogin, setIsLogin } = useAppContext();
  const [openDes, setOpenDes] = useState(false);
  const [openLogout,setOpenLogout] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const menu = isLogin
    ? [
        {
          label: "Dashboard",
          href: "/",
          icon: "home.svg",
          des: "แดชบอร์ด",
        },
        {
          label: "News",
          href: "/news",
          icon: "news.svg",
          des: "ข่าว",
        },
        {
          label: "Chat",
          href: "/chat",
          icon: "chat.svg",
          des: "สอบถาม",
        },
        {
          label: "Intents",
          href: "/intents",
          icon: "intent.svg",
          des: "ตั้งค่าบอท",
        },
        {
          label: "Report",
          href: "/report",
          icon: "report.svg",
          des: "แจ้งปัญหา",
        },
      ]
    : [
        {
          label: "News",
          href: "/news",
          icon: "news.svg",
          des: "ข่าว",
        },
        {
          label: "Chat",
          href: "/chat",
          icon: "chat.svg",
          des: "ติดต่อ",
        },
        {
          label: "Report",
          href: "/report",
          icon: "report.svg",
          des: "แจ้งปัญหา",
        },
      ];

  const handleLogOff = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLogin(false);
    window.location.href = "/";
  };
  return (
    <>
      <div id="navbar">
        <div
          onClick={() => router.push("/")}
          className="text-center flex justify-center bg-[#336699] w-[72px] items-center "
        >
          <img src="/images/logo.png" alt="" />
        </div>
        <div className="flex md:hidden ">
        {menu.map((m, index) => {
            return (
              <Link key={index} href={m.href} passHref>
                <div
                  className={
                    router.pathname == m.href
                      ? "flex justify-center cursor-pointer items-center h-[50px] w-[50px] bg-[#336699] relative  rounded-full mx-auto my-auto"
                      : "flex justify-center cursor-pointer items-center h-[50px] w-[50px] relative  rounded-full mx-auto my-auto"
                  }
                  onMouseEnter={() => {
                    // setOpenDes(true);
                    setCount(index);
                  }}
                  onMouseLeave={() => {
                    setOpenDes(false);
                    setCount(0);
                  }}
                >
                  {router.pathname == m.href ? (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  ) : (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  )}
                </div>
              </Link>
            );
          })}
          </div>
      </div>
      <div
        id={`${isOpen ? "sidebar" : "sidebarMobile"}`}
        className={`${!isOpen ? "block" : "hidden"}'`}
      >
        <div className="text-center flex flex-col justify-center w-[50%] mx-auto mt-[70px] py-[10px] "></div>
        <div className="w-[80%] mx-auto mt-[40px] text-black text-[16px] font-normal space-y-[40px] ">
          {menu.map((m, index) => {
            if(m.href == '/'){
              return  (  
              <Link key={index} href={m.href} passHref>
                <div
                  className={
                    router.pathname == m.href
                      ? "flex justify-center cursor-pointer items-center h-[56px] bg-[#336699] relative  rounded-full "
                      : "flex justify-center cursor-pointer items-center h-[56px] relative  rounded-full "
                  }
                  onMouseEnter={() => {
                    setOpenDes(true);
                    setCount(index);
                  }}
                  onMouseLeave={() => {
                    setOpenDes(false);
                    setCount(0);
                  }}
                >
                  {router.pathname == m.href ? (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  ) : (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  )}
                  {openDes && count == index && (
                    <div className="absolute truncate w-[80px] rounded-[6px]  bg-white py-[8px] left-[80px] text-center">
                      <img
                        src="/images/poly.png"
                        className="absolute left-[-10px] top-2 z-20"
                        alt=""
                      />
                      {m.des}
                    </div>
                  )}
                </div>
              </Link>)
            }else {return (
              <Link key={index} href={m.href} passHref>
                <div
                  className={
                    router.pathname == m.href
                      ? "flex justify-center cursor-pointer items-center h-[56px] bg-[#336699] relative  rounded-full "
                      : "flex justify-center cursor-pointer items-center h-[56px] relative  rounded-full "
                  }
                  onMouseEnter={() => {
                    setOpenDes(true);
                    setCount(index);
                  }}
                  onMouseLeave={() => {
                    setOpenDes(false);
                    setCount(0);
                  }}
                >
                  {router.pathname == m.href ? (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  ) : (
                    <img
                      src={`/images/${m.icon}`}
                      className="iconic"
                      alt={m.icon}
                      style={{
                        filter:
                          "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}
                    />
                  )}
                  {openDes && count == index && (
                    <div className="absolute truncate w-[80px] rounded-[6px]  bg-white py-[8px] left-[80px] text-center">
                      <img
                        src="/images/poly.png"
                        className="absolute left-[-10px] top-2 z-20"
                        alt=""
                      />
                      {m.des}
                    </div>
                  )}
                </div>
              </Link>
            )};
          })}
            <div
                 onMouseEnter={() => {
                  setOpenLogout(true)
                }}
                onMouseLeave={() => {
                  setOpenLogout(false)
                }}
                className="flex px-[20px] cursor-pointer items-center h-[56px] lg:border-t-[2px] "
              >
                <img
            src="/images/default.png"
            alt="mock-user"
            className=" w-[60px]"
          />
          {openLogout&&<div className="truncate rounded-[10px] py-[12px] left-[60px] absolute w-[140px] bg-white drop-shadow-md flex " onClick={() => handleLogOff()}>
                <img src="/images/logout.svg" className="pl-[8px] pr-[8px]" alt="" style={{
                        filter:
                          "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                      }}/>
                ออกจากระบบ
          </div>}
              </div>
        </div>
      </div>
    </>
  );
};

export default Content;
