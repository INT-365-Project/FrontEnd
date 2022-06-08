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

const News = () => {
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
      const res = await axios.post(`${api}/viewFileByPath`,{filePath:n.thumbnailPath})
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
      <div className="flex justify-between">
        <div className="text-purple subtitle">News</div>
        <Link href="/news" passHref>
          <div
            className="transition-all duration-300 px-[20px] border-[1.7px] border-purple rounded-2xl 
      hover:bg-purple text-purple hover:text-white cursor-pointer"
          >
            See All
          </div>
        </Link>
      </div>
      {useData && isConvert && useData.map((n: any, index: any) => {
          if (index <= 5) {
            return (
              <div
                key={index}
                className="rounded-2xl drop-shadow-lg mt-[12px] bg-white w-full h-[110px] flex"
              >
                <div className="w-[200px]  rounded-l-2xl h-full flex just justify-center items-center">
                  <Link
                    href={{ pathname: `/news/${encodeURIComponent(n.newId)}` }}
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
                  <div className=" lg:w-[80%] pl-[10px] lg:pl-[40px] my-auto lg:pt-0 pt-[10px]">
                    <Link
                      href={{
                        pathname: `/news/${encodeURIComponent(n.newId)}`,
                      }}
                      passHref
                    >
                      <p className="text-[14px] text-purple hover:text-fuchsia-300 cursor-pointer">
                        {n.title}
                      </p>
                    </Link>
                    <p className="text-[12px] text-warmGray-500 short-sub-title">
                      {n.detail}
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

export default News;
