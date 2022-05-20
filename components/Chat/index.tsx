import Head from 'next/head'
import React, { useState } from 'react'
import { useForm } from "react-hook-form";

const mockUsers = [
  {
  uid:'1',
  user:"Blaine Cottrell",
  },
  {
    uid:'2',
    user:"Zlaine Cottrell",
  },
  {
    uid:'3',
    user:"Dlaine Cottrell",
  },
  {
    uid:'4',
    user:"Rlaine Cottrell",
  },
  {
    uid:'5',
    user:"Olaine Cottrell",
  },
  {
    uid:'6',
    user:"Olaine Cottrell",
  },
  {
    uid:'7',
    user:"Olaine Cottrell",
  }

]

type FormData = {
  message: string;
};
const Chat = () => {
  const [isOpen,setIsOpen] = useState(false)
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
    <main className='lg:min-h-screen relative w-full'>
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
      <div className='mt-[15px] block lg:hidden w-full mx-auto h-[30px]'>
        <button onClick={()=>{setIsOpen(false)}} className={`${isOpen ? 'bg-purple text-white' :  'text-purple border-purple' } border-[1.6px]  p-2 rounded-xl  w-[92%]`}>Back</button>
        
      </div>
      <div className=' min-h-[80vh] mt-[35px] flex flex-col lg:flex-row'>
          <div className='lg:w-[30%] lg:h-auto'>
           <div className='w-[93%] lg:h-full bg-white rounded-3xl drop-shadow-md'>
                      <div className='flex justify-center px-[30px] pb-[20px] h-[80px]'>
                        <button onClick={()=>setButtonClick(true)} className={`${'border-t-4 text-purple'  } border-purple w-full `}>Message</button>
                       {/* <button onClick={()=>setButtonClick(false)} className={`${!buttonClick ? 'border-t-4 text-purple' : '' }  border-purple  w-[50%] `}>Contact</button> */}
                       </div>
                       <div className=' hidden pt-[30px] space-y-[32px] lg:flex flex-col overflow-y-scroll h-[500px]'>
                            {mockUsers.map(u=>{
                              return <button key={u.uid} className="p-[10px] w-[50%] mx-auto">{u.user}</button>
                            })}
                       </div>
                       {!isOpen ? <div className='lg:hidden pt-[30px] space-y-[32px] flex flex-col overflow-y-scroll h-[500px]'>
                            {mockUsers.map(u=>{
                              return <button key={u.uid} className="p-[10px] w-[50%] mx-auto" onClick={()=>{setIsOpen(true)}}>{u.user}</button>
                            })}
                       </div>:
                       <div className='pt-[30px] lg:hidden space-y-[32px] flex flex-col overflow-y-scroll h-[500px] pl-[30px] pb-[20px]'>
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
                       }
            </div>
               <div className='h-[15%] w-[93%]  lg:hidden bg-white  drop-shadow-md flex items-center mt-[20px]'>
                       <input
                         className="text-[14px] pl-[30px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                         type="text"
                         {...register("message", { required: true })}
                       />
                       <button className='w-[10%] mx-auto h-[30px] mr-[10px] text-white bg-purple rounded-lg  '>
                           Send
                       </button>
                        </div>
          </div>
          <div className='hidden lg:w-[70%] lg:block '>
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