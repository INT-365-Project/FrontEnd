import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Slider from "react-slick";
import NewsServices from '../../services/news';
import ReportServices from '../../services/report';



const Reports = () => {
  const [logs, setLogs] = useState([]);
  const [news,setNews] = useState([]);
  const ReportTypes = [
    {title:"ข่าว" , icon:"inew.svg" , url:"/news" , count: news ? news.length : 0},
    {title:"ข้อความ" , icon:"imsg.svg",url:"/chat",count:0},
    {title:"ปัญหา" , icon:"ireport.svg",url:"/report",count:logs?logs.length:0},
  ]
  useEffect(() => {
    ReportServices.getReport()
      .then((res) => {
        setLogs(res.data.responseData);
      })
      .catch((err) => {
        console.log(err.response);
      });
      NewsServices.getNews()
      .then((res) => {
        setNews(res.data.responseData);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };
  return (
    <div className='w-full mt-[30px] lg:mt-0'>
    {/* <div className='text-purple subtitle '>Reports & Comments</div> */}
    <div className="rounded-xl drop-shadow-lg mt-[10px] mx-auto  overflow-hidden  py-[14px] relative">
    <Slider {...settings}>    
    {ReportTypes && ReportTypes.map((r,index)=>{
      return <div key={index} className='mx-auto h-[180px] w-[94%] bg-white rounded-xl drop-shadow-lg relative'>    
      <div className='w-full flex flex-col md:flex-none h-[140px] '>
        <div className='w-[62px] h-[62px] my-auto mx-auto  flex justify-center items-center bg-[#336699] rounded-full'>
        <img src={`/images/${r.icon}`} alt="" 
        style={{
          filter:
            "invert(100%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
        }}/>
        </div>
        <div className=' text-center'>
        <p className=' text-[20px] text-black font-semibold'>{r.title}</p>
        <p className='text-[#919191]  '>{r.count} รายการ</p>
        </div>
        </div> 
        <div className='relative bottom-0 w-full h-[40px] bg-[#FAFAFC] rounded-[5px] text-[#336699] px-[30px]'>
          <Link  href={{
                  pathname: `${r.url}`,
                }} passHref>
                  <h1 className='pt-[10px] cursor-pointer'>ดูทั้งหมด</h1></Link>
        </div>
      </div>
    })}
    
    </Slider>
      </div>  
    
    </div>  
  )
}

export default Reports