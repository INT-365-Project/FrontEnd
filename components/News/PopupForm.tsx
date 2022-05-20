import Router from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Popup from "../common/Popup";
import Swal from 'sweetalert2';
type FormData = {
  title: string;
  description: string;
  thumbnail: string;
  // publish_at: string;
};
const PopupForm = ({ setIsOpen, isOpen ,editData, setIsEdit , isEdit}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  const [data,setData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(()=>{
    if(isEdit){
      setData(editData)
      console.log(selectedImage)
      console.log(editData.cover)
    }else{
      setData(null)
    }
  },[])
  const imageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      console.log(e.target.files[0])
    }
  };
  // This function will be triggered when the "Remove This Image" button is clicked
  const removeSelectedImage = () => {
    setSelectedImage(null);
  };
  
  const onSubmit = (data: FormData) => {
    // URL.createObjectURL(selectedImage)
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
          console.log('hi',data)
          Swal.fire(
            'Edited!',
            'Your news has been Edited.',
            'success'
          )
        }else if(result.isDismissed){
          console.log('hi')
          cancelForm();
        }
      })
    }else{
      successAlert()
    }
    
  };
  const cancelForm = () =>{
    setData(null)
    setIsEdit(false)
    setIsOpen(false)
  }

  const resetData = () =>{
    reset({title:"",description:"",thumbnail:""})
  }

  const successAlert = () => {
    Swal.fire({  
        title: 'Thank you!',  
        text: 'you clicked the button ',
        icon: 'success',
      })
  }



  return (
    <div className="relative min-h-screen">
    <Popup>
      <div className="w-full h-[80vh]  drop-shadow-lg overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
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
                {...register("description", { value:isEdit?editData.description:'',required: "Description is Required" })}
              />
              {errors.description && (<small className='text-red-500'>{errors.description.message}</small>)}
            </div>
            <label className="text-body font-bold tracking-wider">Thumbnail</label>
            <div className="flex justify-center flex-col items-center">
              {selectedImage && (
                <div className="pt-[20px]">
                  <img
                    src={`${URL.createObjectURL(selectedImage)}`}
                    alt="Thumb"
                    className="w-[100%] max-h-[320px]"
                  />
                  <button
                    onClick={removeSelectedImage}
                    className="cursor-pointer p-[15px] bg-purple w-full text-white"
                  >
                    Remove This Image
                  </button>
                </div>
              )}
              {!selectedImage && (
                <div>
                  <img
                    src={`${isEdit ? editData.cover : 'images/unknown.png'}`}
                    alt="Thumb"
                    className="w-[100%] max-h-[280px]"
                  />
                </div>
              )}
              <input
                className="mt-[20px]"
                {...register("thumbnail", {value:isEdit?editData.cover:'', required: isEdit ? false : 'Thumbnail is Required' })}
                accept="image/*"
                type="file"
                onChange={imageChange}
              />
            </div>
            {errors.thumbnail && (<small className='text-red-500'>{errors.thumbnail.message}</small>)}
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
