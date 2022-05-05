import React, { useCallback, useEffect } from 'react'
import { useRouter } from "next/router";
import { useState } from "react"; 
import Link from "next/link";
import Image from "next/image";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCoffee, faMagnifyingGlass , faLockOpen,faLock ,faLightbulb , faAddressBook} from '@fortawesome/free-solid-svg-icons'

const menu = [
  {
    label: "dashboard",
    href: "/dashboard",
  },
  {
    label: "feature1",
    href: "/feature1",
  },
  {
    label: "feature2",
    href: "/feature2",
  },
];
const content = () => {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [style, setStyle] = useState({display: 'none'});
  const [image,setImage] = useState({width:'100%'})
  const [isFadeIn,setIsFadeIn] = useState(false);
  const [isFadeOut,setIsFadeOut] = useState(false);
  const [isTop, setIsTop] = useState<boolean>(true);

  useEffect(() => {
    let listener = () => {
      let scrolled = document?.scrollingElement?.scrollTop;
      if (scrolled && scrolled >= 100) {
        setIsTop(false);
        console.log(scrolled)
      } else {
        setIsTop(true);
      }
    };
    window.addEventListener("scroll", listener);
    listener();
    return () => {
      document.removeEventListener("scroll", listener);
    };
    
  }, []);

  return (
    <>
      {isOpen&&<div id="navbar" onClick={()=>{setIsOpen(false)}}>
      <div className='text-center flex justify-center px-[20px] items-center '>
            <FontAwesomeIcon icon={faCoffee} className="text-[#fff] h-[30px]"></FontAwesomeIcon>
            <h1 className="pl-[10px] text-[#fff] text-[20px] font-semibold cursor-pointer">
              SIT-ChatBot
            </h1>
          </div>
      </div>}
        <div className={`${!isOpen ? 'block' : 'hidden'}  lg:block transition-all duration-500 fixed z-10 left-0 min-h-screen overflow-hidden w-[80px] hover:w-[280px] bg-[#c609e7] rounded-r-2xl '`} 
        onMouseEnter={e => {
          setStyle({display: 'block'});
          setIsFadeIn(true);
          setImage({width:'40%'}) 
        }}
      onMouseLeave={e => {
          setStyle({display: 'none'});
          setImage({width:'100%'})
         }}> 
          <div className='text-center flex justify-center pt-[30px] items-center '>
            <FontAwesomeIcon icon={faCoffee} className="text-[#fff] h-[30px]"></FontAwesomeIcon>
            <h1 style={style} className="pl-[10px] text-[#fff] text-[20px] font-semibold cursor-pointer">
              SIT-ChatBot
            </h1>
          </div>
          <div className='text-center flex flex-col justify-center w-[40%] mx-auto mt-[30px] py-[10px] hover:bg-[#ee96fe] rounded-xl cursor-pointer'>
              <img src="/images/mock-user.jpg" alt="mock-user" className=' mx-auto rounded-full' style={image} />
              <p className='text-[14px] font-medium text-[#fff]' style={style}>Lisa Jackson</p>
            </div>
            <div className='flex space-x-4 justify-center items-center mt-[10px] py-[10px]  h-[60px]'>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[#fff] h-[16px] cursor-pointer" style={style}></FontAwesomeIcon>
              <FontAwesomeIcon icon={ faLockOpen} className="text-[#fff] h-[16px] cursor-pointer" style={style}></FontAwesomeIcon>
              <FontAwesomeIcon icon={ faLightbulb} className="text-[#fff] h-[16px] cursor-pointer" style={style}></FontAwesomeIcon>
              {/* <FontAwesomeIcon icon={ faLock} className="text-[#fff] h-[16px]"></FontAwesomeIcon> */}
            </div>
            <div className='w-[80%] mx-auto mt-[40px] text-[#fff] font-medium space-y-4 '>
              <div className='flex px-[20px] items-center rounded-lg h-[50px] relative hover:bg-[#ee96fe]'>
              <FontAwesomeIcon icon={ faAddressBook} className="text-[#fff] h-[16px]"></FontAwesomeIcon>
               <h1 className='text-[14px] pl-[20px]' style={style}>
                 Dashboards
               </h1>
               <span className='rotate-90 absolute right-4 text-[12px]' style={style}>^</span>
              </div>
              <div className='flex px-[20px] items-center rounded-lg h-[50px] relative hover:bg-[#ee96fe]'>
              <FontAwesomeIcon icon={ faAddressBook} className="text-[#fff] h-[16px] "></FontAwesomeIcon>
               <h1 className='text-[14px] pl-[20px]' style={style}>
                 Reports
               </h1>
               <span className='rotate-90 absolute right-4 text-[12px]' style={style}>^</span>
              </div>
              <div className='flex px-[20px] items-center rounded-lg h-[50px] relative hover:bg-[#ee96fe]'>
              <FontAwesomeIcon icon={ faAddressBook} className="text-[#fff] h-[16px]"></FontAwesomeIcon>
               <h1 className='text-[14px] pl-[20px]' style={style}>
                 Posts
               </h1>
               <span className='rotate-90 absolute right-4 text-[12px]' style={style}>^</span>
              </div>
            </div>
        </div>
    </>
  )
}

export default content