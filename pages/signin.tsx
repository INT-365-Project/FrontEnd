import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import LogIn from '../components/Authentication/LogIn'
import { useAppContext } from './_app';

const SignIn = () => {
  const router = useRouter();
  const { setIsLogin,isLogin,adminUser } = useAppContext();
  useEffect(()=>{
    if(router.pathname=='/signin'){
      if(!adminUser){
        Router.push('/signin')
      }else{
        Router.push('/')
      } 
    }
  },[])
  const handleLogOff = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setIsLogin(false);
    window.location.href = "/";
  };

  if(typeof window !== null){
    console.log(adminUser)
  }
  return (<>
    {!adminUser?<LogIn/>:<div className='lg:pl-[120px]  h-screen w-full flex flex-col justify-center items-center'><span className='text-[40px]'>You were already login </span>
      <div className='flex justify-between space-x-[20px] pt-[14px] font-semibold'>
          <button onClick={()=>router.push("/")} className='bg-purple hover:bg-fuchsia-700 p-2 rounded text-white hover:text-white '>Go Dashboard</button>
          <button onClick={()=>handleLogOff()} className='bg-red-500 hover:bg-red-700  p-2 rounded text-black hover:text-white '>Log Off</button>
      </div>
    </div>}
  </>
  
  )
}

export default SignIn