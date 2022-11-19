import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import FlexMessage from "../components/common/FlexMessage";
import BotServices from "../services/bot";
import FileBase64 from "react-file-base64";

let getToken = null;
if (typeof window !== "undefined") {
  getToken = localStorage.getItem("accessToken");
}
const headers = {
  "Content-Type": "application/json",
  Authorization: typeof window !== "undefined" && getToken,
};

const Intents = () => {
  const mockGroup = [
    {
      groupId: 1,
      topic: "รวมคำถาม",
    },
    {
      groupId: 2,
      topic: "กิจกรรมเพื่อการศึกษา",
    },
    {
      groupId: 3,
      topic: "ข้อมูลหลักสูตร",
    },
    {
      groupId: 4,
      topic: "ข้อมูลค่าเทอม",
    },
    {
      groupId: 5,
      topic: "นักศึกษาใหม่",
    },
  ];
  const [selectedImage, setSelectedImage] = useState(false);
  const [isEditImage, setIsEditImage] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [file, setFile] = useState([]);
  const [isNewImage,setIsNewImage] = useState(false) 
  const [oldImage,setOldImage] = useState("");
  let reponseData = []

  const [imageBase64, setImageBase64] = useState([]);
  const [index, setIndex] = useState(1);
  const [editCommandInput, setEditCommandInput] = useState("");
  const [newCommand, setNewCommand] = useState("");
  const [isAddCommand, setIsAddCommand] = useState(false);
  const [commands, setCommands] = useState([]);
  const [allBot, setAllBot] = useState([]);
  const [topics, setTopics] = useState([]);
  const [topicName, setTopicName] = useState("");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [isFinish, setIsFinish] = useState(false);
  const [isEditFinish, setIsEditFinish] = useState(false);
  const [submitEdit, setSubmitEdit] = useState(false);
  const [currentExpression, setCurrentExpression] = useState({
    name: "",
    text: "",
  });
  const [currentResponse, setCurrentResponse] = useState({
    seq: 0,
    content: "",
    name:"",
    type:""
  });
  const [oldTopic, setOldTopic] = useState("");
  const [isEditingExpression, setIsEditingExpression] = useState(false);
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [isEditingCommand, setIsEditingCommand] = useState(false);
  const [expressionInput, setExpressionInput] = useState("");
  const [expressions, setExpressions] = useState([]);
  let [responseInput, setResponseInput] = useState("");
  let [response, setResponse] = useState([]);
  const [errorCommand, setErrorCommand] = useState({ status: false, msg: "" });
  const [errorExpress, setErrorExpress] = useState({ status: false, msg: "" });
  const [errorResponse, setErrorResponse] = useState({
    status: false,
    msg: "",
  });
  const [seq, setSeq] = useState(0);

  useEffect(() => {
    BotServices.getAllBot()
      .then((res) => {
        setAllBot(res.data.responseData.commands);
      })
      .catch((err) => {
        console.log(err.response);
      });

    BotServices.getAllTopic()
      .then((res) => {
        setTopics(res.data.responseData);
      })
      .catch((err) => {
        console.log(err.response);
      });
  }, []);

  useEffect(() => {
    if (name) {
      for (let i = 0; i < allBot.length; i++) {
        console.log(allBot[i].responses);
        if (name === allBot[i].name) {
          setTopic(allBot[i].topic);
          setTopicName(allBot[i].name);
          setExpressions(allBot[i].expressions);
          for (let reponse of allBot[i].responses) {
            console.log(reponse);
          }
          // if(allBot[i].responses[0].type == "text"){
          setResponse(allBot[i].responses);
          // }else if(allBot[i].responses[0].type == "image"){
          //   setImgSrc(allBot[i].responses)
          // }
        }
      }
    } else {
      if (name === "") {
        setImgSrc(null)
        setTopic("");
        setTopicName("");
        setExpressions([]);
        setResponse([]);
      }
    }
    setIsFinish(false);
  }, [isFinish]);

  const uploadImage = (e: any) => {
    // if(isEditingResponse){
      setIsEditImage(false)
    // }
    let file = e.target.files[0];
    let reader = new FileReader();
    let endCode64 = null;
    reader.onloadend = function () {
      endCode64 = reader.result;
      // console.log(file.name.slice(file.name.length-3,file.name.length))
      setSelectedImage(true);
      setImgSrc(endCode64)
      // setBase64(endCode64.slice(
      //   endCode64.indexOf(",") + 1,
      //   endCode64.length - 1
      // ),)

    };
    reader.readAsDataURL(file);
  };

  const sendIntents = () => {
    if (expressions.length > 0 && response.length > 0 && topic != "") {
      if (expressions.length != 0 || response.length != 0) {
        if (!isEditingExpression && !isEditingResponse) {
          setErrorCommand({ status: false, msg: "" });
          setErrorExpress({ status: false, msg: "" });
          setErrorResponse({ status: false, msg: "" });
          
          Swal.fire({
            title: "ยืนยันการเพิ่มแก้ไข Bot Detect",
            text: "เมื่อทำการยืนยัน ระบบจะทำการส่งข้อมูล",
            icon: "warning",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            confirmButtonColor: "#3085d6",
            cancelButtonText: "ยกเลิก",
            confirmButtonText: "ยืนยัน",
          }).then((result) => {
            if (result.isConfirmed) {
              const data = {
                topic: newCommand != "" ? newCommand : topic,
                name: name != "" ? name : "",
                expressions: expressions,
                responses: response,
              };
              commands.push(data);
              if (commands != null) {
                const intents = {
                  commands: commands,
                };
                console.log(intents);
                BotServices.storeCommand(intents)
                  .then((res) => {
                    console.log(res);
                  })
                  .catch((err) => {
                    console.log(err.response);
                  });
                setCommands([]);
                setExpressionInput("");
                setResponseInput("");
                setTopic("");
              }
              Swal.fire(
                "ระบบดำเนินการเสร็จสิ้น",
                "ข้อมูลของคุณได้ถูกเพิ่มหรือแก้ไข้แล้ว",
                "success"
              );
              setCommands([]);
              setExpressionInput("");
              setResponseInput("");
              setTopic("");
              // location.reload();
            } else if (result.isDismissed) {
              // location.reload();
            }
          });
        }
      }
    } else {
      setErrorCommand({
        status: true,
        msg: "กรุณาใส่ topic ไม่สามารถเป็นค่าว่างได้",
      });
      setErrorExpress({
        status: true,
        msg: "โปรดใส่ Expression ไม่สามารถเป็นค่าว่าง",
      });
      setErrorResponse({
        status: true,
        msg: "โปรดใส่ Response ไม่สามารถเป็นค่าว่าง",
      });
    }
  };
  const selectGroup = (tp: any) => {
    if (tp === "addCommands") {
      setTopic("");
      setIsAddCommand(true);
      setExpressions([]);
      setImgSrc(null)
      setResponse([]);
    } else {
      setImgSrc(null)
      setImgSrc(null);
      setResponse([]);
      setExpressions([]);
      setSelectedImage(false);
      setIsFinish(true);
      setName(tp);
      // setTopic(tp)
    }
  };

  const deleteTopic = () => {
    const items = allBot.map((item) =>{
      if(item.topic == topic){
        return {name : item.name , topic:item.topic , expressions:[] , responses:[]}
      }
     return item
    });
    console.log(items)
    // items.push({
    //   name: name,
    //   topic: "",
    //   expressions: [],
    //   responses: [],
    // });
    const data = {
      commands: items,
    };
    console.log('data',data)
    Swal.fire({
      title: "ยืนยันการลบ Bot Detect",
      text: "เมื่อทำการยืนยัน ระบบจะทำการส่งข้อมูล",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
    }).then((result) => {
      if (result.isConfirmed) {
        BotServices.storeCommand(data)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err.response);
          });
        setCommands([]);
        setExpressionInput("");
        setResponseInput("");
        setTopic("");
        Swal.fire(
          "ระบบดำเนินการเสร็จสิ้น",
          "ข้อมูลของคุณได้ถูกลบแล้ว",
          "success"
        );
        setCommands([]);
        setExpressionInput("");
        setResponseInput("");
        setTopic("");
        // location.reload();
      } else if (result.isDismissed) {
        // location.reload();
      }
    });
    BotServices.storeCommand(data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleResponseDelete = (seq) => {
    const removeItem = response.filter((rs) => {
      return rs.seq !== seq;
    });
    const previousItem = response.map(res=>{
      if(res.type === 'image'){
        return {...res,content:"",type:"image"}
      }
      return res
    })
    setResponse(previousItem)
    setIsEditingResponse(false);
    setResponse(removeItem);
  };
  const handleExpressionDelete = (name) => {
    const removeItem = expressions.filter((ex) => {
      return ex.name !== name;
    });
    const previousItem = response.map(res=>{
      if(res.type === 'image'){
        return {...res,content:"",type:"image"}
      }
      return res
    })
    setResponse(previousItem)
    setIsEditingExpression(false);
    setExpressions(removeItem);
  };
  const handleEditResponseFormSubmit = (e) => {
    e.preventDefault();
    handleUpdateResponse(currentResponse.seq, currentResponse);
  };

  // const handleEditResponseClick = (response: any) => {
  //   setIsEditingResponse(true);
  //   setCurrentResponse({ ...response });
  // };
  // const handlerEditResponseInputChange = (e: any) => {
  //   setCurrentResponse({ ...currentResponse, content: e.target.value });
  // };
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    const previousItem = response.map(res=>{
      if(res.type === 'image'){
        return {...res,content:"",type:"image"}
      }
      return res
    })
    setResponse(previousItem)
    handleUpdateExpression(currentExpression.name, currentExpression);
  };

  const handleUpdateExpression = (name, updatedExpression) => {
    if (currentExpression.text != "") {
      const updatedItem = expressions.map((ex) => {
        return ex.name === name ? updatedExpression : ex;
      });
      const checked = expressions.some(
        (item) => item.text === currentExpression.text
      );
      if (!checked) {
        setIsEditingExpression(false);
        setExpressions(updatedItem);
      } else {
        setIsEditingExpression(false);
      }
    } else {
      setIsEditingExpression(false);
    }
  };
  const handleEditResponseClick = (response: any) => {
    setIsEditingResponse(true);
    setCurrentResponse({ ...response });
  };
  const handleEditExpressionClick = (expression: any) => {
    setIsEditingExpression(true);
    setCurrentExpression({ ...expression });
  };
  const handlerEditResponseInputChange = (e: any) => {
    setCurrentResponse({ ...currentResponse, content: e.target.value });
  };
  const handlerEditExpressionInputChange = (e: any) => {
    setCurrentExpression({ ...currentExpression, text: e.target.value });
  };
  const handlerExpressionInputChange = (e: any) => {
    setExpressionInput(e.target.value);
  };
  const handlerTopicInputChange = (e: any) => {
    e.preventDefault();
    if (!isEditingCommand) {
      setTopic(e.target.value);
    } else {
      setTopic(e.target.value);
    }
  };
  const handlerResponseInputChange = (e: any) => {
    setResponseInput(e.target.value);
  };
  const handleFormNewCommands = (e: any) => {
    setIsEditingExpression(false);
    setIsEditingResponse(false);
    setIsEditingCommand(false);
    setErrorCommand({ status: false, msg: "" });
    e.preventDefault();
    if (topic !== "") {
      if (!isEditingCommand) {
        const checked = topics.some((item) => item.topic === topic);
        if (!checked) {
          setNewCommand(topic);
          setErrorCommand({ status: false, msg: "" });
        } else {
          setErrorCommand({
            status: true,
            msg: "ชื่อ Topic นี้มีอยู่แล้วในระบบ",
          });
        }
      } else {
        const checked = topics.some((item) => item.topic === topic);
        if (!checked || oldTopic === topic) {
          setNewCommand(topic);
          setErrorCommand({ status: false, msg: "" });
          setEditCommandInput(topic);
          setSubmitEdit(true);
        } else {
          setErrorCommand({
            status: true,
            msg: "ชื่อ Topic นี้มีอยู่แล้วในระบบ",
          });
          setSubmitEdit(false);
          if (errorCommand) {
            if (oldTopic === topic) {
              setErrorCommand({ status: false, msg: "" });
              setEditCommandInput(topic);
              setNewCommand(topic);
              setSubmitEdit(true);
            }
          }
        }
      }
    } else {
      setErrorCommand({
        status: true,
        msg: "กรุณาใส่ topic ไม่สามารถเป็นค่าว่างได้",
      });
    }
  };
  const editCommand = () => {
    console.log("editcommand=", editCommandInput);
    setIsEditingCommand(true);
    setNewCommand(topic);
    setOldTopic(topic);
  };
  const cancelNewCommands = () => {
    setImgSrc(null);
    setSelectedImage(false);
    setTopic("");
    setNewCommand("");
    setOldTopic("");
    setExpressions([]);
    setResponse([]);
    setIsAddCommand(false);
    setIsEditingCommand(false);
    setEditCommandInput("");
    setErrorCommand({ status: false, msg: "" });
    setErrorExpress({ status: false, msg: "" });
    setErrorResponse({ status: false, msg: "" });
  };
  const handleFormExpression = (e: any) => {
    e.preventDefault();
    if (expressionInput !== "") {
      const sameImage = response.map(res=>{
        if(res.type === 'image'){
          return {...res,content:"",type:"image"}
        }
        return res
      })
      setResponse(sameImage)
      if (expressions.length == 0) {
        setExpressions([...expressions, { text: expressionInput.trim() }]);
      } else {
        const checked = expressions.some(
          (item) => item.text === expressionInput
        );
        if (!checked) {
          setExpressions([...expressions, { text: expressionInput.trim() }]);
        } else {
          setExpressionInput("");
        }
      }
    }
    setExpressionInput("");
  };

  const handleEditResponseImage = (res) =>{
    console.log('all response',response)
    setOldImage(res.content)
    setCurrentResponse({...res})
    setIsEditImage(true);
    setIsEditingResponse(true);
    setSelectedImage(true);
    setIndex(2)
} 
  const handleUpdateResponse = (seq, updatedResponse) => {
    if (currentResponse.content != "") {
      const updatedItem = response.map((res) => {
        return res.seq === seq ? updatedResponse : res;
      });
      const checked = response.some(
        (item) => item.content === currentResponse.content
      );
      if (!checked) {
        setIsEditingResponse(false);
        setResponse(updatedItem);
      } else {
        setIsEditingResponse(false);
      }
    } else {
      setIsEditingResponse(false);
    }
  };

  const handleFormResponse = (e: any) => {
    e.preventDefault();
    console.log('hi')
    if(isEditingResponse) {
      if(isEditImage && isEditingResponse){
        console.log('edit same image')
        const previousItem = response.map(res=>{
          if(res.type === 'image'){
            return {...res,content:"",type:"image"}
          }
          return res
        })
        const sameItem = previousItem.map((res)=>{
          if(res.seq === currentResponse.seq){
            return {...currentResponse,content:"",type:"image"}
          }
          return res
        })
        console.log('check same image',sameItem)
        setIndex(1);
        setResponse(sameItem)
        setIsEditingResponse(false)
        setIsEditImage(false)
        sendIntents()
      }else if(!isEditImage && isEditingResponse){
        console.log('edit not same image')
        let sameImage = response.map(res=>{
          if(res.type === 'image'){
            return {...res,content:"",type:"image"}
          }
          return res
        })
        const updateItem = sameImage.map((res)=>{
          if(res.seq === currentResponse.seq){
            return {...currentResponse,content:imgSrc,type:"image"}
          }
          return res
        })
        console.log('not same image updateItem',updateItem)
        setIndex(1);
        setResponse(updateItem)
        setIsEditingResponse(false)
        sendIntents()
        console.log(response)
      }
    
    }else{
      if (responseInput == "") {
        console.log('2')
          let sameImage = response.map(res=>{
          if(res.type === 'image'){
            return {...res,content:"",type:"image"}
          }
          return res
        })
        if(imgSrc != null){
          console.log('3')
          sameImage.push({ type: "image", content: imgSrc, seq: response.length+1 })
          response = sameImage
          console.log('3 check',sameImage)
          console.log('3 check response',response)
          sendIntents()
        }
        console.log('2 check',response)
        sendIntents()
        setIndex(1);
        setImgSrc(null);
      } else if (responseInput !== "") {
        if (response.length == 0) {
          console.log('4')
          setResponse([
            ...response,
            { type: "text", content: responseInput.trim(), seq: response.length },
          ]);
          console.log('4 check',response)
        } else {
          console.log('5')
          let sameImage = response.map(res=>{
            if(res.type === 'image'){
              return {...res,content:"",type:"image"}
            }
            return res
          })
          const checked = response.some((item) => item.content === responseInput);
          if (!checked) {
            sameImage.push( {
              type: "text",
              content: responseInput.trim(),
              seq: response.length + 1,
            },)
            response = sameImage
            // setResponse([
            //   ...sameImage,
            //   {
            //     type: "text",
            //     content: responseInput.trim(),
            //     seq: response.length + 1,
            //   },
            // ]);
            console.log('5 check',response)
          } else {
            setResponseInput("");
          }
        }
      }
    }
    
    setResponseInput("");
  };

  return (
    <div className="bg-[#F8F8F8] w-full min-h-screen px-[10px] lg:pl-[140px] pt-[120px]">
      <Head>
        <title>Intents</title>
        <meta name="Chat" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:w-[95%]">
        <div className="flex justify-between items-center min-h-[78px] px-[20px]  md:px-[40px] bg-white rounded-[10px] shadow-lg pt-[10px]">
          <div className="flex flex-col">
            <h1 className="text-[24px] text-black font-semibold pt-[10px]">
              Training Phrases
            </h1>
            <div className="flex justify-center">
              {!isAddCommand && (
                <div className="mb-3 pt-[10px] pb-[10px]">
                  {!isEditingCommand && (
                    <select
                      className="form-select appearance-none block w-[180px] px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-[#919191] rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      aria-label="Default select example"
                      onChange={(e) => selectGroup(e.target.value)}
                    >
                      <option key="0" value="">
                        เลือกกลุ่มเป้าหมาย
                      </option>
                      {topics &&
                        topics.map((t, index) => {
                          return (
                            <option key={t.name} value={t.topicName}>
                              {t.topic}
                            </option>
                          );
                        })}
                      <option
                        value="addCommands"
                        className="bg-[#336699] text-white text-end text-[20px]"
                      >
                        +
                      </option>
                    </select>
                  )}
                  {isEditingCommand && (
                    <>
                      <form onSubmit={handleFormNewCommands}>
                        {editCommandInput === "" ? (
                          <>
                            <input
                              type="text"
                              className="mt-[10px] border w-full h-[40px] border-[#919191] text-gray-900 rounded-[5px] py-[4px] md:py-[8px] pl-[10px] focus:outline-none focus:shadow-outline"
                              placeholder="Add New Commands"
                              value={topic}
                              onChange={handlerTopicInputChange}
                            />

                            {errorCommand.status && (
                              <p className="text-red-400 pt-[10px]">
                                {errorCommand.msg}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <input
                              disabled
                              type="text"
                              className="mt-[10px] border w-full h-[40px] border-[#919191] text-gray-900 rounded-[5px] py-[4px] md:py-[8px] pl-[10px] focus:outline-none focus:shadow-outline"
                              placeholder="Add New Commands"
                              value={topic}
                              onChange={handlerTopicInputChange}
                            />

                            {errorCommand.status && (
                              <p className="text-red-400 pt-[10px]">
                                {errorCommand.msg}
                              </p>
                            )}
                          </>
                        )}
                      </form>
                    </>
                  )}
                  {topic != "" && (
                    <div className="pt-[20px] space-x-[12px]">
                      {!isEditingCommand && (
                        <>
                          <button
                            onClick={() => editCommand()}
                            disabled={topic === ""}
                            className={`ml-[10px] pr-[10px] pl-[10px] ${
                              topic == "" ? "bg-gray-600" : "bg-[#336699]"
                            } rounded-[5px] text-white`}
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteTopic()}
                            disabled={topic === ""}
                            className={`ml-[10px] pr-[10px] pl-[10px] ${
                              topic == "" ? "bg-gray-600" : "bg-gray-600"
                            } rounded-[5px] text-white`}
                          >
                            ลบ
                          </button>
                        </>
                      )}
                      {isEditingCommand && (
                        <button
                          className={`ml-[10px] pr-[10px] pl-[10px] ${
                            topic == "" ? "bg-gray-600" : "bg-gray-600"
                          } rounded-[5px] text-white`}
                          onClick={() => cancelNewCommands()}
                        >
                          ยกเลิก
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {isAddCommand && (
                <>
                  <form className="pb-[20px]" onSubmit={handleFormNewCommands}>
                    {newCommand == "" ? (
                      <>
                        <input
                          type="text"
                          className="mt-[10px] border w-full h-[40px] border-[#919191] text-gray-900 rounded-[5px] py-[4px] md:py-[8px] pl-[10px] focus:outline-none focus:shadow-outline"
                          placeholder="Add News Commands"
                          value={topic}
                          onChange={handlerTopicInputChange}
                        />
                        {errorCommand.status && (
                          <p className="text-red-400 pt-[10px]">
                            {errorCommand.msg}
                          </p>
                        )}
                      </>
                    ) : (
                      <input
                        disabled
                        type="text"
                        className="mt-[10px] border w-full h-[40px] border-[#919191] text-gray-900 rounded-[5px] py-[4px] md:py-[8px] pl-[10px] focus:outline-none focus:shadow-outline"
                        placeholder="Add News Commands"
                        value={newCommand}
                        onChange={handlerTopicInputChange}
                      />
                    )}
                  </form>
                  <button
                    className="ml-[10px] pl-[15px] mt-[10px] text-white rounded-[5px] pr-[15px] h-[40px] bg-slate-900 text-center flex justify-center items-center"
                    onClick={() => cancelNewCommands()}
                  >
                    ยกเลิก
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className=" min-h-[100px]  bg-white rounded-[10px] shadow-lg mt-[30px]">
          <div className="flex flex-col px-[20px]  md:px-[40px]">
            <p className="text-[16px] text-black font-semibold pt-[15px]">
              Expression
            </p>
            <form onSubmit={handleFormExpression}>
              <input
                disabled={topic == ""}
                type="text"
                className="pl-[20px] pt-[10px] border w-full border-[#919191] text-gray-900 rounded-[10px] py-[4px] md:py-[8px] mt-[8px] focus:outline-none focus:shadow-outline"
                placeholder="Add user expression"
                value={expressionInput}
                onChange={handlerExpressionInputChange}
              />
            </form>
            <ul
              className={`${
                expressions && expressions.length === 0
                  ? ""
                  : `border border-[#919191] ${
                      expressions.length >= 10
                        ? "h-[400px] overflow-y-scroll"
                        : ""
                    }`
              }  mt-[14px] mb-[14px] `}
            >
              {expressions &&
                expressions.map((ex, index) => {
                  if (!isEditingExpression) {
                    return (
                      <li
                        className={`${
                          ex.name !== expressions[index].name
                            ? "flex justify-between w-full h-[40px] pt-[15px] pb-[15px]  border-b-black border-b-[1px] pl-[10px]"
                            : " flex justify-between w-full h-[40px] pl-[10px] pt-[15px] pb-[15px] "
                        } `}
                        key={index}
                      >
                        <p
                          onClick={() => {
                            handleEditExpressionClick(ex);
                          }}
                        >
                          {ex.text}
                        </p>
                        <div className="space-x-[15px] pr-[20px]">
                          <button
                            onClick={() => handleExpressionDelete(ex.name)}
                          >
                            {" "}
                            <img
                              src={`/images/delete.svg`}
                              className="iconic"
                              alt="delete"
                              style={{
                                filter:
                                  "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                              }}
                            />
                          </button>
                        </div>
                      </li>
                    );
                  } else if (currentExpression.name === ex.name) {
                    return (
                      <form onSubmit={handleEditFormSubmit}>
                        <input
                          type="text"
                          className={` w-full ${
                            currentExpression.name === ex.name
                              ? "border-l-[#336699] border-l-[4px]"
                              : ""
                          } ' border-b-black border-b-[1px] pl-[20px] text-gray-900  py-[4px] focus:outline-none focus:shadow-outline' "`}
                          placeholder="Edit user expression"
                          value={currentExpression.text}
                          onChange={handlerEditExpressionInputChange}
                        />
                      </form>
                    );
                  } else if (currentExpression.name != ex.name) {
                    return (
                      <li
                        className="flex justify-between w-full h-[40px] pt-[15px] pb-[15px] border-b-black border-b-[1px] pl-[10px]"
                        key={index}
                      >
                        <p
                          onClick={() => {
                            handleEditExpressionClick(ex);
                          }}
                        >
                          {ex.text}
                        </p>
                        <div className="space-x-[15px]">
                          <button
                            onClick={() => handleExpressionDelete(ex.name)}
                          >
                            {" "}
                            <img
                              src={`/images/delete.svg`}
                              className="iconic"
                              alt="delete"
                              style={{
                                filter:
                                  "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                              }}
                            />
                          </button>
                        </div>
                      </li>
                    );
                  }
                })}
            </ul>
            {errorExpress.status && (
              <p className="text-red-400 pt-[10px] pb-[20px]">
                {errorExpress.msg}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center min-h-[60px] px-[20px]  md:px-[40px] bg-white rounded-[10px] shadow-lg mt-[30px]">
          <div className="flex flex-col">
            <h1 className="text-[24px] text-black font-semibold pt-[10px] pb-[10px]">
              Response
            </h1>
          </div>
        </div>
        <div className="flex min-h-[80px]  bg-white rounded-[10px] shadow-lg mt-[30px] pb-[30px]">
          <div className=" pt-[15px] w-full">
            <h1 className="text-[14px] text-black pl-[40px] border-b border-gray-300 pb-[10px] space-x-4">
              <button
                disabled={index == 2}
                onClick={() => setIndex(1)}
                className={`border-b ${
                  index == 1 && "border-[#336699]"
                }  uppercase`}
              >
                Default
              </button>
              {index == 2 && (
                <button
                  onClick={() => setIndex(2)}
                  className={`border-b ${
                    index == 2 && "border-[#336699]"
                  }  uppercase`}
                >
                  Image
                </button>
              )}
            </h1>
            {index == 2 && (
              <div className="mx-[20px]  md:mx-[40px]">
                {/* <FlexMessage bubbleText={bubbleText} /> */}
              </div>
            )}
            <div className="min-h-[40px] mx-[20px]  md:mx-[40px] border border-[#919191] mt-[20px] ">
              <div className="w-full h-[46px] bg-[#EBEBEB] px-[24px] flex justify-between items-center">
                {index == 1 && <p className="text-[16px]">Text Response</p>}
                {index == 2 && <p className="text-[16px]">Custom Payload</p>}
                {index == 2 && (
                  <button
                    onClick={() => setIndex(1)}
                    className="bg-red-600 text-[10px] h-[25px] my-auto w-[100px] rounded-[25px] mr-[10px] text-white"
                  >
                    ยกเลิก
                  </button>
                )}
              </div>
              {index == 2 && (
                <>
                <div className="h-[490px] overflow-y-scroll flex flex-col items-center justify-center">
                <form onSubmit={handleFormResponse}>
            <div className="border-dashed border-[2px] w-[260px] min-h-[220px] flex items-center flex-col justify-center">
              <label htmlFor="inputFileToLoad">
                {!selectedImage ?
                  <img
                    src={`${"/images/upload.png"}`}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                  :
                  (
                  <img
                    src={isEditImage ? `/api/viewImage/${currentResponse.name}` : imgSrc}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                  )
                }
                
                <input
                  className="mt-[20px] hidden"
                  id="inputFileToLoad"
                  accept="image/*"
                  type="file"
                  onChange={uploadImage}
                />
              </label>
              <label htmlFor="inputFileToLoad" className="text-[12px] text-[#919191] flex justify-center pt-[10px] cursor-pointer">
                คลิก เลือกรูปภาพ เพื่ออัพโหลดรูปภาพ
              </label>
            </div>
            <div className="flex justify-center pt-[20px] space-x-4">
              {!selectedImage ? <label htmlFor="inputFileToLoad" className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-[#53a1f0] rounded-[5px] text-white`}>
                เลือกรูปภาพ
              </label> :
                <button type="submit" className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-green-600 rounded-[5px] text-white`}>
                  ยืนยัน
                </button>
              }
              {selectedImage && <button onClick={() => {
                isEditingResponse && handleResponseDelete(currentResponse.seq)
                setImgSrc(null)
                setSelectedImage(false)
              }} className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-red-600 rounded-[5px] text-white`}>
                ลบรูปภาพ
              </button>}
            </div>
            </form>
          </div>
                </>
              )}
              <>
                {index == 1 && (
                  <>
                    <div className="flex justify-between">
                      <form onSubmit={handleFormResponse} className="flex">
                        <span className="flex items-center justify-center mx-auto h-[60px] bg-[#EBEBEB] w-[40px]">
                          1
                        </span>
                        <input
                          disabled={topic == ""}
                          type="text"
                          className="pl-[10px] pt-[10px]  lg:w-[700px] appearance-none focus:outline-none focus:shadow-outline text-gray-900 "
                          placeholder="Enter Text response"
                          value={responseInput}
                          onChange={handlerResponseInputChange}
                        />
                      </form>
                      <button
                        disabled={responseInput != "" || topic == ""}
                        onClick={() => {setIndex(2),setIsNewImage(true)}}
                        className={`${
                          responseInput != "" || topic == ""
                            ? "bg-gray-800"
                            : "bg-blue-400"
                        } 
                 text-[10px] h-[25px] my-auto w-[100px] rounded-[25px] mr-[10px] text-white`}
                      >
                        อัพโหลดรูป
                      </button>
                    </div>
                  </>
                )}
                {index == 1 && (
                  <ul
                    className={` ${
                      response.length >= 10
                        ? "h-[370px] overflow-y-scroll truncate "
                        : "truncate "
                    }`}
                  >
                    {response.map((res, index) => {
                      if (!isEditingResponse) {
                        if (res.type == "image") {
                          return (
                            <li
                              className="flex justify-between w-full"
                              key={index}
                            >
                              <p className="flex">
                                <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                                  {index + 2}
                                </span>
                                      <span className="pl-[10px] pt-[10px] flex flex-row space-x-[10px]">
                                      <img src={ isNewImage ? res.content :`/api/viewImage/${res.name}` } className="w-full h-[200px]" alt="img" />
                                      </span>
                              </p>
                              <div className="space-x-[15px]">
                                <button className="" onClick={() => {
                                res.type === "text"
                                  ? handleEditResponseClick(res)
                                  : handleEditResponseImage(res);
                              }}>
                                   <img
                                    src={`/images/edit.svg`}
                                    className="iconic"
                                    alt="delete"
                                    style={{
                                      filter:
                                        "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                    }}
                                  />
                                  </button>
                                <button
                                  className="pr-[10px]"
                                  onClick={() => handleResponseDelete(res.seq)}
                                >
                                  <img
                                    src={`/images/delete.svg`}
                                    className="iconic"
                                    alt="delete"
                                    style={{
                                      filter:
                                        "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                    }}
                                  />
                                </button>
                              </div>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              className="flex justify-between w-full"
                              key={index}
                            >
                              <p className="flex">
                                <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                                  {index + 2}
                                </span>
                                {res.type === "text" && (
                                  <span className="pl-[10px] pt-[10px]">
                                    {res.content}
                                  </span>
                                )}
                                {res.type === "image" && (
                                  <div className="flex flex-col">
                                          <span className="pl-[10px] pt-[10px] flex flex-row space-x-[10px]">
                                            {/* <img
                                              src={res.content}
                                              alt="img"
                                              className="w-full h-[200px]"
                                            /> */}
                                            <img src={`/api/viewImage/${res.name}`} className="w-full h-[200px]" alt="img" />
                                          </span>
                                  </div>
                                )}
                              </p>
                          
                              <div className="space-x-[15px]">
                              <button className="" onClick={() => {
                                res.type === "text"
                                  ? handleEditResponseClick(res)
                                  : handleEditResponseImage(res);
                              }}>
                                   <img
                                    src={`/images/edit.svg`}
                                    className="iconic"
                                    alt="delete"
                                    style={{
                                      filter:
                                        "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                    }}
                                  />
                                  </button>
                                <button
                                  className="pr-[10px]"
                                  onClick={() => {
                                     handleResponseDelete(res.seq);
                                  }}
                                >
                                  <img
                                    src={`/images/delete.svg`}
                                    className="iconic"
                                    alt="delete"
                                    style={{
                                      filter:
                                        "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                    }}
                                  />
                                </button>
                              </div>
                            </li>
                          );
                        }
                      } else if (currentResponse.seq === res.seq) {
                        return (
                          <form
                            onSubmit={handleEditResponseFormSubmit}
                            className="flex"
                          >
                            <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[50px]">
                              {index + 2}
                            </span>
                            <input
                              type="text"
                              className={`${
                                currentResponse.seq === res.seq
                                  ? "border-l-[#336699] border-l-[4px]"
                                  : ""
                              } pl-[10px] pt-[10px]  w-full appearance-none focus:outline-none focus:shadow-outline text-gray-900 `}
                              placeholder="Edit Text response"
                              value={currentResponse.content}
                              onChange={handlerEditResponseInputChange}
                            />
                          </form>
                        );
                      } else if (currentResponse.seq != res.seq) {
                        return (
                          <li
                            className="flex justify-between w-full"
                            key={index}
                            onClick={() => {
                              res.type === "text"
                                ? handleEditResponseClick(res)
                                : handleEditResponseImage(res);
                            }}
                          >
                            <p className="flex">
                              <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                                {index + 2}
                              </span>
                              {res.type === "text" && (
                                <span className="pl-[10px] pt-[10px]">
                                  {res.content}
                                </span>
                              )}
                              {res.type === "image" && (
                                <div className="flex flex-row">
                                      <span className="pl-[10px] pt-[10px] flex flex-row space-x-[10px]">
                                        {/* <img
                                          src={res.content}
                                          alt="img"
                                          className="w-full h-[200px]"
                                        /> */}
                                        <img src={`/api/viewImage/${res.name}`} className="w-full h-[200px]" alt="img" />
                                      </span>
                                </div>
                              )}
                            </p>
                            <div className="space-x-[15px]">
                            <button className="" onClick={() => {
                                res.type === "text"
                                  ? handleEditResponseClick(res)
                                  : handleEditResponseImage(res);
                              }}>
                                   <img
                                    src={`/images/edit.svg`}
                                    className="iconic"
                                    alt="delete"
                                    style={{
                                      filter:
                                        "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                    }}
                                  />
                                  </button>
                              <button
                                className="pr-[10px]"
                                onClick={() => handleResponseDelete(res.seq)}
                              >
                                <img
                                  src={`/images/delete.svg`}
                                  className="iconic"
                                  alt="delete"
                                  style={{
                                    filter:
                                      "invert(50%) sepia(30%) saturate(100%) hue-rotate(356deg) brightness(96%) contrast(111%)",
                                  }}
                                />
                              </button>
                            </div>
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
              </>
            </div>
            {errorResponse.status && (
              <p className="text-red-400 pt-[10px] pl-[20px]">
                {errorResponse.msg}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => sendIntents()}
          className=" flex justify-between items-center space-x-[10px] text-white border-[2px] md:px-[14px] py-[18px] transition-all duration-300 bg-[#336699] rounded-[5px] h-[50%] p-1 mt-[30px]"
        >
          <p className="text-[18px] px-[14px]">บันทึก</p>
        </button>
      </div>
    </div>
  );
};

export default Intents;
