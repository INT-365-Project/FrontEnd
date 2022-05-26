import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import NewsServices from "../../services/news";
import { useAppContext } from "../_app";
interface NewsDatas{
  title:string;
  detail:string;
  createBy:string;
  updateDate:string;
  thumbnailPath:string;
}
type FormData = {
  comments: string;
};

const Detail = () => {
  const { adminUser } = useAppContext();
  const router = useRouter();
  const {query} = router;
  const [newsData,setNewsData] = useState<NewsDatas>(null);
  const [pageId,setPageId] = useState(null);
  const [imgSrc,setImgSrc] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  if(query.slug!=undefined){
    localStorage.setItem('pId',query.slug.toString())
  }
  useEffect(()=>{
    const pId = JSON.parse(localStorage.getItem("pId"))
    if(pId){
      setPageId(pId)
    }
  },[])
  useEffect(()=>{
    if(pageId){
    NewsServices.getNewsById(pageId).then((res) => {
       setNewsData(res.data.responseData)
    })
    .catch((err) => {
      console.log(err.response);
    })};
  },[pageId])

  
  if(newsData){
    NewsServices.sendPathImage({ filePath: newsData.thumbnailPath })
  .then((res) => {
    var byteCharacters = atob(res.data.responseData.base64);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var file = new Blob([byteArray], { type: "image/png;base64" });
    var fileURL = URL.createObjectURL(file);
    setImgSrc(fileURL);
  })
  .catch((err) => {
    console.log(err.response);
  });
  }

  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div className={`min-h-screen  px-[10px] lg:px-0 ${adminUser ? 'lg:pl-[130px] pt-[80px]' : 'lg:pl-[80px] pt-[30px]'} lg:pt-[40px] lg:pr-[50px] w-full`}>
      <Head>
        <title>News-Detail</title>
        <meta name="Detail" content="Detail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen relative w-full">
        <div className="w-full ">
          <div className="flex justify-between items-center">
          <div className="mb-[20px]">
            <h1 className="title">News-Detail</h1>
            <h2 className="breadcrumb">
              <a>Home</a> | News-Detail
            </h2>
          </div>
          <div>
            <Link href="/news" passHref>
            <button className="transition-all duration-300 p-2 border-[1.6px] border-purple  hover:bg-purple rounded hover:text-white text-purple text-[18px] ">Back</button>
            </Link>
          </div>
          </div>
          <div className="bg-white min-h-[400px] rounded-lg drop-shadow-md">
            <div className="h-[500px] w-full">
              <img
                src={imgSrc}
                className="h-full w-full object-cover rounded-lg"
                alt=""
              />
            </div>
            <div className="h-[50%] w-full px-[20px] pt-[40px] text-[13px] lg:text-[16px]">
              <div className="pt-[20px] text-purple">{newsData && newsData.title}</div>
              <div className="pt-[20px] pb-[50px]">{newsData && newsData.detail}</div>
              <div className="pt-[10px] text-warmGray-600">update date {newsData && newsData.updateDate.slice(0, 10)}</div>
              <div className="pt-[10px] pb-[30px] text-warmGray-500 text-[12px] lg:text-[13px] text-right">create by {newsData && newsData.createBy}</div>
            </div>
          </div>

          <div className="mt-[40px] w-full">
            <div className="text-purple mb-[20px]">Comments</div>
            <div className="bg-white h-[230px] rounded-lg relative overflow-y-auto drop-shadow-md text-[13px] lg:text-[16px]">
              <div className="px-[20px] pt-[20px]">
                <div className="pb-[20px]">
                 
                </div>
              </div>
            </div>
            <div className="h-[15%] mt-[20px]  bg-white rounded-lg drop-shadow-md flex items-center text-[13px] lg:text-[16px]">
              <input
                className="text-[14px] pl-[30px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                {...register("comments", { required: true })}
              />
              <button className="w-[8%] mx-auto h-[30px] text-white bg-purple rounded-lg  ">
                Send
              </button>
            </div>
            <div className="mt-[20px] ">
              <h1 className="text-purple mb-[20px]">Tags</h1>
              <div className="min-h-[80px] bg-white rounded-lg drop-shadow-md flex items-center px-[20px] space-x-4">
                <button className="h-[22px] px-6  flex justify-center items-center  rounded-3xl hover:bg-purple border-2 border-purple hover:text-white text-purple">
                  ป.ตรี
                </button>
                <button className="h-[22px] px-6  flex justify-center items-center  rounded-3xl hover:bg-purple border-2 border-purple hover:text-white text-purple">
                  ป.เอก
                </button>
                <button className="h-[22px] px-6  flex justify-center items-center  rounded-3xl hover:bg-purple border-2 border-purple hover:text-white text-purple">
                  ป.โท
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
