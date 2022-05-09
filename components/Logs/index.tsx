import React from "react";
import dateFormat from "dateformat";
const data = [
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-9-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-11-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-12-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-1-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-2-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-3-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-4-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-5-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-6-10" },
  { title: "ค่าเทอมลดมั้ยครับช่วงโควิด", published_at: "2021-7-10" },
];

const Logs = () => {
  return (
    <div className="w-[95%]">
      <div className="text-purple subtitle">Logs</div>
      <div className="rounded-xl drop-shadow-lg bg-white mt-[10px] mx-auto h-[400px] overflow-hidden ">
        <div className="pl-[30px] pr-[20px] overflow-y-auto h-[330px] w-[90%] mt-[30px] mx-auto text-warmGray-500 ">
          {data.map((l,index) => {
            const publishedAt = new Date(l.published_at);
            return (
              <div key={index} className="flex justify-between pt-[20px] py-[5px] h-[55px]">
                <p>{l.title}</p>
                <p>{dateFormat(publishedAt, "dd mmm yy")}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Logs;
