import Router from 'next/router';
import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import ReportServices from '../../services/report';

type FormData = {
  description: string;
  topic: string;
};


const ReportForm = () => {
  const [isSuccess,setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    reset ,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data:FormData)=>{
    ReportServices.storeReport(data).then((res) => {
      console.log(res.data);
      successAlert();
    })
    .catch((err) => {
      console.log(err.response);
    });
    console.log(data)
  }
  const successAlert = () => {
  
    Swal.fire({  
        title: 'Thank you!',  
        text: 'you clicked the button for continue or back to home page',
        icon: 'success',
        showCancelButton:true,
        confirmButtonText: 'Back to News',
        cancelButtonText: `Report other problem`,
      }).then((result)=>{
        if(result.isConfirmed){
          Router.push('/news')
        }else if(result.isDismissed){
          resetData();
        }
      }); 
}

const resetData = () =>{
  reset({topic:"",description:""})
}
  return (
    <div className=' lg:pl-[220px] md:pt-[80px] lg:pt-[40px] lg:pr-[170px] w-full min-h-screen '>
      {!isSuccess&& <form onSubmit={handleSubmit(onSubmit)} className="space-y-[30px]">
        <div className='bg-white rounded-lg h-screen md:h-[70vh] px-[30px] pt-[60px] md:pt-[30px] md:mt-[80px]'>
          <div className='flex justify-center font-bold tracking-wider text-[24px] mb-[20px] pb-[10px]'><h1>Report Problem</h1></div>
        <div className='pb-[20px]'>
            <label className="text-body font-bold tracking-wider">
                  Topic
                </label>
                <input
                  className="text-body mt-[10px] shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Your topic ..."
                  {...register("topic", { required: "Topic is Required" })}
                />
                {errors.topic && (<small className='text-red-500'>{errors.topic.message}</small>)}
                </div>
                <div className='pb-[20px]'>
             <label className="text-body font-bold tracking-wider">
                description
              </label>
              <textarea
                className="text-body mt-[10px]  shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                rows={4}
                placeholder="Type your description here..."
                {...register("description", { required: "description is Required" })}
              />
              {errors.description && (<small className='text-red-500'>{errors.description.message}</small>)}
              </div>
                <button type="submit" className="w-full  shadow rounded py-3 px-3 bg-purple text-white tracking-wider uppercase font-semibold">
              Send
            </button>
            </div>
            </form>}
    </div>
  )
}

export default ReportForm
