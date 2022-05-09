import React from 'react'
import Slider from "react-slick";

const ReportTypes = [
  {title:"Late Answer"},
  {title:"Unknown News"},
  {title:"Technical Problems"},
  {title:"Comunitcate Problems"},
  {title:"Technical Problems"},
  {title:"Technical Problems"},
]

const Reports = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1
  };
  return (
    <div className='w-[95%] mt-[30px] lg:mt-0'>
    <div className='text-purple subtitle '>Reports & Comments</div>
    <div className="rounded-xl drop-shadow-lg mt-[10px] mx-auto  overflow-hidden ">
    <Slider {...settings}>    
    {ReportTypes.map((r,index)=>{
      return <div key={index} className='h-[200px] w-[91%] bg-white rounded-xl drop-shadow-lg flex flex-col'>
        <p className='text-black text-[14px] px-[40px] text-center h-[70%] pt-[45px]'>{r.title}</p>
        <p className='text-purple text-center h-[30%]'>20</p>
      </div>
          
    })}
    
    </Slider>
      </div>  
   
    
    </div>  
  )
}

export default Reports