import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import NewsServices from "../../services/news";
import axios from "axios";
import { api } from "../../config";
import { useAppContext } from "../../pages/_app";

let getToken = null
if (typeof window !== 'undefined'){
  getToken = localStorage.getItem('accessToken') 
}
let token = 'Bearer '+ getToken

const InsiderNews = () => {
  const { adminUser, isLogin, setIsLogin } = useAppContext();
  const [newsData, setNewsData] = useState([]);
  const [useData, setUsedata] = useState([]);
  const [isFinish , setIsFinish] = useState(false);
  const [isConvert , setIsConvert] = useState(false);
  
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
    },200)
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  const getImage = async () => {
    for (let n of newsData) {
      const res = await axios.post(`${api}/api/viewFileByPath`,{filePath:n.thumbnailPath})
      var byteCharacters = atob(res.data.responseData.base64);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], { type: `image/${n.thumbnailFileName.slice(n.thumbnailFileName.length-3,n.thumbnailFileName.length)};base64` });
      var fileURL = URL.createObjectURL(file);
      let p = {
        ...n,
        source: fileURL,
      };
      setUsedata((oldData) => [...oldData, p]);
      setIsConvert(true);
    }
  };

  useEffect(()=>{
    getImage()
  },[isFinish])

  return (
    <div id="news-card" className="w-full mt-[30px] lg:mt-0 ">
      <div className="flex justify-between mb-[18px] bg-white py-[22px] px-[18px] rounded-[5px] drop-shadow-lg ">
        <div className="text-black subtitle text-[20px] font-bold">ข่าว</div>
        <Link href="/news" passHref>
          <div
            className="transition-all duration-300 px-[10px] py-[4px] bg-[#336699] rounded-[5px] 
      hover:bg-[#336699]/40 text-white text-[16px] hover:text-black cursor-pointer"
          >
            ดูทั้งหมด
          </div>
        </Link>
      </div>
      <div className="rounded-[5px] text-[#919191] drop-shadow-lg  bg-white w-full h-[60px] border-b-[2px] ">
        <div className="pl-[10px] lg:pr-[170px] lg:pl-[40px] my-auto lg:pt-[20px] pt-[10px] flex justify-between">
          <h1>
          หัวข้อข่าว
        </h1>
        <p>
          วันที่ลงข่าว
        </p></div>
      </div>
      {useData && isConvert && useData.map((n: any, index: any) => {
          if (index <= 5) {
            return (
              <div
                key={index}
                className=" rounded-[5px] drop-shadow-lg  bg-white w-full h-[60px] flex"
              >
                <div className="w-full flex lg:flex-row flex-col border-b-[2px]">
                  <div className=" lg:w-[80%] pl-[10px] lg:pl-[40px] my-auto lg:pt-0 pt-[10px] flex justify-between">
                    <Link
                      href={{
                        pathname: `/news/${encodeURIComponent(n.newId)}`,
                      }}
                      passHref
                    >
                      <p className="text-[14px] text-black hover:text-warmGray-700 cursor-pointer">
                        {n.title}
                      </p>
                    </Link>
                    <p className="text-[14px] text-black short-sub-title">
                      {n.createDate.slice(0, 10)}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </div>
  );
};

export default InsiderNews;
