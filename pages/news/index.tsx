import Head from "next/head";
import React, { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import PopupForm from "../../components/News/PopupForm";
import Link from "next/link";
import Swal from "sweetalert2";
import NewsServices from "../../services/news";
import { useAppContext } from "../_app";
import axios from "axios";
import { api } from "../../config";
import Image from "next/image";

let getToken = null
if (typeof window !== 'undefined'){
  getToken = localStorage.getItem('accessToken') 
}
let token = 'Bearer '+ getToken
type data = {
  newId: number;
  filePath: string;
};

const News = () => {
  const { adminUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  let [newsData, setNewsData] = useState([]);
  const [isFinish, setIsFinish] = useState(false);
  const [isConvert, setIsConvert] = useState(false);
  const [useData, setUsedata] = useState([]);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      NewsServices.getNews()
        .then((res) => {
          setIsFinish(true);
          setNewsData(res.data.responseData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }, 500);
    return () => {
      clearTimeout(timer1);
      setIsConvert(false);
    };
  }, []);

  const getImage = async () => {
    for (let n of newsData) {
      const res = await axios.post(`${api}/viewFileByPath`,{filePath:n.thumbnailPath})
      var byteCharacters = atob(res.data.responseData.base64);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: "image/png;base64" });
      var fileURL = URL.createObjectURL(file);
      let p = {
        ...n,
        source: fileURL,
      };
      setUsedata((oldData) => [...oldData, p]);
      setIsConvert(true);
    }
  };

  useEffect(() => {
    getImage()
    return () => {
      setIsConvert(false);
    };
  }, [isFinish]);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      goToTop();
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const editNews = (item: any) => {
    setEditData(item);
    setIsOpen(true);
    setIsEdit(true);
  };
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
        window.location.reload();
      }
    });
  };

  return (
    <>
      {isOpen && (
        <PopupForm
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          editData={editData}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      )}
      <div
        id="news-card"
        className={`min-h-screen px-[10px] lg:px-0 ${adminUser ? 'lg:pl-[130px] pt-[80px]' : 'lg:pl-[80px] pt-[30px]'}  md:pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full overflow-hidden`}
      > 
        <Head>
          <title>News</title>
          <meta name="Chat" content="Chat" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-full">
          <div className="flex justify-between items-center ">
            <div>
              <h1 className="title">News</h1>
              <h2 className="breadcrumb">
                <a>Home</a> | news
              </h2>
            </div>
            {adminUser && (
              <div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white 
        border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl"
                >
                  Add News
                </button>
              </div>
            )}
          </div>
          <div className="pt-[40px] pb-[40px] space-y-[30px]">
            {useData &&
              isConvert &&
              useData.map((n: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="rounded-2xl  drop-shadow-lg mt-[10px] bg-white w-full h-[400px] lg:h-[300px] flex lg:flex-row flex-col "
                  >
                    <div className="w-full h-[200px] lg:w-[60%] relative  flex justify-center items-center rounded-t-2xl lg:rounded-t-none  lg:rounded-l-2xl  lg:h-full ">
                      <Link
                        href={{
                          pathname: `/news/${encodeURIComponent(n.newId)}`,
                          query: { query: n.newId },
                        }}
                        passHref
                      >
                        <img
                          src={n.source}
                          className="object-contain w-full relative lg:object-contain rounded-t-2xl lg:rounded-t-none h-full  lg:rounded-l-2xl cursor-pointer"
                          alt="thumbnail"
                        />
                      </Link>
                    </div>
                    <div className="w-full flex lg:flex-row flex-col">
                      <div
                        className={`${
                          adminUser
                            ? "lg:w-[50%] pt-[10px]"
                            : "lg:w-[80%] pt-[30px]"
                        } pl-[10px] lg:pl-[40px] lg:my-auto lg:pt-0 `}
                      >
                        <Link
                          href={{
                            pathname: `/news/${encodeURIComponent(n.newId)}`,
                          }}
                          passHref
                        >
                          <p className="text-[14px]  short-sub-title text-purple hover:text-fuchsia-300 cursor-pointer">
                            {n.title}
                          </p>
                        </Link>
                        <p className="text-[12px] text-warmGray-500 sub-title pt-[16px] ">
                          {n.detail}
                        </p>
                        <p className="text-[12px] text-warmGray-500 sub-title pt-[20px]">
                          update by {n.updateDate.slice(0, 10)}
                        </p>
                        <p className="text-[12px] text-warmGray-500 sub-title pt-[4px] pb-[20px]">
                          create by {n.createBy}
                        </p>
                      </div>
                      {adminUser && (
                        <div
                          className={`lg:w-[50%] flex items-center lg:mx-auto lg:pl-[80px] pl-[10px] pb-[20px] pt-[10px]  text-[14px] my-auto space-x-2 `}
                        >
                          <button
                            onClick={() => editNews(n)}
                            className="flex space-x-1 border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl"
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="h-[16px] cursor-pointer"
                            ></FontAwesomeIcon>
                            <span className="lg:block hidden">Edit</span>
                          </button>
                          <button
                            onClick={() => removeNews(n.newId)}
                            className="flex space-x-1 border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl"
                          >
                            <FontAwesomeIcon
                              icon={faTrashCan}
                              className="h-[16px] relative top-0 cursor-pointer"
                            ></FontAwesomeIcon>
                            <span className="lg:block hidden">Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default News;
