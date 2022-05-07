import React, {  useContext, useEffect } from 'react'
import { useState } from "react"; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faCoffee, faMagnifyingGlass , faLockOpen,faLock ,faLightbulb , faAddressBook , faAlignJustify} from '@fortawesome/free-solid-svg-icons'
import { useNavContext } from '../Layout';
const menu = [
  {
    label: "Dashboard",
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
  const {isOpen,setIsOpen} = useNavContext();
  const [style, setStyle] = useState({display: 'none'});
  const [image,setImage] = useState({width:'100%'})
  const [isTop, setIsTop] = useState<boolean>(true);
  console.log(isOpen)
  useEffect(()=>{
     if(isOpen===false){
      setStyle({display: 'block'});
      setImage({width:'40%'}) 
     }else{
      setStyle({display: 'none'});
      setImage({width:'100%'})
     }
  },[isOpen])
  useEffect(() => {
    let listener = () => {
      let scrolled = document?.scrollingElement?.scrollTop;
      if (scrolled && scrolled >= 100) {
        setIsTop(false);
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
      <div id={`${isOpen ? 'navbar' : 'navClick'}`}  onClick={()=>{setIsOpen(false)}}>
      <div className={`${isOpen ? 'block' : 'hidden'} text-center flex justify-center px-[20px] items-center `}>
            <FontAwesomeIcon icon={faCoffee} className="text-[#fff] h-[30px]"></FontAwesomeIcon>
            <h1 className={` pl-[10px] text-[#fff] text-[20px] font-semibold cursor-pointer`}>
              SIT-ChatBot
            </h1>
          </div>
          <div className={`${isOpen ? 'block' : 'hidden'} flex justify-center items-center`} onClick={()=>{setIsOpen(false)}}>
          <FontAwesomeIcon icon={ faAlignJustify} className="text-[#fff] h-[20px] pr-[20px] "></FontAwesomeIcon>
          </div>
      </div>
        <div id={`${isOpen ? 'sidebar' :'sidebarMobile'}`} className={`${!isOpen ? 'block' : 'hidden'}'`} 
        onMouseEnter={() => {
          setStyle({display: 'block'});
          setImage({width:'40%'}) 
        }}
      onMouseLeave={() => {
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
              {menu.map((m)=>{
                return <div className='flex px-[20px] items-center rounded-lg h-[50px] relative hover:bg-[#ee96fe]'>
                <FontAwesomeIcon icon={faAddressBook} className="text-[#fff] h-[16px]"></FontAwesomeIcon>
                 <h1 className='text-[14px] pl-[20px]' style={style}>
                   {m.label}
                 </h1>
                 <span className='rotate-90 absolute right-4 text-[12px]' style={style}>^</span>
                </div>
              })}
            </div>
        </div>
    </>
  )
}

export default content

