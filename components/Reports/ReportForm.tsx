import Router from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ReportServices from "../../services/report";

type FormData = {
  reportId: number;
  description: string;
  topic: string;
};

const ReportForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    const rp = {
      reportId : 0,
      description : data.description,
      topic : data.topic
    }
    ReportServices.storeReport(rp)
      .then((res) => {
        console.log(res.data);
        successAlert();
      })
      .catch((err) => {
        console.log(err.response);
      });
    console.log(rp);
  };
  const successAlert = () => {
    Swal.fire({
      title: "Thank you!",
      text: "you clicked the button for continue or back to home page",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "Back to News",
      cancelButtonText: `Report other problem`,
    }).then((result) => {
      if (result.isConfirmed) {
        Router.push("/news");
      } else if (result.isDismissed) {
        resetData();
      }
    });
  };

  const resetData = () => {
    reset({ topic: "", description: "" });
  };
  return (
    <div className="bg-[#F8F8F8]  lg:pl-[220px]  pt-[120px] lg:pt-[40px] lg:pr-[170px] mx-auto w-[90%] lg:w-full min-h-screen ">
      {!isSuccess && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-[30px]">
          <div className="bg-white rounded-lg h-[70vh] md:h-[70vh] px-[30px] pt-[60px] md:pt-[30px] md:mt-[80px]">
            <div className="flex justify-center tracking-wider mb-[20px] pb-[10px] space-x-[20px]">
              <div className="text-center flex justify-center bg-[#336699] w-[72px] items-center rounded-full h-[72px]">
                <img src="/images/logo.png" alt="" />
              </div>
              <h1 className="flex items-center font-bold text-[22px] md:text-[32px]">
                SIT CHATBOT
              </h1>
            </div>
            <div className="text-center text-[20px] pb-[20px]">
              แจ้งปัญหา
            </div>
            <div className="pb-[20px]">
              <label className="text-body font-bold tracking-wider">
                หัวข้อปัญหา
              </label>
              <input
                className="text-body mt-[10px] shadow appearance-none border rounded-[10px] w-full py-3 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="กรอกหัวข้อปัญหา"
                {...register("topic", { required: "จำเป็นต้องใส่หัวข้อ" })}
              />
              {errors.topic && (
                <small className="text-red-500">{errors.topic.message}</small>
              )}
            </div>
            <div className="pb-[20px]">
              <label className="text-body font-bold tracking-wider">
                รายละเอียด
              </label>
              <textarea
                className="text-body mt-[10px]  shadow appearance-none border rounded-[10px] w-full py-3 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline "
                rows={4}
                placeholder="กรอกรายละเอียด"
                {...register("description", {
                  required: "จำเป็นต้องกรอกรายละเอียด",
                })}
              />
              {errors.description && (
                <small className="text-red-500">
                  {errors.description.message}
                </small>
              )}
            </div>
            <button
              type="submit"
              className="w-full  shadow rounded py-3 px-3 bg-[#336699] text-white tracking-wider uppercase font-semibold"
            >
              ส่ง
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReportForm;
