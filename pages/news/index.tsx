import Head from "next/head";
import React, { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import PopupForm from "../../components/InsiderNews/PopupForm";
import Link from "next/link";
import Swal from "sweetalert2";
import NewsServices from "../../services/news";
import { useAppContext } from "../_app";
import axios from "axios";
import { api } from "../../config";
import Image from "next/image";
import CreateEdit from "../../components/InsiderNews/CreateEdit";
import PopupNews from "./PopupNews";
import NewsAdminLayout from "../../components/InsiderNews/NewsAdminLayout";
import UsersLayout from "../../components/InsiderNews/UsersLayout";

let getToken = null;
if (typeof window !== "undefined") {
  getToken = localStorage.getItem("accessToken");
}
let token = "Bearer " + getToken;
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
  const [isPreview, setIsPreview] = useState(false);
  const [data, setData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [temp,setTemp] = useState([])
  const [filters, setFilter] = useState({ s: "", sort: "" ,page:1});
  const perPage = 9 ;
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
      const res = await axios.post(`${api}/api/viewFileByPath`, {
        filePath: n.thumbnailPath,
      });
      var byteCharacters = atob(res.data.responseData.base64);
      var byteNumbers = new Array(byteCharacters.length);
      for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      var file = new Blob([byteArray], {
        type: `image/${n.thumbnailFileName.slice(
          n.thumbnailFileName.length - 3,
          n.thumbnailFileName.length
        )};base64`,
      });
      var fileURL = URL.createObjectURL(file);
      let p = {
        ...n,
        source: fileURL,
      };
      setUsedata((oldData) => [...oldData, p]);
      setTemp((oldData) => [...oldData, p])
      setIsConvert(true);
    }
  };
  const getData = () =>{
    setFilteredData(useData)
  }

  useEffect(() => {
    getImage();
    getData();
    return () => {
      setIsConvert(false);
    };
  }, [isFinish]);

  useEffect(() => {
    let filterData = useData.filter(
      (p) =>
        p.title.toLowerCase().indexOf(filters.s.toLowerCase()) >= 0 ||
        p.createDate
          .slice(0, 10)
          .toLowerCase()
          .indexOf(filters.s.toLowerCase()) >= 0
    );
    if(filters.sort=='asc' || filters.sort=='desc' ){
      useData.sort((a,b)=>{
        new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        const diff = new Date(a.createDate).getTime() - new Date(b.createDate).getTime()
        if(diff===0) return 0;
        const sign = Math.abs(diff) / diff
        return filters.sort === 'asc' ? sign : -sign
      })
    }
    setUsedata(filterData);
  if(filters.s === ""){
    setUsedata(temp)
  }
  }, [filters]);

  const search = (s: any) => {
    console.log(s);
    setFilter({
      s,
      sort: "",
      page:1
    });
  };
  const sort = (sort:any) => {
    setFilter({
      s: "",
      sort,
      page:1
    });
  };
  const loadMore = () => {
    setFilter({
      s: "",
      sort:"",
      page:filters.page+1
    });
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eyesDetail = (p: any) => {
    setData(p);
    setIsPreview(true);
  };

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
      {isOpen ? (
        <CreateEdit
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          editData={editData}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
        />
      ) : (
        <div
          id="news-card"
          className={`min-h-screen bg-[#F8F8F8] px-[10px] lg:px-0 ${
            adminUser ? "lg:pl-[130px] pt-[80px]" : "lg:pl-[80px] pt-[30px]"
          }  md:pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full `}
        >
          <Head>
            <title>News</title>
            <meta name="Chat" content="Chat" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          {isPreview && <PopupNews data={data} setIsPreview={setIsPreview} />}
          {adminUser?<NewsAdminLayout
            search={search}
            adminUser={adminUser}
            setIsOpen={setIsOpen}
            sort={sort}
            useData={useData}
            isConvert={isConvert}
            eyesDetail={eyesDetail}
            removeNews={removeNews}
            editNews={editNews}
          />
            :
            <UsersLayout
            search={search}
            sort={sort}
            useData={useData}
            isConvert={isConvert}
              />
          }
        </div>
      )}
    </>
  );
};

export default News;
