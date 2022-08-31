import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import CreateEdit from "../../components/InsiderNews/CreateEdit";
import NewsServices from "../../services/news";
import { useAppContext } from "../_app";
interface NewsDatas {
  newId: number;
  title: string;
  detail: string;
  createBy: string;
  updateDate: string;
  thumbnailPath: string;
  thumbnailFileName: string;
}
type FormData = {
  comments: string;
};

const Detail = () => {
  const { adminUser } = useAppContext();
  const router = useRouter();
  const { query } = router;
  const [newsData, setNewsData] = useState<NewsDatas>(null);
  const [pageId, setPageId] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const removeNews = (id: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        NewsServices.removeNewsById(id)
          .then((res) => {
            setNewsData(res.data.responseData);
          })
          .catch((err) => {
            console.log(err.response);
          });
        Swal.fire("Deleted!", "Your news has been deleted.", "success");
        window.location.href = "/news";
      }
    });
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  if (query.slug != undefined) {
    localStorage.setItem("pId", query.slug.toString());
  }
  useEffect(() => {
    const pId = JSON.parse(localStorage.getItem("pId"));
    if (pId) {
      setPageId(pId);
    }
  }, []);
  useEffect(() => {
    if (pageId) {
      NewsServices.getNewsById(pageId)
        .then((res) => {
          setNewsData(res.data.responseData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [pageId]);

  if (newsData) {
    NewsServices.sendPathImage({ filePath: newsData.thumbnailPath })
      .then((res) => {
        var byteCharacters = atob(res.data.responseData.base64);
        var byteNumbers = new Array(byteCharacters.length);
        for (var i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var file = new Blob([byteArray], {
          type: `image/${newsData.thumbnailFileName.slice(
            newsData.thumbnailFileName.length - 3,
            newsData.thumbnailFileName.length
          )};base64`,
        });
        var fileURL = URL.createObjectURL(file);
        setImgSrc(fileURL);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  const editNews = (item: any) => {
    setEditData(item);
    setIsOpen(true);
    setIsEdit(true);
  };
  const onSubmit = (data: FormData) => {
    console.log(data);
  };
  return (
    <>
      {isOpen ? (
        <CreateEdit
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          editData={newsData}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      ) : (
        <div
          className={`min-h-screen bg-[#F8F8F8] px-[10px] lg:px-0 ${
            adminUser ? "lg:pl-[130px] pt-[80px]" : "lg:pl-[80px] pt-[30px]"
          } lg:pt-[90px] lg:pr-[50px] w-full`}
        >
          <Head>
            <title>News-Detail</title>
            <meta name="Detail" content="Detail" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main className="min-h-screen relative w-full">
            {/* AdminLayoutDetail */}
            <div className="w-full ">
              <div className="flex space-x-[15px]">
                <Link href="/news" passHref>
                  <h1 className="text-[#919191] cursor-pointer hover:text-[#919191]/60">
                    ข่าวทั้งหมด
                  </h1>
                </Link>
                <p className="text-[#919191] cursor-default">{">"}</p>
                <h1 className="text-[#336699] cursor-default">
                  รายละเอียดข่าว
                </h1>
              </div>
              <div
                className={`${
                  adminUser ? "flex" : "hidden sm:flex "
                }' flex justify-between items-center bg-white mb-[20px] rounded-[5px] px-[20px] pt-[10px] mt-[10px]`}
              >
                <div className="mb-[20px] ">
                  <h1 className="text-[24px] font-bold pt-[10px]">
                    รายละเอียดข่าว
                  </h1>
                </div>
                {adminUser && (
                  <div className="flex space-x-[20px]">
                    {/* <Link href="/news" passHref> */}
                    <button
                      onClick={() => removeNews(newsData.newId)}
                      className="transition-all duration-300 p-2 border-[1.6px] bg-white border-black  hover:bg-black rounded hover:text-white text-black text-[18px] "
                    >
                      ลบข่าว
                    </button>
                    {/* </Link> */}
                    {/* <Link href="/news" passHref> */}
                    <button
                      onClick={() => editNews(newsData)}
                      className="transition-all duration-300 p-2 border-[1.6px] bg-[#336699]  hover:border-black hover:bg-white rounded hover:text-black text-white text-[18px] "
                    >
                      แก้ไขข่าว
                    </button>
                    {/* </Link> */}
                  </div>
                )}
              </div>
              <div
                className={`${
                  adminUser ? "block" : "hidden sm:block "
                } bg-white w-full min-h-[350px] mt-[20px] rounded-[5px]`}
              >
                <div className="border-b-[1.4px] h-[40px] rounded-[5px] md:pl-[100px] pl-[30px] pt-[10px] text-[#919191]">
                  <h1>รูปภาพ</h1>
                </div>
                <div className=" md:w-[400px] min-h-[220px] mx-auto mt-[20px] flex flex-col justify-center items-center pb-[40px]">
                  <div className="flex justify-center flex-col items-center">
                    <div className="pt-[20px]">
                      {
                        <img
                          src={imgSrc}
                          alt="Thumb"
                          className="px-[10px] w-[100%] h-full"
                        />
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  adminUser ? "block" : "hidden sm:block "
                } bg-white w-full min-h-[380px] mt-[20px] rounded-[5px]`}
              >
                <div className="border-b-[1.4px] h-[40px] rounded-[5px] pl-[30px] md:pl-[100px] pt-[10px] text-[#919191]">
                  <h1>รายละเอียดข่าว</h1>
                  <div>
                    <div id="eiei"></div>
                    <div className="text-body pb-[20px] pt-[20px] flex">
                      <label className="text-[#919191]  w-[20%]  tracking-wider ">
                        หัวข้อข่าว
                      </label>
                      <h1 className="text-black  w-full pl-[40px] sm:pl-[200px]">
                        {newsData && newsData.title}
                      </h1>
                    </div>
                    <div className="pb-[20px] flex">
                      <label className="text-[#919191] w-[20%]  tracking-wider pt-[20px]">
                        รายละเอียด
                      </label>
                      <h1 className=" text-black ml-[20px] overflow-y-scroll h-[200px] sm:ml-[120px] pl-[20px] w-[60%] sm:w-[50%]  pt-[10px] sm:pr-[120px] border-[#919191] border-[1.6px] rounded-[10px]">
                        {newsData && newsData.detail}
                      </h1>
                    </div>
                    <div className="pb-[20px] flex items-center">
                      <label className="text-[#919191] w-[20%]  tracking-wider pt-[20px]">
                        วันที่ลงข่าว
                      </label>
                      <h1 className="text-black w-full pl-[20px] sm:pl-[200px] pt-[10px] ">
                        {newsData && newsData.updateDate.slice(0, 10)}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`${
                  adminUser ? "block" : "hidden sm:flex "
                } flex justify-center pt-[20px]`}
              >
                <Link href="/news" passHref>
                  <button className="transition-all duration-300 p-2 border-[1.6px] bg-[#336699] hover:border-[#336699] hover:bg-white rounded hover:text-black text-white text-[18px] ">
                    ย้อนกลับ
                  </button>
                </Link>
              </div>
            </div>
            {/* Mobile */}
            <div className={`${adminUser ? "hidden" : "block sm:hidden "}`}>
              <div className=" min-h-[246px] w-full lg:w-[31%] overflow-hidden shadow-lg rounded-[15px] mt-[14px] lg:mr-[18px] relative">
                <div className="overflow-hidden relative ">
                  <img src={imgSrc} className="w-full h-auto" alt="" />
                </div>
                <div className="px-6 py-4  rounded-t-[10px] relative z-20 ">
                  <div className="font-bold mb-2 text-[16px]">
                    {newsData && newsData.title}
                  </div>
                  <div className="flex items-center space-x-[10px]">
                    <img src="/images/date.png" alt="png" />
                    <p className="text-[#919191] text-[12px] text-base">
                      {newsData && newsData.updateDate.slice(0, 10)}
                    </p>
                  </div>
                  <p className="text-black text-[12px] text-base pt-[14px]">
                    {newsData && newsData.detail}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Detail;
