import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import liff from "@line/liff/dist/lib";
import { api } from "../../config";
import { useAppContext } from "../../pages/_app";
import Popup from "../common/Popup";
import PopupChat from "./PopupChat";

import ContentEditable from 'react-contenteditable'
import PopupImage from "./PopupImage";

var stompClient = null;
let historyList = [];
let countIsRead = [];
const Chat = () => {
  const { adminUser } = useAppContext();
  
  const [showPreviewImage,setShowPreviewImage] = useState(false)
  const [previewUrl,setPreviewUrl] = useState (null)
  
  const [selectedImage, setSelectedImage] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [base64,setBase64] = useState("")
  const [emoji, setEmoji] = useState([]);
  const [sticker, setSticker] = useState(null);

  const [isHasSticker, setIsHasSticker] = useState(false);
  const [isHasImage, setIsHasImage] = useState(false);
  const [isHasEmoji, setIsHasEmoji] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [count, setCount] = useState(0);
  const [openDes, setOpenDes] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  let [allHistory, setAllHistory] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);

  const [tab, setTab] = useState({
    userId: "",
    name: "CHATROOM",
    chatId: 0,
  });

  const [userData, setUserData] = useState({
    username: "admin",
    receivername: "",
    connected: false,
    message: "",
    type: "text"
  });

  
//   const text = useRef('');
  
// const handleChange = evt => {
//     text.current = evt.target.value;
// };

