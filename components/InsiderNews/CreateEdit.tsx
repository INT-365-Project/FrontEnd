import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import NewsServices from "../../services/news";
type FormData = {
  newId: number;
  title: string;
  detail: string;
  thumbnailFile: string;
  thumbnailFileName: string;
  thumbnailPath: string;
};
const CreateEdit = ({ setIsOpen, isOpen, editData, setIsEdit, isEdit }) => {
  const [base64img, setBase64img] = useState(null);
  const [isUpload, setIsUpload] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [selectedImage, setSelectedImage] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const uploadProfile = (e: any) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let endCode64 = null;
    reader.onloadend = function () {
      endCode64 = reader.result;
      // console.log(file.name.slice(file.name.length-3,file.name.length))
      setSelectedImage(true);
      setBase64img(endCode64);
      register("thumbnailFile", {
        value: endCode64.slice(
          endCode64.indexOf(",") + 1,
          endCode64.length - 1
        ),
      });
      register("thumbnailFileName", { value: file.name });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (isEdit) {
      NewsServices.sendPathImage({ filePath: editData.thumbnailPath })
        .then((res) => {
          var byteCharacters = atob(res.data.responseData.base64);
          var byteNumbers = new Array(byteCharacters.length);
          for (var i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          var byteArray = new Uint8Array(byteNumbers);
          var file = new Blob([byteArray], {
            type: `image/${editData.thumbnailFileName.slice(
              editData.thumbnailFileName.length - 3,
              editData.thumbnailFileName.length
            )};base64`,
          });
          var fileURL = URL.createObjectURL(file);
          setImgSrc(fileURL);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }, [isEdit]);

  const cancelForm = () => {
    setIsUpload(false);
    setIsEdit(false);
    setIsOpen(false);
    setSelectedImage(false);
  };
  const successAlert = () => {
    Swal.fire({
      title: "Thank you!",
      text: "you clicked the button ",
      icon: "success",
    });
    window.location.reload();
  };

  const onSubmit = (data: FormData) => {
    setIsOpen(false);
    if (isEdit) {
      Swal.fire({
        title: "ยืนยันการแก้ไขข่าว",
        text: "เมื่อทำการยืนยัน ระบบจะทำการเปลี่ยนแปลงข้อมูล",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        cancelButtonText:"ยกเลิก",
        confirmButtonText: "ยืนยัน",
      }).then((result) => {
        if (result.isConfirmed) {
          if (!selectedImage) {
            const oldImage = {
              ...data,
              thumbnailPath: editData.thumbnailPath,
              thumbnailFile: "",
              thumbnailFileName: editData.thumbnailFileName,
            };
            NewsServices.storeNews(oldImage)
              .then((res) => {})
              .catch((err) => {
                console.log(err.response);
              });
          } else {
            const editImg = {
              ...data,
              thumbnailPath: editData.thumbnailPath,
            };
            // console.log(editImg)
            NewsServices.storeNews(editImg)
              .then((res) => {})
              .catch((err) => {
                console.log(err.response);
              });
          }
          Swal.fire("Edited!", "Your news has been Edited.", "success");
          cancelForm();
          location.reload();
        } else if (result.isDismissed) {
          cancelForm();
        }
      });
    } else {
      NewsServices.storeNews(data)
        .then((res) => {
          successAlert();
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <div className="bg-[#F8F8F8] w-full relative min-h-screen px-[10px] lg:pl-[140px] pt-[90px]">
      <Head>
        <title>Create Edit Delete</title>
        <meta name="Chat" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex space-x-[15px]">
        <h1
          onClick={() => setIsOpen(false)}
          className="text-[#919191] cursor-pointer hover:text-[#919191]/60"
        >
          ข่าวทั้งหมด
        </h1>
        <p className="text-[#919191] cursor-default">{">"}</p>
        <h1 className="text-[#336699] cursor-default">สร้างข่าว</h1>
      </div>
      <div className="md:w-[92%] pt-[20px]">
        <div className="flex justify-between items-center h-[68px] px-[20px]  md:px-[40px] bg-white rounded-[10px]">
          <div className="flex flex-col">
            <h1 className="text-[24px] text-black font-semibold pt-[10px]">
              สร้างข่าว
            </h1>
          </div>
        </div>
        <div className="bg-white w-full min-h-[350px] mt-[20px] rounded-[5px]">
          <div className="border-b-[1.4px] h-[40px] rounded-[5px] md:pl-[100px] pl-[30px] pt-[10px] text-[#919191]">
            <h1>รูปภาพ</h1>
          </div>
          <div className="border-dashed border-[2px] w-[260px] min-h-[220px] mx-auto mt-[20px] flex flex-col justify-center items-center">
          <div className="flex justify-center flex-col items-center">
              {selectedImage && (
                <div className="pt-[20px]">
                  {base64img&&<img src={base64img} alt="Thumb"
                    className="w-[100%] max-h-[320px]" />
                    }
                </div>
              )}
              {!selectedImage && (
                <label htmlFor="inputFileToLoad">
                  <img
                    src={`${isEdit ? imgSrc : 'images/upload.png'}`}
                    alt="Thumb"
                    className="mx-auto cursor-pointer"
                  />
                </label>
              )}
              <input
                className="mt-[20px] hidden"
                id="inputFileToLoad"
                required={isEdit ? false : true}
                accept="image/*"
                type="file"
                onChange={uploadProfile}
              />
            </div>
            <label htmlFor="inputFileToLoad" className="text-[12px] text-[#919191] flex justify-center pt-[10px] cursor-pointer">
              คลิก "เลือกรูปภาพ" เพื่ออัพโหลดรูปภาพ
            </label>
            {errors.thumbnailFile && (<small className='text-red-500'>{errors.thumbnailFile.message}</small>)}
          </div>
          <div className="flex justify-center pt-[20px]">
            <label htmlFor="inputFileToLoad" className="w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center bg-[#919191] rounded-[5px] text-white">
              เลือกรูปภาพ
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white w-full min-h-[380px] mt-[20px] rounded-[5px]">
          <div className="border-b-[1.4px] h-[40px] rounded-[5px] pl-[30px] md:pl-[100px] pt-[10px] text-[#919191]">
            <h1>รายละเอียดข่าว</h1>
              <div>
                <input
                  name="new_id"
                  className="hidden"
                  ref={() =>
                    register("newId", { value: isEdit ? editData.newId : 0 })
                  }
                />
                <div id="eiei"></div>
                <div className="text-body pb-[20px] pt-[20px] flex">
                  <label className="text-black font-bold tracking-wider flex w-[120px]">
                    หัวข้อข่าว <span className="text-red-400">*</span>
                  </label>
                  <input
                    className="text-body mt-[6px] shadow appearance-none border border-black  rounded w-[80%] mx-auto py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="กรอกหัวข้อข่าว"
                    {...register("title", {
                      value: isEdit ? editData.title : "",
                      required: "Title is Required",
                    })}
                  />
                  {errors.title && (
                    <small className="text-red-500">
                      {errors.title.message}
                    </small>
                  )}
                </div>
                <div className="pb-[20px] flex">
                  <label className="text-black font-bold tracking-wider flex w-[120px]">
                    รายละเอียด <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    className=" text-body mt-[10px] tracking-wider shadow appearance-none border border-black rounded w-[80%] mx-auto py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    rows={8}
                    placeholder="กรอกรายละเอียดข่าว"
                    {...register("detail", {
                      value: isEdit ? editData.detail : "",
                      required: "กรอกรายละเอียดข่าว",
                    })}
                  />
                  {errors.detail && (
                    <small className="text-red-500">
                      {errors.detail.message}
                    </small>
                  )}
                </div>
              </div>
            
          </div>
        </div>
        <div className="flex justify-center space-x-[20px] pt-[20px]">
          <button
            className="bg-white h-[28px] w-[67px] rounded-[5px]"
            onClick={() => cancelForm()}
          >
            ยกเลิก
          </button>
          <button className="bg-[#336699] text-white h-[28px] w-[67px] rounded-[5px]">
            สร้าง
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEdit;
