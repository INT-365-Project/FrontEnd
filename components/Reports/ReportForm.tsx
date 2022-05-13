import Router from 'next/router';
import React from 'react'
import { useForm } from "react-hook-form";
type FormData = {
  message: string;
  suggestMessage: string;
};
const ReportForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data:FormData)=>{
    console.log(data)
    // Router.push('/dashboard')
  }
  return (
    <div className=' lg:pl-[130px] md:pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full min-h-screen '>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[30px]">
        <div className='bg-white rounded-lg h-screen md:h-[60vh] px-[30px] pt-[140px] md:pt-[30px] md:mt-[80px]'>
          <div className='flex justify-center font-bold tracking-wider text-[24px] mb-[20px] pb-[10px]'><h1>New Report Message</h1></div>
        <div className='pb-[20px]'>
            <label className="text-body font-bold tracking-wider">
                  SUGGEST
                </label>
                <input
                  className="text-body mt-[10px] shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Your Suggestion ..."
                  {...register("suggestMessage", { required: true })}
                />
                </div>
                <div className='pb-[20px]'>
             <label className="text-body font-bold tracking-wider">
                MESSAGE
              </label>
              <textarea
                className="text-body mt-[10px]  shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                rows={4}
                placeholder="Type your message here..."
                {...register("message", { required: true })}
              />
              </div>
               
                <button type="submit" className="w-full  shadow rounded py-3 px-3 bg-purple text-white tracking-wider uppercase font-semibold">
              SEND
            </button>
            </div>
            </form>
    </div>
  )
}

export default ReportForm