// const handleBlur = () => {
//   console.log('')
// };


  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      connect();
    }, 300);
    return () => window.clearTimeout(timeoutID);
  }, []);

  const connect = () => {
    let Sock = new SockJS(`/api/chat`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + userData.username + "/private",
      onPrivateMessage
    );
    stompClient.subscribe("/updateNewChat", updateChatHistory);
    userJoin();
  };

  const userJoin = () => {
    var chatMessage = {
      senderName: userData.username,
      receiverName: "admin",
      status: "JOIN",
    };
    stompClient.send("/app/getHistory", {}, JSON.stringify(chatMessage));
  };

  const updateChatHistory = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    // console.log("update new payload = ", payloadData);
    historyList.push(payloadData);
    stompClient.subscribe(
      "/user/" + payloadData.userId + "/private",
      onPrivateMessage
    );
  };

  const showHistory = (chatId: any) => {
    if (historyList) {
      var temp = historyList;
      var data;
      temp = temp.map((item, index) => {
        if (item.chatId === chatId) {
          data = item;
        }
      });

      if (data) {
        if (data.chatHistory.length > 0) {
          let list = [];
          // console.log("show history = ", data.chatHistory);
          for (let history of data.chatHistory) {
            history["displayName"] = history.senderName == ("admin") ? "admin" : data.displayName;
            list.push(history);
          }
          if (privateChats.get(data.chatId)) {
            privateChats.delete(data.chatId);
          }
          privateChats.set(data.chatId, list);
        } else {
          privateChats.set(data.chatId, []);
        }
        setPrivateChats(new Map(privateChats));
      }
    }
  };
  // if(imgSrc){
  //   console.log(imgSrc)
  // }
  // if(base64){
  //   console.log(base64)
  // }

  const onMessageReceived = (payload: any) => {

    var payloadData = JSON.parse(payload.body);
    setAllHistory(payloadData);
    // console.log('check payload = ', payloadData)
    // historyList = payloadData
    const temp = []
    if (payloadData.length > 0) {
      payloadData.map((chat, index) => {
        const date = new Date(chat.chatHistory[chat.chatHistory.length - 1].sentDate)
        const time = new Date(chat.chatHistory[chat.chatHistory.length - 1].sentDate).toLocaleTimeString('en',
          { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
        temp.push({ ...chat, date: date.toLocaleDateString(), time: time, message: chat.chatHistory[chat.chatHistory.length - 1].message })
      })
      const res = temp.slice(0).sort((a, b) =>
        b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
      historyList = res
    }
    for (let i = 0; i < payloadData.length; i++) {
      let tempList = []
      for (let j = 0; j < payloadData[i].chatHistory.length; j++) {
        const data = {
          chatId: payloadData[i].chatId,
          senderName: payloadData[i].chatHistory[j].senderName,
          receiverName: payloadData[i].chatHistory[j].receiverName,
          type: payloadData[i].chatHistory[j].type,
          message: payloadData[i].chatHistory[j].message,
          date: payloadData[i].chatHistory[j].sentDate,
          status: "MESSAGE",
          displayName: payloadData[i].displayName,
          isRead: payloadData[i].chatHistory[j].isRead,
          originalContentUrl : payloadData[i].chatHistory[j].originalContentUrl,
          previewImageUrl : payloadData[i].chatHistory[j].previewImageUrl
        }
        tempList.push(data)
      }
      stompClient.subscribe(
        "/user/" + payloadData[i].userId + "/private",
        onPrivateMessage
      );
      privateChats.set(payloadData[i].chatId, tempList);
    }
    console.log('show history = ', privateChats)
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);

    let temp = historyList.filter(element => element.chatId === payloadData.chatId)
    temp[0].chatHistory.push(payloadData)
    let test = historyList.filter(element => element.chatId !== payloadData.chatId)
    test.unshift(temp[0])
    historyList = test

    if (privateChats.get(payloadData.chatId)) {
      privateChats.get(payloadData.chatId).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.chatId, list);
      setPrivateChats(new Map(privateChats));
    }
    console.log('private message = ', privateChats)
    updateAllHistory(payloadData);
  };

  const updateAllHistory = (payload) => {
    // console.log("payload update = ",payload)
    for (let history of historyList) {
      if (history.chatId === payload.chatId) {
        let data = {
          senderName: payload.senderName,
          message: payload.message,
          sentDate: payload.sentDate,
        };
        history.chatHistory.push(data);
      }
    }
    // console.log(historyList)
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, message: value });
  };
  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: userData.username,
        receiverName: "admin",
        message: userData.message,
        date: new Date(),
        status: "MESSAGE",
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = (chatId: any, data: any) => {
    if (data.message == "") return;
    if (stompClient) {
      if (data.type == "sticker") {
        let chatMessage = {
          type: data.type,
          chatId: chatId,
          senderName: "admin",
          receiverName: tab.userId, //change to uId
          message: `${data.packageId},${data.stickerId}`,
          date: new Date(),
          status: "MESSAGE",
          displayName: "admin",
        };
        if (privateChats.get(chatId)) {
          privateChats.get(chatId).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }else if(data.type == "image"){
        let chatMessage = {
          type: data.type,
          chatId: chatId,
          senderName: "admin",
          receiverName: tab.userId, //change to uId
          message: data.message,
          date: new Date(),
          status: "MESSAGE",
          displayName: "admin",
        };
        console.log(chatMessage)
        if (privateChats.get(chatId)) {
          privateChats.get(chatId).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }
      else {
        let chatMessage = {
          type: "text",
          chatId: chatId,
          senderName: "admin",
          receiverName: tab.userId, //change to uId
          message: userData.message,
          date: new Date(),
          status: "MESSAGE",
          displayName: "admin",
        };
        if (privateChats.get(chatId)) {
          privateChats.get(chatId).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
        console.log('send private = ', privateChats)
      }
      // }
    }
  };

  const sendIsRead = (chatId: any, userId: any, index: any) => {
    historyList[index].chatHistory = historyList[index].chatHistory.filter(element => element.isRead === true);
    if (stompClient) {
      var chatMessage = {
        type: "text",
        chatId: chatId,
        senderName: "admin",
        receiverName: userId, //change to uId
        status: "READ",
        displayName: "admin",
      };
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const tabName = (userId: any, name: any, chatId: any, index: any) => {
    console.log("chatId from tabName = ", chatId)
    showHistory(chatId);
    sendIsRead(chatId, userId, index);
    setTab({
      userId: userId,
      name: name,
      chatId: chatId,
    });
    setIsOpen(true);
  };

  const openFullscreen  = (url) =>{
    setPreviewUrl(url)
    setShowPreviewImage(true)
  }


  return (
    <div className="px-[10px] bg-[#F8F8F8] lg:px-0  lg:pl-[130px] pt-[80px] lg:pt-[90px] lg:pr-[50px] w-full ">
      <Head>
        <title>Chat</title>
        <meta name="Chat" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {adminUser && (
        <main className="lg:min-h-screen relative w-full pt-[30px]">
          <div className="w-full bg-white ">
            <div className="h-[70px] flex justify-between items-center pl-[25px] rounded-[10px]">
              <h1 className="text-[24px] text-black font-bold">
                ข้อความทั้งหมด{" "}
              </h1>
            </div>
          </div>
          <div className="mt-[15px] block lg:hidden w-full mx-auto h-[30px]">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className={`${isOpen
                ? "bg-[#336699] text-white"
                : "text-[#336699] border-[#336699]"
                } border-[1.6px]  p-2 rounded-xl w-full lg:w-[92%]`}
            >
              Back
            </button>
          </div>
          {/* Contact */}
          <div className=" min-h-[80vh] mt-[35px] flex flex-col lg:flex-row">
            <div className="lg:w-[30%] lg:h-auto">
              {showPreviewImage && <PopupImage url={previewUrl} setShowPreviewImage={setShowPreviewImage} />}
              {openPopup && <PopupChat
                base64={base64}
                setBase64={setBase64}
                sendPrivateValue={sendPrivateValue}
                chatId={tab.chatId}
                sticker={sticker}
                setSticker={setSticker}
                emoji={emoji}
                setEmoji={setEmoji}
                userData={userData}
                setUserData={setUserData}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                isHasEmoji={isHasEmoji}
                setIsHasEmoji={setIsHasEmoji}
                isHasImage={isHasImage}
                setIsHasImage={setIsHasImage}
                isHasSticker={isHasSticker}
                setIsHasSticker={setIsHasSticker}
                setOpenPopup={setOpenPopup} />}
              <div
                id="desktop"
                className="w-full lg:w-[93%] lg:h-full bg-white rounded-3xl drop-shadow-md"
              >
                <div className="lg:flex hidden justify-center px-[30px] pb-[10px] h-[60px]  border-b border-[#919191]-[0.8px]">
                  <button
                    className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                  >
                    Contact {historyList.length}
                  </button>
                </div>
                {!isOpen && (
                  <div className="flex lg:hidden justify-center items-center px-[30px] pb-[10px] h-[40px] ">
                    <button
                      className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                    >
                      Message
                    </button>
                  </div>
                )}
                {isOpen && (
                  <div className="flex lg:hidden items-center px-[30px] pt-[20px] h-[40px] ">
                    {tab.name && tab.name}
                  </div>
                )}
                <div className=" hidden space-y-[20px] lg:flex flex-col overflow-y-scroll h-[680px]">
                  <ul id="history">
                    {historyList.map((history, index) => {
                      return (
                        <li
                          id={`${history.chatId}`}
                          onClick={() => {
                            tabName(
                              history.userId,
                              history.displayName,
                              history.chatId,
                              index,
                            );
                          }}
                          className={` member ${tab.chatId === history.chatId && "active"
                            } text-center relative`}
                          key={index}
                        >
                          {
                            historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length > 0 &&
                            <div className="rounded-full bg-[#336699] p-3 h-[4px] w-[14px] absolute right-2 top-2 flex justify-center items-center">
                              <p className="text-white">
                                {historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length}
                              </p>
                            </div>
                          }

                          {history.displayName}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {!isOpen ? (
                  <div className="lg:hidden pt-[30px] space-y-[32px] flex flex-col overflow-y-scroll h-[500px]">
                    <ul>
                      {historyList.map((history, index) => {
                        return (
                          <li
                            onClick={() => {
                              tabName(
                                history.userId,
                                history.displayName,
                                history.chatId,
                                index
                              );
                            }}
                            className={`member relative ${tab.chatId === history.chatId && "active"
                              } text-center`}
                            key={index}
                          >
                            {
                              historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length > 0 &&
                              <div className="rounded-full bg-[#336699] p-3 h-[4px] w-[14px] absolute right-2 top-2 flex justify-center items-center">
                                <p className="text-white">
                                  {historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length}
                                </p>
                              </div>
                            }
                            {history.displayName}
                          </li>
                        );
                      })}
                    </ul>
                    {/* Contact */}
                  </div>
                ) : (
                  <>
                    {tab.name == "CHATROOM" && (
                      <div className="pt-[30px] lg:hidden space-y-[10px] flex flex-col h-[400px] pb-[20px]">
                        <div className="border-[1px] overflow-y-scroll h-full border-[#336699] rounded-[15px]  mx-[4px]">
                          {publicChats.map((chat, index) => (
                            <li
                              className={`message ${chat.senderName === userData.username && "self"
                                }`}
                              key={index}
                            >
                              {chat.senderName !== userData.username && (
                                <div className="avatar">{chat.senderName}</div>
                              )}
                              <div
                                className={`message-data w-[280px] break-words ${chat.senderName === userData.username &&
                                  "self"
                                  ? "text-right"
                                  : "text-left"
                                  }`}
                              >
                                {chat.message}
                              </div>
                              {chat.senderName === userData.username && (
                                <div className="avatar self">
                                  {chat.senderName}
                                </div>
                              )}
                            </li>
                          ))}
                        </div>
                      </div>
                    )}
                    {tab.name !== "CHATROOM" && (
                      <div className="pt-[30px] lg:hidden space-y-[10px] flex flex-col  h-[500px]  pb-[20px] ">
                        <div className="border-[1px] overflow-y-scroll h-full border-[#336699] rounded-[15px] mx-[4px]">

                          {[...privateChats.get(tab.chatId)].map(
                            (chat, index) => {
                              let packageId = ""
                              let stickerId = ""
                              if (chat.type === "sticker") {
                                let [a, b] = chat.message.split(",");
                                packageId = a
                                stickerId = b
                              }
                              return (
                                <li
                                className={`message ${chat.senderName === userData.username && "self"
                                  }`}
                                key={index}
                              >
                                {chat.senderName !== userData.username && (
                                  <div className="avatar">{chat.senderName == "admin" ? "admin" : chat.displayName}</div> // name of user in chat
                                )}
                                <div
                                  className={`message-data w-[280px] break-words ${chat.senderName === userData.username &&
                                    "self"
                                    ? "text-right"
                                    : "text-left"
                                    }`}
                                >
                                  {(chat.type==="image" && chat.originalContentUrl == null) && <img id="image" className="cursor-pointer" onClick={()=>openFullscreen(chat.message)} src={`${chat.message}`} alt="image"/>}
                                  {(chat.type==="image" && chat.originalContentUrl != null) && <img id="image" className="cursor-pointer" onClick={()=>openFullscreen(chat.originalContentUrl)} src={`${chat.originalContentUrl}`} alt="image"/>}
                                  {(chat.type === "message" || chat.type === "text") &&  <span className={`myEmoji flex ${chat.senderName === userData.username ? 'float-right' : '' }`} dangerouslySetInnerHTML={{__html: chat.message}}></span>}
                                  {chat.type === "sticker" && <img onError={e=>{e.currentTarget.src = "/sticker/sorry.jpg";}} src={`/sticker/${packageId}/${stickerId}.${packageId === "446" ? 'png' : 'jpg'}`} className={`${chat.senderName === userData.username ? 'float-right' : ''}`} alt="sticker"></img>}

                                </div>
                                {chat.senderName === userData.username && (
                                  <div className="avatar self">
                                    {chat.senderName == "admin" ? "admin" : chat.displayName}
                                  </div> // new
                                )}
                              </li>
                              )
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {isOpen && (
                <>
                  {tab.name == "CHATROOM" && (
                    <div className="h-[15%] w-full lg:w-[93%]  lg:hidden bg-white  rounded-xl drop-shadow-md flex items-center mt-[20px]">
                      <textarea
                        rows={2}
                        className="text-[14px] pl-[30px] ml-[4px] rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="ข้อความ ...."
                        value={userData.message}
                        onChange={handleMessage}
                      />
                      <button
                        disabled
                        onClick={sendValue}
                        className="w-[30%] lg:w-[10%] mx-auto h-[30px] mr-[10px] text-white bg-gray-600 rounded-lg  "
                      >
                        Send
                      </button>
                    </div>
                  )}
                  {tab.name !== "CHATROOM" && (
                    <div className="min-h-[10vh] w-full lg:w-[93%]  lg:hidden bg-white rounded-xl drop-shadow-md flex items-center mt-[20px]">
                    <div className="ml-[18px] space-x-[4px] flex justify-center">
                      <button className="relative"
                        onClick={() => {
                          setOpenPopup(true);
                          setIsHasSticker(true);
                        }}
                        onMouseEnter={() => {
                          setOpenDes(true);
                          setCount(1);
                        }}
                        onMouseLeave={() => {
                          setOpenDes(false);
                          setCount(0);
                        }}
                      >
                        <img src="/images/chatIcon/sticker.svg" alt="sticker"
                          style={{
                            filter:
                              "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                          }} />
                        {openDes && count === 1 && <div className="absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">sticker</div>}
                      </button>
                      <button className="relative"
                        onClick={() => {
                          setOpenPopup(true);
                          setIsHasImage(true);
                        }
                        }
                        onMouseEnter={() => {
                          setOpenDes(true);
                          setCount(2);
                        }}
                        onMouseLeave={() => {
                          setOpenDes(false);
                          setCount(0);
                        }}>
                        <img src="/images/chatIcon/image.svg" alt="image"
                          style={{
                            filter:
                              "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                          }} />
                        {openDes && count === 2 && <div className="absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">image</div>}
                      </button>
                    </div>
                    <div className="mx-auto my-auto overflow-y-scroll text-[14px] relative pl-[24px] ml-[12px] flex  border border-solid border-gray-300 rounded-full min-w-[60%] py-2 px-2 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none">
                      {/* markup */}
                      <ContentEditable 
                      placeholder="ข้อความ ....."  className="textBox text-[14px] rounded-full w-full py-2 px-2 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none" 
                      html={userData.message} 
                      // onBlur={handleBlur} 
                      onChange={handleMessage}
                      // onFocus={handleBlur}
                       onKeyDown={(e)=> {
                          if(e.key === 'Enter' && userData.message!="") {
                            sendPrivateValue(tab.chatId, userData)
                          }
                        }} />
                    </div>
                    <div className="ml-[4px]">
                      <button className="relative"
                        onClick={() => {
                          setOpenPopup(true);
                          setIsHasEmoji(true);
                        }}
                        onMouseEnter={() => {
                          setOpenDes(true);
                          setCount(3);
                        }}
                        onMouseLeave={() => {
                          setOpenDes(false);
                          setCount(0);
                        }}>
                        <img src="/images/chatIcon/emoji.svg" alt="image"
                          style={{
                            filter:
                              "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                          }} />
                        {openDes && count === 3 && <div className=" absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">emoji</div>}
                      </button>
                    </div>
                    <button
                      onClick={() => sendPrivateValue(tab.chatId, userData)}
                      className="w-[8%] text-[10px] mx-auto h-[30px] text-white bg-[#336699] rounded-lg "
                    >
                      Send
                    </button>
                  </div>

                  )}
                </>
              )}
            </div>
            <div id="desktop" className="hidden lg:w-[70%] lg:block ">
              <div className=" h-[85%] ">
                <div className="h-[95%] bg-white rounded-3xl drop-shadow-md  px-[20px]">
                  <div className="h-[15%] mx-auto flex items-center">
                    {tab.name && tab.name}
                  </div>
                  {tab.name === "CHATROOM" && (
                    <div className="h-[470px]">
                      <ul className="overflow-y-auto h-[90%] border-[1px] border-[#336699] rounded-[15px]">
                        {publicChats.map((chat, index) => (
                          <li
                            className={`message ${chat.senderName === userData.username && "self"
                              }`}
                            key={index}
                          >
                            {chat.senderName !== userData.username && (
                              <div className="avatar">{chat.senderName}</div>
                            )}
                            <div
                              className={`message-data w-[280px] break-words ${chat.senderName === userData.username && "self"
                                ? "text-right"
                                : "text-left"
                                }`}
                            >
                              {chat.message}
                            </div>
                            {chat.senderName === userData.username && (
                              <div className="avatar self">
                                {chat.senderName}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {tab.name !== "CHATROOM" && (
                    <div className="h-[470px]">
                      <ul className="overflow-y-auto h-[95%] border-[1px] border-[#336699] rounded-[15px]">
                        {[...privateChats.get(tab.chatId)].map( // new
                          (chat, index) => {
                            let packageId = ""
                            let stickerId = ""
                            if (chat.type === "sticker") {
                              let [a, b] = chat.message.split(",");
                              packageId = a
                              stickerId = b
                            }
                            return (
                              <li
                                className={`message ${chat.senderName === userData.username && "self"
                                  }`}
                                key={index}
                              >
                                {chat.senderName !== userData.username && (
                                  <div className="avatar flex items-center">{chat.senderName == "admin" ? "admin" : chat.displayName}</div> // name of user in chat
                                )}
                                <div
                                  className={`message-data w-[280px] break-words ${chat.senderName === userData.username &&
                                    "self"
                                    ? "text-right"
                                    : "text-left"
                                    }`}
                                >
                                  {(chat.type==="image" && chat.originalContentUrl == null) && <img id="image" className="cursor-pointer" onClick={()=>openFullscreen(chat.message)} src={`${chat.message}`} alt="image"/>}
                                  {(chat.type==="image" && chat.originalContentUrl != null) && <img id="image" className="cursor-pointer" onClick={()=>openFullscreen(chat.originalContentUrl)} src={`${chat.originalContentUrl}`} alt="image"/>}
                                  {(chat.type === "message" || chat.type === "text") &&  <span className={`myEmoji flex ${chat.senderName === userData.username ? 'float-right' : '' }`} dangerouslySetInnerHTML={{__html: chat.message}}></span>}
                                  {chat.type === "sticker" && <img onError={e=>{e.currentTarget.src = "/sticker/sorry.jpg";}} src={`/sticker/${packageId}/${stickerId}.${packageId === "446" ? 'png' : 'jpg'}`} className={`${chat.senderName === userData.username ? 'float-right' : ''}`} alt="sticker"></img>}

                                </div>
                                {chat.senderName === userData.username && (
                                  <div className="avatar self flex items-center">
                                    {chat.senderName == "admin" ? "admin" : chat.displayName}
                                  </div> // new
                                )}
                              </li>
                            )
                          }
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {tab.name === "CHATROOM" && (
                <div className="h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center">
                  <div className="ml-[18px] space-x-[8px]">
                    <button >
                      <img src="/images/chatIcon/sticker.svg" alt="sticker"
                        style={{
                          filter:
                            "invert(0%) sepia(1%) saturate(7480%) hue-rotate(316deg) brightness(94%) contrast(97%);",
                        }} />
                    </button>
                    <button>
                      <img src="/images/chatIcon/image.svg" alt="image"
                        style={{
                          filter:
                            "invert(0%) sepia(1%) saturate(7480%) hue-rotate(316deg) brightness(94%) contrast(97%);",
                        }} />
                    </button>
                  </div>
                  <input
                    className="text-[14px] pl-[24px] ml-[12px]  border border-solid border-gray-300 rounded-full w-[78%] py-3 px-3 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none"
                    type="text"
                    placeholder="ข้อความ ....."
                    value={userData.message}
                    onChange={handleMessage}
                  />
                  <div className="ml-[10px]">
                    <button >
                      <img src="/images/chatIcon/emoji.svg" alt="image"
                        style={{
                          filter:
                            "invert(0%) sepia(1%) saturate(7480%) hue-rotate(316deg) brightness(94%) contrast(97%);",
                        }} />
                    </button>
                  </div>
                  <button
                    disabled
                    onClick={sendValue}
                    className="w-[8%] mx-auto h-[30px] text-white bg-gray-600 rounded-lg  "
                  >
                    Send
                  </button>
                </div>
              )}
              {tab.name !== "CHATROOM" && (
                <div className="min-h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center">
                  <div className="ml-[18px] space-x-[8px]">
                    <button className="relative"
                      onClick={() => {
                        setOpenPopup(true);
                        setIsHasSticker(true);
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(1);
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}
                    >
                      <img src="/images/chatIcon/sticker.svg" alt="sticker"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 1 && <div className="absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">sticker</div>}
                    </button>
                    <button className="relative"
                      onClick={() => {
                        setOpenPopup(true);
                        setIsHasImage(true);
                      }
                      }
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(2);
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                      <img src="/images/chatIcon/image.svg" alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 2 && <div className="absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">image</div>}
                    </button>
                  </div>
                  <div className="overflow-y-scroll text-[14px] relative pl-[24px] ml-[12px] flex  border border-solid border-gray-300 rounded-full w-[78%] py-2 px-2 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none">
                    {/* markup */}
                    <ContentEditable 
                    placeholder="ข้อความ ....."  className="textBox text-[14px] rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none" 
                    html={userData.message} 
                    // onBlur={handleBlur} 
                    onChange={handleMessage}
                    // onFocus={handleBlur}
                     onKeyDown={(e)=> {
                        if(e.key === 'Enter' && userData.message!="") {
                          sendPrivateValue(tab.chatId, userData)
                        }
                      }} />
                  </div>
                  <div className="ml-[10px]">
                    <button className="relative"
                      onClick={() => {
                        setOpenPopup(true);
                        setIsHasEmoji(true);
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(3);
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                      <img src="/images/chatIcon/emoji.svg" alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 3 && <div className="absolute truncate w-[80px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">emoji</div>}
                    </button>
                  </div>
                  <button
                    onClick={() => sendPrivateValue(tab.chatId, userData)}
                    className="w-[8%] mx-auto h-[30px] text-white bg-[#336699] rounded-lg "
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
};

export default Chat;
