import Head from "next/head";
import React from "react";
import { useForm } from "react-hook-form";
type FormData = {
  comments: string;
};
const data = {
  id: 1,
  cover:
    "https://static.thairath.co.th/media/Dtbezn3nNUxytg04abimjqxZ8XkWCVrbGC2grXxRzlGwpg.jpg",
  title: "Seminar Red-hat company",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",
  publish_at: "12-12-2021",
};

const Detail = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <div className="min-h-screen  px-[10px] lg:px-0 lg:pl-[130px] pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full">
      <Head>
        <title>News-Detail</title>
        <meta name="Detail" content="Detail" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen relative w-full">
        <div className="w-full ">
          <div className="mb-[20px]">
            <h1 className="title">News-Detail</h1>
            <h2 className="breadcrumb">
              <a>Home</a> | News-Detail
            </h2>
          </div>
          <div className="bg-white min-h-[400px] rounded-lg drop-shadow-md">
            <div className="h-[400px] w-full">
              <img
                src={data.cover}
                className="h-full w-full object-cover rounded-lg"
                alt=""
              />
            </div>
            <div className="h-[50%] w-full px-[20px] pt-[40px] text-[13px] lg:text-[16px]">
              <div className="pt-[20px] text-purple">{data.title}</div>
              <div className="pt-[20px] pb-[60px]">{data.description}</div>
            </div>
          </div>

          <div className="mt-[40px] w-full">
            <div className="text-purple mb-[20px]">Comments</div>
            <div className="bg-white h-[230px] rounded-lg relative overflow-y-auto drop-shadow-md text-[13px] lg:text-[16px]">
              <div className="px-[20px] pt-[20px]">
                <div className="pb-[20px]">
                  <div className="pb-[10px]">Nice Job!</div>
                  <div className="border-[1.5px]  border-transparent border-b-warmGray-300"></div>
                </div>
                <div className="pb-[20px]">
                  <div className="pb-[10px]">Nice Job!</div>
                  <div className="border-[1.5px]  border-transparent border-b-warmGray-300"></div>
                </div>
                <div className="pb-[20px]">
                  <div className="pb-[10px]">Nice Job!</div>
                  <div className="border-[1.5px]  border-transparent border-b-warmGray-300"></div>
                </div>
                <div className="pb-[20px]">
                  <div className="pb-[10px]">Nice Job!</div>
                  {/* <div className="border-[1.5px]  border-transparent border-b-warmGray-300"></div> */}
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
