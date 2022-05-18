import Head from 'next/head'
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
type FormData = {
  message: string;
};
const Chat = () => {
  const [buttonClick,setButtonClick] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data:FormData)=>{
    console.log(data)
  }
  return (
    <div className='pl-[30px]  lg:pl-[130px] pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full'>
    <Head>
      <title>Chat</title>
      <meta name="Chat" content="Chat" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className='min-h-screen relative w-full'>
      <div className='w-full'>
      <div>
        <h1 className='title'>
          Chat
        </h1>
        <h2 className='breadcrumb'>
          <a>Home</a> | Chat
        </h2> 
        </div>
      </div> 
      <div className=' min-h-[80vh] mt-[20px] flex flex-col lg:flex-row'>
          <div className='w-[30%] '>
            <div className='w-[93%] h-full bg-white rounded-3xl drop-shadow-md'>
                      <div className='flex justify-between px-[30px] pb-[20px] h-[80px]'>
                        <button onClick={()=>setButtonClick(true)} className={`${buttonClick ? 'border-t-4 text-purple'  : '' } border-purple w-[50%] `}>Message</button>
                       <button onClick={()=>setButtonClick(false)} className={`${!buttonClick ? 'border-t-4 text-purple' : '' }  border-purple  w-[50%] `}>Contact</button>
                       </div>
                       <div className='pt-[30px] px-[30px] space-y-[20px] flex flex-col text-left justify-start'>
                           <button>Blaine Cottrell</button>
                           <button>Zlaine Cottrell</button>
                           <button>Dlaine Cottrell</button>
                           <button>Rlaine Cottrell</button>
                           <button>Olaine Cottrell</button>
                       </div>
            </div>
          </div>
          <div className='w-[70%] '>
            <div className=' h-[85%] '>
                <div className='h-[95%] bg-white rounded-3xl drop-shadow-md  px-[20px]'>
                      <div className='h-[15%] w-[90%] mx-auto border-b-[1.5px] px-[20px] flex items-center'>
                          Blaine Cottrell
                      </div>
                      <div className='overflow-y-scroll h-[400px]'>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                        <p>Blaine Cottrell</p>
                      </div>
                </div>
            </div>
            <div className='h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center'>
                <input
                  className="text-[14px] pl-[30px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  {...register("message", { required: true })}
                />
                <button className='w-[8%] mx-auto h-[30px] text-white bg-purple rounded-lg  '>
                    Send
                </button>
            </div>
          </div>
      </div>
    </main>
    </div>
  )
}

export default Chat