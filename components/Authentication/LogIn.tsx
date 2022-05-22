import Router from 'next/router';
import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { api } from '../../config';
// import LoginServices from '../../services/login';
const LogIn = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(credentials:any) {
    return fetch(`${api}/authenticate`, {
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
    <div className='w-full h-screen   lg:px-[120px] pb-[100px] drop-shadow-lg '>
      <div className='flex w-full h-screen md:h-[90vh] rounded-2xl md:pt-[80px]'>
      <div className='hidden md:block w-full h-full bg-purple rounded-l-lg'>
        <h1 className='text-white text-[36px] font-bold pl-[40px] pt-[40px]'>
           SIT-CHATBOT
        </h1>
        <h1 className='text-[48px] font-bold text-white pt-[80px] pl-[40px]'>
          Welcome to...
        </h1>
        <p className='pl-[40px] text-white pt-[10px]'>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam.
        </p>
        <p className='pl-[40px] pt-[200px] text-white'>
        Lorem ipsum dolor sit amet.
        </p>
      </div>
      <div className='w-full h-full pt-[70px] md:pt-0 bg-white rounded-r-lg tracking-wider'>
      <form onSubmit={handleSubmit}>
        <div className='lg:px-[80px] px-[20px] py-[40px]'>
        <h1 className='text-purple text-[40px] font-semibold'>Login (for admin) </h1>
        <p className='text-warmGray-500 '>
          Welcome to login to get SIT CHAT-BOT
        </p>
        <div className='pb-[20px] pt-[20px]'>
          <label className='text-warmGray-500 '>User Name</label>
          <input
                  className="text-body mt-[6px] shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  onChange={e => setUserName(e.target.value)}
                />
        </div>
        <div className='pb-[20px]'>
          <label className='text-warmGray-500 '>Password</label>
          <input
                  className="text-body shadow mt-[6px] appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
                />
        </div>
         <button type="submit" className="w-full mt-[18px] shadow rounded py-3 px-3 bg-purple text-white tracking-wider uppercase font-semibold">
              Login
            </button>
            {/* <div className='flex justify-between w-full text-[14px] mt-[60px]'>
            <div className='text-warmGray-500'>New Users? <span className='text-purple'>Sign up</span></div>
            <div>
              forget your password ?
            </div>
        </div> */}
        </div>
        </form>
       
      </div>
      </div>
    </div>
  )
}

export default LogIn