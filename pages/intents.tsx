import axios from "axios";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import FlexMessage from "../components/common/FlexMessage";
import BotServices from "../services/bot";

let getToken = null
if (typeof window !== 'undefined') {
  getToken = localStorage.getItem('accessToken')
}
const headers = {
  'Content-Type': 'application/json',
  'Authorization': (typeof window !== 'undefined') && getToken 
}

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
  const [selectedImage,setSelectedImage] = useState(false);
  const [isEditImage,setIsEditImage] = useState(false);
  const [imgSrc,setImgSrc] = useState(null)
  const [base64,setBase64] = useState(null)

  const [bubbleJson,setBubbleJson] = useState(null)
  const [bubbleText,setBubbleText] = useState({topic:"",content:"",button:""})
  const [index,setIndex] = useState(1)
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
  });
  const [oldTopic, setOldTopic] = useState("");
  const [isEditingExpression, setIsEditingExpression] = useState(false);
  const [isEditingResponse, setIsEditingResponse] = useState(false);
  const [isEditingCommand, setIsEditingCommand] = useState(false);
  const [expressionInput, setExpressionInput] = useState("");
  const [expressions, setExpressions] = useState([]);
  const [responseInput, setResponseInput] = useState("");
  const [response, setResponse] = useState([]);
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
        console.log(allBot[i].responses)
        if (name === allBot[i].name) {
          setTopic(allBot[i].topic);
          setTopicName(allBot[i].name);
          setExpressions(allBot[i].expressions);
          if(allBot[i].responses[0].type == "text"){
            setResponse(allBot[i].responses);
          }else if(allBot[i].responses[0].type == "image"){
            setImgSrc(allBot[i].responses)
          }
        }
      }
    } else {
      if (name === "") {
        setImgSrc("");
        setTopic("");
        setTopicName("");
        setExpressions([]);
        setResponse([]);
      }
    }
    setIsFinish(false);
  }, [isFinish]);

  const uploadImage = (e: any) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let endCode64 = null;
    reader.onloadend = function () {
      endCode64 = reader.result;
      setBase64(reader)
      setSelectedImage(true);
      setImgSrc(endCode64)
    };

    reader.readAsDataURL(file);
  };

  const sendIntents = () => {
    if(selectedImage){
      if (!isEditingExpression && !isEditingResponse) {
        const responseImage = {
          type: "image",
          content: imgSrc,
          seq: response.length
        }
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
              responses: [responseImage],
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
              location.reload();
            } else if (result.isDismissed) {
              location.reload();
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
      setResponse([]);
    } else {
      setImgSrc(null);
      setSelectedImage(false);
      setIsFinish(true);
      setName(tp);
      // setTopic(tp)
    }
  };

  const deleteTopic = () => {
    const items = allBot.filter((item) => item.topic != topic);
    items.push({
                name: name,
                topic: "",
                expressions: [],
                responses: [],
    })
    console.log(items)
    const data = {
      commands : items
    }
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
        location.reload();
      } else if (result.isDismissed) {
        location.reload();
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
    setIsEditingResponse(false);
    setResponse(removeItem);
  };
  const handleExpressionDelete = (name) => {
    const removeItem = expressions.filter((ex) => {
      return ex.name !== name;
    });
    setIsEditingExpression(false);
    setExpressions(removeItem);
  };
  const handleEditResponseFormSubmit = (e) => {
    e.preventDefault();
    handleUpdateResponse(currentResponse.seq, currentResponse);
  };
  const handleEditFormSubmit = (e) => {
    e.preventDefault();
    handleUpdateExpression(currentExpression.name, currentExpression);
  };
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
    setImgSrc(null)
    setSelectedImage(false)
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
  const handleFormResponse = (e: any) => {
    e.preventDefault();
    if (responseInput !== "") {
      if (response.length == 0) {
        setResponse([
          ...response,
          { type: "text", content: responseInput.trim(), seq: response.length },
        ]);
      } else {
        const checked = response.some((item) => item.content === responseInput);
        if (!checked) {
          setResponse([
            ...response,
            {
              type: "text",
              content: responseInput.trim(),
              seq: response.length,
            },
          ]);
        } else {
          setResponseInput("");
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
              <button onClick={()=>setIndex(1)} className={`border-b ${index==1 && "border-[#336699]"}  uppercase`}>
                Default
              </button>
              <button onClick={()=>setIndex(2)} className={`border-b ${index==2 && "border-[#336699]"}  uppercase`}>
                Image 
              </button>
            </h1>
            {
            index == 2 && <div className="mx-[20px]  md:mx-[40px]">
            {/* <FlexMessage bubbleText={bubbleText} /> */}
            </div>
            }
            <div className="min-h-[40px] mx-[20px]  md:mx-[40px] border border-[#919191] mt-[20px] ">
              <div className="w-full h-[46px] bg-[#EBEBEB] px-[24px] flex items-center">
                {index == 1 && <p className="text-[16px]">Text Response</p>}
                {index == 2 && <p className="text-[16px]">Custom Payload</p>}
              </div>
              {
                index == 2 && 
                <>
                <div className="h-[490px] overflow-y-scroll flex flex-col items-center justify-center">
            <div className="border-dashed border-[2px] w-[260px] min-h-[220px] flex items-center flex-col justify-center">
              <label htmlFor="inputFileToLoad">
                {!selectedImage ?
                  <img
                    src={`${isEditImage ? imgSrc : 'images/upload.png'}`}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                  :
                  <img
                    src={imgSrc}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                }
                <input
                  disabled={topic === ""}
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
              {!selectedImage && <label htmlFor="inputFileToLoad" className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-[#53a1f0] rounded-[5px] text-white`}>
                เลือกรูปภาพ
              </label> 
              }
              {selectedImage && <button onClick={() => {
                setImgSrc(null)
                setSelectedImage(false)
              }} className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-red-600 rounded-[5px] text-white`}>
                ลบรูปภาพ
              </button>}
            </div>
          </div>
                </>
              }
              <>
              {
                index == 1 && 
              <form onSubmit={handleFormResponse} className="flex">
                <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                  1
                </span>
                <input
                  disabled={topic == ""}
                  type="text"
                  className="pl-[10px] pt-[10px]  w-full appearance-none focus:outline-none focus:shadow-outline text-gray-900 "
                  placeholder="Enter Text response"
                  value={responseInput}
                  onChange={handlerResponseInputChange}
                />
              </form>
              }
              {index == 1 && 
              <ul
                className={` ${
                  response.length >= 10 ? "h-[370px] overflow-y-scroll" : ""
                }`}
              >
                {response.map((res, index) => {
                  if (!isEditingResponse) {
                    return (
                      <li
                        className="flex justify-between w-full"
                        key={index}
                        onClick={() => handleEditResponseClick(res)}
                      >
                        <p className="flex">
                          <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                            {index + 2}
                          </span>
                          <span className="pl-[10px] pt-[10px]">
                            {res.content}
                          </span>
                        </p>
                        <div className="space-x-[15px]">
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
                        onClick={() => handleEditResponseClick(res)}
                      >
                        <p className="flex">
                          <span className="flex items-center justify-center mx-auto h-[40px] bg-[#EBEBEB] w-[40px]">
                            {index + 2}
                          </span>
                          <span className="pl-[10px] pt-[10px]">
                            {res.content}
                          </span>
                        </p>
                        <div className="space-x-[15px]">
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
              }
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

