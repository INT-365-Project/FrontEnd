import Image from 'next/image';
import Router from 'next/router';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { api } from '../../config';
// import LoginServices from '../../services/login';
const LogIn = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(credentials:any) {
    return fetch(`${api}/api/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
      .then(data => data.json())
   }
   const handleSubmit = async (e:any) => {
    e.preventDefault();
    const response = await loginUser({
      username,
      password
    });
    console.log(response)
    if ('token' in response) {
      Swal.fire({  
        title: 'Thank you!',  
        text: 'you clicked the button ',
        icon: 'success',
      })
      .then((value) => {
        localStorage.setItem('accessToken', response['token']);
        localStorage.setItem('user', JSON.stringify(response['userModelDetail']));
        Router.push("/")
      });
    } else {
      Swal.fire("Failed", response.error, "error");
    }
  }
  return (
    <div className='w-full h-screen lg:px-[120px] pb-[100px] drop-shadow-lg '>
      <div className='flex w-full h-screen mx-auto rounded-2xl md:py-[120px]'>
      <div className='hidden md:flex flex-col justify-center items-center  w-full h-full bg-white rounded-l-[30px] relative'>
          <img src="/images/login.png" className='w-[90%] my-auto ' alt="login" />
      </div>
      <div className='w-full h-full  md:pt-0 bg-white md:rounded-r-[30px] tracking-wider'>
      <form onSubmit={handleSubmit} className=" h-full px-[10px] lg:px-[80px] mx-auto my-auto">
        <div className='md:px-[10px]  flex flex-col justify-center items-center  h-full'>
        <h1 className='text-black text-[44px] lg:text-[52px] w-full font-bold'>SIT CHATBOT </h1>
        <div className='pb-[20px] pt-[20px] w-full relative'>
          <label className='text-black '>ชื่อผู้ใช้</label>
            <img src="/images/user.svg" className='icon1' alt="user" />
          <input
                  className="text-body mt-[6px] pl-[60px] shadow appearance-none border border-[#919191] rounded-[10px] w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder='ชื่อผู้ใข้'
                  onChange={e => setUserName(e.target.value)}
                />
        </div>
        <div className='pb-[20px] w-full relative'>
          <label className='text-black '>รหัสผ่าน</label>
          <img src="/images/pass.svg" className='icon2' alt="pass" />
          <input
                  className="text-body shadow mt-[6px] pl-[60px] appearance-none border border-[#919191] rounded-[10px] w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  placeholder='รหัสผ่าน'
                  onChange={e => setPassword(e.target.value)}
                />
        </div>
         <button type="submit" className="w-full mt-[4px] shadow rounded-[10px] py-3 px-3 bg-[#336699] text-[16px] text-white tracking-wider uppercase ">
              เข้าสู่ระบบ
            </button>
        </div>
        </form>
       
      </div>
      </div>
    </div>
  )
}

export default LogIn