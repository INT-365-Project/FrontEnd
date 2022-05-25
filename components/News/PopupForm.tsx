import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "../common/Popup";
import Swal from 'sweetalert2';
import NewsServices from "../../services/news";
type FormData = {
  newId:number;
  title: string;
  detail: string;
  thumbnailFile: string;
  thumbnailFileName: string;
  thumbnailPath: string;
};
const PopupForm = ({ setIsOpen, isOpen ,editData, setIsEdit , isEdit }) => {
  const [base64img,setBase64img] = useState(null);
  const [isUpload,setIsUpload] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [selectedImage, setSelectedImage] = useState(false);
  const [imgSrc,setImgSrc] = useState(null);
  const uploadProfile = (e:any) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let endCode64 = null;
    reader.onloadend = function() {
      endCode64 = reader.result
      setSelectedImage(true);
      setBase64img(endCode64)
      register("thumbnailFile",{value:endCode64.slice(endCode64.indexOf(',')+1,endCode64.length-1)})
      register("thumbnailFileName",{value:file.name})
    }
    reader.readAsDataURL(file);
  }

 useEffect(()=>{
   if(isEdit){
  NewsServices.sendPathImage({ filePath: editData.thumbnailPath })
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
  })};
 },[isEdit])
//  if(editData){
//   console.log(editData)
//  }
  const onSubmit = (data: FormData) => {
    // console.log(data)
    setIsOpen(false)
    if(isEdit){
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Edited it!'
      }).then((result) => {
        if (result.isConfirmed) {
          if(!selectedImage){
            const oldImage = {
              ...data,
              thumbnailPath:editData.thumbnailPath,
              thumbnailFile:'',
              thumbnailFileName:''
            }
            console.log(oldImage)
            NewsServices.storeNews(oldImage).then((res) => {
            })
            .catch((err) => {
              console.log(err.response);
            });
        }else{
          const editImg= {
            ...data,
            thumbnailPath:editData.thumbnailPath,
          }
          console.log(editImg)
          NewsServices.storeNews(editImg).then((res) => {
          })
          .catch((err) => {
            console.log(err.response);
          });
        }
          Swal.fire(
            'Edited!',
            'Your news has been Edited.',
            'success'
          )
          cancelForm();
        }else if(result.isDismissed){
          cancelForm();
        }
      })
    }else{
      NewsServices.storeNews(data).then((res) => {
        console.log(res.data);
        successAlert();
      })
      .catch((err) => {
        console.log(err.response);
      });
      // console.log(data)
      // successAlert();
    }
    
  };
  const cancelForm = () =>{
    setIsUpload(false)
    setIsEdit(false)
    setIsOpen(false)
    setSelectedImage(false);
  }

  const resetData = () =>{
    reset({title:"",detail:"",thumbnailFile:""})
  }

  const successAlert = () => {
    Swal.fire({  
        title: 'Thank you!',  
        text: 'you clicked the button ',
        icon: 'success',
      })
      window.location.reload()
  }



  return (
    <div className="relative min-h-screen">
    <Popup>
      <div className="w-full h-[80vh]  drop-shadow-lg overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input name="new_id" className="hidden" ref={()=>register("newId",{value:isEdit ? editData.newId : 0})}/>
            <div id="eiei"></div>
            <div className="text-body pb-[20px] pt-[20px]">
              <label className="text-black font-bold tracking-wider b">
                Title
              </label>
              <input
                className="text-body mt-[6px] shadow appearance-none border  rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="Type your title here..."
                {...register("title", {value:isEdit?editData.title:'' , required: "Title is Required" })}
              />
              {errors.title && (<small className='text-red-500'>{errors.title.message}</small>)}
            </div>
            <div className="pb-[20px]">
              <label className="text-body font-bold tracking-wider">
                Description
              </label>
              <textarea
                className="text-body mt-[10px] tracking-wider shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                rows={6}
                placeholder="Type your description here..."
                {...register("detail", { value:isEdit?editData.detail:'',required: "Description is Required" })}
              />
              {errors.detail && (<small className='text-red-500'>{errors.detail.message}</small>)}
            </div>
            <label className="text-body font-bold tracking-wider">Thumbnail</label>
            <div className="flex justify-center flex-col items-center">
              {selectedImage && (
                <div className="pt-[20px]">
                  {base64img&&<img src={base64img} alt="Thumb"
                    className="w-[100%] max-h-[320px]" />
                    }
                </div>
              )}
              {!selectedImage && (
                <div>
                  <img
                    src={`${isEdit ? imgSrc : 'images/unknown.png'}`}
                    alt="Thumb"
                    className="w-[100%] max-h-[280px]"
                  />
                </div>
              )}
              <input
                onClick={()=>console.log('hi')}
                className="mt-[20px]"
                id="inputFileToLoad"
                required={isEdit ? false : true}
                accept="image/*"
                type="file"
                onChange={uploadProfile}
              />
            </div>
            {errors.thumbnailFile && (<small className='text-red-500'>{errors.thumbnailFile.message}</small>)}
            <div className="space-x-6 pt-[20px] pb-[20px] flex justify-between">
              <button className="border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl">Submit</button>
              <button onClick={() => cancelForm()} className="border-[1.7px] px-[14px] py-[10px] transition-all duration-300 hover:bg-purple hover:text-white border-purple text-purple h-[90%] lg:h-[50%] p-1 rounded-2xl">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </Popup>
    </div>
  );
};

export default PopupForm;
