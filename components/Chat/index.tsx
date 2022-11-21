import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import liff from "@line/liff/dist/lib";
import { api } from "../../config";
import { useAppContext } from "../../pages/_app";
import Popup from "../common/Popup";
import PopupChat from "./PopupChat";
import { useBeforeUnload } from "react-use";
import ContentEditable from 'react-contenteditable'
import PopupImage from "./PopupImage";
import Router,{ useRouter } from "next/router";
var stompClient = null;
let historyList = [];
let countIsRead = [];
const Chat = () => {
  const { adminUser } = useAppContext();
  const router = useRouter();
  const [readButton,setReadButton] = useState(0)
  const [isManualToggle,setIsManualToggle] = useState(false)
  let [manualToggle,setManualToggle] = useState(false)
  let [autoToggle,setAutoggle] = useState(false)
  const [checkBotResponse,setCheckBotResponse] = useState(false)
  
  const [showPreviewImage,setShowPreviewImage] = useState(false)
  const [previewUrl,setPreviewUrl] = useState (null)
  
  const [openToggleAnswer,setOpenToggleAnswer] = useState(false)

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

  useEffect(() => {
    const timeoutID = window.setTimeout(() => {
      connect();
    }, 300);
    return () => window.clearTimeout(timeoutID);
  }, []);

  useEffect(() => {
    window.onbeforeunload = function() {
      localStorage.removeItem("chatId")
      localStorage.removeItem("userId")
      closeConnection()
    };

    return () => {
        window.onbeforeunload = null;
    };
}, []);

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      localStorage.removeItem("chatId")
      closeConnection()
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [])

  const filterHistory = (event) =>{
    // event.target.value
    setIsManualToggle(false)
    console.log(event.target.value)
    if(event.target.value === 'AutoMode'){{
      setIsManualToggle(false)
      let temp = []
      historyList.map((history,index)=>{
      if(history.isBotResponse === true){
        temp.unshift(history)
      }else{
        temp.push(history)
      }
    })
    console.log(temp)
    historyList = temp
    setReadButton(0)
    setAllHistory(temp)
    }}
    if(event.target.value === 'ManualMode'){{
      let temp = []
      historyList.map((history,index)=>{
      if(history.isBotResponse === false){
        temp.unshift(history)
      }else{
        temp.push(history)
      }
    })
    console.log(temp)
    setIsManualToggle(true)
    historyList = temp
    setReadButton(0)
    setAllHistory(temp)
    }}
    if(event.target.value === 'read'){{
      setIsManualToggle(false)
      let temp = []
      historyList.map((history,index)=>{
      if(history.chatHistory[history.chatHistory.length-1].isRead === true){
        console.log('list not read',history)
        temp.unshift(history)
      }else{
        temp.push(history)
      }
    })
    console.log(temp)
    historyList = temp
    setReadButton(0)
    setAllHistory(temp)
    }}
    if(event.target.value === 'unRead'){
      setIsManualToggle(false)
      let temp = []
    console.log(historyList)
    historyList.map((history,index)=>{
      if(history.chatHistory[history.chatHistory.length-1].isRead === false){
        console.log('list not read',history)
        temp.unshift(history)
      }else{
        temp.push(history)
      }
    })
    console.log(temp)
    historyList = temp
    setReadButton(1)
    setAllHistory(temp)
    }
  }


  const closeConnection = () =>{
    if (stompClient != null) {
      stompClient.disconnect(function() {
          console.log('disconnected...');
      });                    
  }     
  }
  const connect = () => {
    let Sock = new SockJS(`${api}/api/chat`);
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
    historyList.push(payloadData);
    stompClient.subscribe(
      "/user/" + payloadData.userId + "/private",
      onPrivateMessage
    );
  };

  const showHistory = (chatId: any) => {
    
    if (historyList) {
      // console.log('history list' , historyList)
      var data;
      historyList.map((item, index) => {
        if (item.chatId === chatId) {
          data = item;
        }
      });
      
      if (data) {
        // console.log('show history check private chat = ',privateChats.get(data.chatId))
        if (data.chatHistory.length > 0) {
          let list = [];
          for (let history of data.chatHistory) { // แยก sender กับ reciever
            history["displayName"] = history.senderName == ("admin") ? "admin" : data.displayName; 
            list.push(history);
          }
          if (privateChats.get(data.chatId)) {
            privateChats.set(data.chatId, list);
            setPrivateChats(new Map(privateChats));
          }else{
            privateChats.set(data.chatId, list);
          }
        } 
        else {
          privateChats.set(data.chatId, []);
        }
        setPrivateChats(new Map(privateChats));
      }
    }
    // console.log('click tab private = ', privateChats)
  };

  const onMessageReceived = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    // historyList = payloadData
    
    const temp = []
    if (payloadData.length > 0) {
      console.log(payloadData)
      payloadData.map((chat, index) => {
        const date = new Date(chat.chatHistory[chat.chatHistory.length - 1].sentDate)
        const time = new Date(chat.chatHistory[chat.chatHistory.length - 1].sentDate).toLocaleTimeString('en',
          { timeStyle: 'short', hour12: false, timeZone: 'UTC' });
        temp.push({ ...chat, date: date.toLocaleDateString(), time: time, message: chat.chatHistory[chat.chatHistory.length - 1].message })
      })
        let res = temp.slice(0).sort((a, b) =>
        b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
        console.log(res)
        let result = []
        res.map((history,index)=>{
          if(history.chatHistory[history.chatHistory.length-1].isRead === false){
            console.log('list not read',history)
            result.unshift(history)
          }else{
            result.push(history)
          }
        })
      historyList = result
    }
    setAllHistory(payloadData);
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
    console.log('historylist',historyList)
    // console.log('show history = ', privateChats)
  };

  const onPrivateMessage = (payload) => {
    const chatId = localStorage.getItem('chatId');
    const userId = localStorage.getItem('userId');
    var payloadData = JSON.parse(payload.body);
    console.log('payload = ',payloadData)
    let displayNameUser = ""
    console.log('historyList',historyList)

    if(historyList){
      for (let history of historyList) {
        if(history.chatId === payloadData.message.chatId){
          displayNameUser = history.displayName
        }
        if (history) {
          privateChats.set(history.chatId,history.chatHistory)
        }
      }
      console.log('displayNameUser',displayNameUser)
      let list = [];
      list = payloadData.history.map((items)=>{
        let data = {
          chatId: items.chatId,
          senderName: items.senderName,
          receiverName: items.receiverName,
          type: items.type,
          message: items.message,
          date: items.sentDate,
          status: "MESSAGE",
          displayName: displayNameUser  ,
          isRead: chatId == payloadData.message.chatId ? true : (items.isRead == 0 ? false : true),
          originalContentUrl : items.originalContentUrl,
          previewImageUrl : items.previewImageUrl
        }
        if(items){
          return {...data}
        }
        return items
      })
      // if(chatId == payloadData.message.chatId){
      //   sendIsRead(chatId,userId,0)
      // }
      // if(historyList){
        for(let history of historyList){
          if(history.chatId === payloadData.message.chatId){
            console.log('list',list)
             let temp = historyList.filter(element => element.chatId === payloadData.message.chatId)
             temp[0].chatHistory = list
             let test = historyList.filter(element => element.chatId !== payloadData.message.chatId)
             test.unshift(temp[0])
            historyList = test
            console.log('after set private',history.chatHistory)
          }
        }
      //  } 
      if(chatId == payloadData.message.chatId){
        sendIsRead(chatId,userId,0)
      }
      if (privateChats.get(payloadData.chatId)) {
        privateChats.set(payloadData.message.chatId,list)
        setPrivateChats(new Map(privateChats));
      }
       else { 
        let list = [];
        list.push(payloadData);
        privateChats.set(payloadData.chatId, list);
        setPrivateChats(new Map(privateChats));
      }
      // console.log('private message = ', payloadData)
      // historyList = test
    }
    
  };

  const updateAllHistory = (payload) => {
    for (let history of historyList) {
      if (history.chatId === payload.chatId) {
        let data = {
          senderName: payload.senderName,
          receiverName : payload.receiverName,
          message: payload.message,
        };
        history.chatHistory.push(data);
      }
    }
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
          chatId: chatId,
          senderName: "admin",
          receiverName : tab.userId,
          originalContentUrl: null,
          previewImageUrl: null,
          type: "sticker",
          message: `${data.packageId},${data.stickerId}`,
          date: new Date(),
          isRead: true,
          status: "MESSAGE",
          displayName : "admin"
        };
   
        for (let history of historyList) {
          if (history.chatId === chatId) {
            history.chatHistory.push(chatMessage);
          }
        }
             if (privateChats.get(chatId)) {
          let list = [];
          list = historyList.filter((history)=> history.chatId == chatId)
          privateChats.set(chatId,list[0].chatHistory)
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }else if(data.type == "image"){
        let imageHistory = {
          chatId: chatId,
          senderName: "admin",
          receiverName : tab.userId,
          originalContentUrl: data.message,
          previewImageUrl: data.message,
          type: data.type,
          message: data.message,
          date: new Date(),
          isRead: true,
          status: "MESSAGE",
          displayName : "admin"
        };
        for (let history of historyList) {
          if (history.chatId === chatId) {
            history.chatHistory.push(imageHistory);
          }
        }
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
        if (privateChats.get(chatId)) {
          let list = [];
          list = historyList.filter((history)=> history.chatId == chatId)
          privateChats.set(chatId,list[0].chatHistory)
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }
      else {
        let chatMessage = {
          chatId: chatId,
          senderName: "admin",
          receiverName : tab.userId,
          originalContentUrl: null,
          previewImageUrl: null,
          type: "text",
          message: userData.message,
          date: new Date(),
          isRead: true,
          status: "MESSAGE",
          displayName : "admin"
        };
        // for (let history of historyList) {
        //   if (history.chatId === chatId) {
        //     history.chatHistory.push(chatMessage);
        //   }
        // }
        setAllHistory(historyList)
        if (privateChats.get(chatId)) {
          let list = [];
          list = historyList.filter((history)=> history.chatId == chatId)
          privateChats.set(chatId,list[0].chatHistory)
          // privateChats.get(chatId).push(chatMessage)
          setPrivateChats(new Map(privateChats));
          console.log('send alls private =', privateChats.get(chatId))
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({ ...userData, message: "" });
      }
      // }
    }
  };

  const sendAutoMode = (chatId: any, userId: any) => {
    historyList = historyList.map((history)=>{
      if(history.chatId === chatId){
        return {...history,isBotResponse:true}
      }
      return history
    })
    setAllHistory(historyList)
    if (stompClient) {
      var chatMessage = {
        type: "text",
        chatId: chatId,
        senderName: "admin",
        receiverName: userId, //change to uId
        status: "BOT",
        message: "1",
        displayName: "admin",
      };
      console.log(chatMessage)
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      // setUserData({ ...userData, message: "" });
    }   
    alert("คุณได้ทำการเปิดโหมด Auto การตอบคำถาม และปิดการตอบคำถามแบบ Manual แล้ว")
  };

  
  const sendManualMode = (chatId: any, userId: any) => {
   historyList = historyList.map((history)=>{
      if(history.chatId === chatId){
        return {...history,isBotResponse:false}
      }
      return history
    })
    console.log('sendManual',historyList)
    setAllHistory(historyList)
    if (stompClient) {
      var chatMessage = {
        type: "text",
        chatId: chatId,
        senderName: "admin",
        receiverName: userId, //change to uId
        status: "BOT",
        message:"0",
        displayName: "admin",
      };
      console.log(chatMessage)
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      // setUserData({ ...userData, message: "" });
    }   
    alert("คุณได้ทำการเปิดโหมด Manual การตอบคำถามและปิดการตอบคำถามแบบ Auto แล้ว")
  };

  const sendIsRead = (chatId: any, userId: any, index: any) => {
    historyList[index].chatHistory = historyList[index].chatHistory.map(element => {
      if(element.isRead === false){
        return {...element,isRead:true}
      }
      return element
    });
    console.log('after read' ,historyList[index].chatHistory)
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
    setCheckBotResponse(true)
  };

  const tabName = (userId: any, name: any, chatId: any, index: any) => {
    console.log("chatId from tabName = ", chatId)
    if(historyList[index].isBotResponse === true){
      console.log('hi')
      setAutoggle(true)
      setManualToggle(false)
    } else if (historyList[index].isBotResponse === false){
      console.log('eiei')
      setAutoggle(false)
      setManualToggle(true)
    }

    localStorage.setItem('chatId', chatId)
    localStorage.setItem('userId', userId)
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
      {/* <button onClick={()=>closeConnection()}>disconnect</button> */}
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
              {showPreviewImage && <PopupImage showPreviewImage={showPreviewImage} url={previewUrl} setShowPreviewImage={setShowPreviewImage} />}
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
                <div className={`${"border-t-4 flex justify-between space-x-[6px] text-[#336699]"} border-[#336699] w-full `}>
                <select className="block py-2.5 px-0 text-sm text-[#336699] bg-transparent appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" 
                onChange={filterHistory} name="cars" id="cars">
                    <option selected>Filter By</option>
                    <option value="read">Read</option>
                    <option value="unRead">Unread</option>
                    <option value="AutoMode">Auto mode</option>
                    <option value="ManualMode">Manual Mode</option>
                </select>
                  <button
                    // className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                  >
                    Contact {historyList.length}
                  </button>
                  <p className="text-white cursor-default">
                    t
                  </p>
                  </div>
                
                 
                </div>
                {!isOpen && (
                  <div className="flex lg:hidden justify-center items-center px-[30px] pb-[10px] h-[40px] ">
                    
                    {/* <div className="flex justify-center px-[30px] pb-[10px] h-[60px]  border-b border-[#919191]-[0.8px]"> */}
                <div className={`${"border-t-4 flex justify-between space-x-[6px] text-[#336699]"} border-[#336699] w-full `}>
                <select className="block py-2.5 px-0 text-sm text-[#336699] bg-transparent appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer" 
                onChange={filterHistory} name="cars" id="cars">
                    <option selected>Filter By</option>
                    <option value="read">Read</option>
                    <option value="unRead">Unread</option>
                    <option value="AutoMode">Auto mode</option>
                    <option value="ManualMode">Manual Mode</option>
                </select>
                  <button
                    // className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                  >
                    Contact {historyList.length}
                  </button>
                  <p className="text-white cursor-default">
                    t
                  </p>
                  </div>
                
                 
                </div>
                  // </div>
                )}
                {isOpen && (
                  <div className="flex lg:hidden items-center justify-between px-[20px] pt-[30px] h-[40px] ">
                    <p className="text-[18px] font-medium ">{tab.name && tab.name}</p>
                    <button onClick={()=>{setTab({userId: "",name: "CHATROOM",chatId: 0,}),setIsOpen(false),localStorage.removeItem("chatId")}}>close</button>
                  </div>
                )}
                <div className=" hidden space-y-[20px] lg:flex flex-col overflow-y-scroll overflow-x-hidden h-[680px]">
                  <ul id="history">
                    {historyList.map((history, index) => {
                      return (
                        <button
                          disabled={tab.chatId == history.chatId ? true : false}
                          id={`${history.chatId}`}
                          onClick={() => {
                            tabName(
                              history.userId,
                              history.displayName,
                              history.chatId,
                              index,
                            );
                          }}
                          className={`w-full member ${tab.chatId === history.chatId && "active"
                            } text-left relative`}
                          key={index}
                        >
                          {
                            //css change
                            historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length > 0 && (
                             <div className={tab.chatId === history.chatId ? "hidden" : "rounded-full bg-[#336699] p-3 h-[4px] w-[14px] absolute right-2 top-2 flex justify-center items-center"}>
                              <p className="text-white">
                                {historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length}
                              </p>
                            </div>
                            )
                          }
                          <div>
                            <p className="font-bold"> 
                            {history.displayName}
                            </p>
                          <p className={`truncate w-[90%] ${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? ' underline rounded-[4px] ' : ''} text-[14px]`}>{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "text" && !historyList[index].chatHistory[historyList[index].chatHistory.length-1].message.includes('img')) && 
                          <>
                          {historyList[index].chatHistory[historyList[index].chatHistory.length-1].senderName === "admin" && <span>คุณ:</span>  }
                          <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}>{historyList[index].chatHistory[historyList[index].chatHistory.length-1].message}</span>
                          </>
                          }
                           </p>
                           <p className="truncate  text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "image") && 
                          <>
                         <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          รูปภาพ</span>
                          </>
                          }
                           </p>
                           <p className="truncate text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "sticker") && 
                          <>
                             <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          สติ๊กเกอร์</span>
                          </>
                          }
                           </p>
                           <p className="truncate text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "text" 
                           && historyList[index].chatHistory[historyList[index].chatHistory.length-1].message.includes('img')) && 
                          <>
                             <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          อีโมจิ</span>
                          </>
                          }
                           </p>
                          </div>
                        </button>
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
                              } `}
                            key={index}
                          >
                          {
                            //css change
                            historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length > 0 && (
                             <div className={tab.chatId === history.chatId ? "hidden" : "rounded-full bg-[#336699] p-3 h-[4px] w-[14px] absolute right-2 top-2 flex justify-center items-center"}>
                              <p className="text-white">
                                {historyList[index].chatHistory.filter(element => element.isRead === false && element.senderName !== "admin").length}
                              </p>
                            </div>
                            )
                          }
                          <div>
                            <p className="font-bold"> 
                            {history.displayName}
                            </p>
                          <p className={`truncate w-[90%] ${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? ' underline rounded-[4px] ' : ''} text-[14px]`}>{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "text" && !historyList[index].chatHistory[historyList[index].chatHistory.length-1].message.includes('img')) && 
                          <>
                          {historyList[index].chatHistory[historyList[index].chatHistory.length-1].senderName === "admin" && <span>คุณ:</span>  }
                          <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}>{historyList[index].chatHistory[historyList[index].chatHistory.length-1].message}</span>
                          </>
                          }
                           </p>
                           <p className="truncate  text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "image") && 
                          <>
                         <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          รูปภาพ</span>
                          </>
                          }
                           </p>
                           <p className="truncate text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "sticker") && 
                          <>
                             <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          สติ๊กเกอร์</span>
                          </>
                          }
                           </p>
                           <p className="truncate text-[14px]">{(historyList[index].chatHistory[historyList[index].chatHistory.length-1].type == "text" 
                           && historyList[index].chatHistory[historyList[index].chatHistory.length-1].message.includes('img')) && 
                          <>
                             <span className={`${(history.isBotResponse === false && isManualToggle && tab.chatId !== history.chatId) ? 'bg-orange p-2 rounded-[4px] ' : ''}`}><span>คุณ:</span>
                          อีโมจิ</span>
                          </>
                          }
                           </p>
                          </div>
                          </li>
                        );
                      })}
                    </ul>
                    {/* Contact */}
                  </div>
                ) : (
                  <>
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
                                  {(chat.type === "message" || chat.type === "text") &&  <span className={`myEmoji pointer-events-none flex ${chat.senderName === userData.username ? 'float-right' : '' }`} dangerouslySetInnerHTML={{__html: chat.message}}></span>}
                                  {chat.type === "sticker" && <img onError={e=>{e.currentTarget.src = "/sticker/sorry.jpg";}} src={`/sticker/${packageId}/${stickerId}.${packageId === "446" ? 'png' : 'jpg'}`} className={` pointer-events-none ${chat.senderName === userData.username ? 'float-right' : ''}`} alt="sticker"></img>}

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
                            filter : "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
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
                      onChange={handleMessage}
                      onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                      onKeyDown={(e)=>{e.code === 'Space' && e.preventDefault()}}
                       />
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
                      {!openToggleAnswer && <button className="relative"
                      onClick={() => {
                        sendManualMode(tab.chatId,tab.userId),
                        setOpenToggleAnswer(true)
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(4);
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                      <img src="/images/not-approved.png" className="w-[24px]"  alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 4 && <div className="absolute truncate w-[140px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">Manual Answer</div>}
                    </button>}
                    {openToggleAnswer && <button className="relative"
                      onClick={() => {
                        sendAutoMode(tab.chatId,tab.userId),
                        setOpenToggleAnswer(false)
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(5);  
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                        <img src="/images/chat.png" className="w-[24px]" alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 5 && <div className="absolute truncate w-[120px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">Auto Answer</div>}
                    </button>}
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
                <div className={`h-[95%] ${tab.name === "CHATROOM" ? "bg-gray-400/30" : "bg-white"} rounded-3xl drop-shadow-md  px-[20px]`}>
                  <div className="h-[15%] flex justify-between mx-auto items-center ">
                    {(tab.name && tab.name != "CHATROOM") && tab.name}
                    {(tab.name && tab.name != "CHATROOM") && <button onClick={()=>{setTab({userId: "",name: "CHATROOM",chatId: 0,}),setIsOpen(false)}}>close</button>}
                  </div>
                  {tab.name === "CHATROOM" && (
                    <div className="h-[470px] flex flex-col justify-center items-center">
                         <div className="text-center flex justify-center bg-[#336699] w-[72px] h-[72px] items-center "><img src="/images/logo.png" alt="" /></div>
                    <div>
                          <p className="text-black pt-[14px] cursor-default">
                            Welcome to Chat Service please select any users to start chating
                          </p>
                    </div>
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
                            return  (
                              <li
                                className={`message ${chat.senderName === userData.username && "self"
                                  }`}
                                key={index}
                              >
                                {(chat.senderName !== userData.username && (chat.message != "" || chat.message != null)) && (
                                  <div className="avatar flex items-center">{chat.senderName == "admin" ? "admin" : chat.displayName}</div> // name of user in chat
                                )}
                                <div
                                  className={`message-data w-[280px] break-words ${chat.senderName === userData.username &&
                                    "self"
                                    ? "text-right"
                                    : "text-left"
                                    }`}
                                >
                                  {(chat.type==="image" && chat.originalContentUrl == null) && <img id="image" className="cursor-pointer flex float-right" onClick={()=>openFullscreen(chat.message)} src={`${chat.message}`} alt="image"/>}
                                  {(chat.type==="image" && chat.originalContentUrl != null) && <img id="image" className="cursor-pointer flex float-right " onClick={()=>openFullscreen(chat.originalContentUrl)} src={`${chat.originalContentUrl}`} alt="image"/>}
                                  {(chat.type === "message" || chat.type === "text") &&  <span className={`myEmoji pointer-events-none flex ${chat.senderName === userData.username ? 'float-right' : '' }`} dangerouslySetInnerHTML={{__html: chat.message}}></span>}
                                  {chat.type === "sticker" && <img onError={e=>{e.currentTarget.src = "/sticker/sorry.jpg";}} src={`/sticker/${packageId}/${stickerId}.${packageId === "446" ? 'png' : 'jpg'}`} className={`pointer-events-none ${chat.senderName === userData.username ? 'float-right' : ''}`} alt="sticker"></img>}

                                </div>
                                {(chat.senderName === userData.username && (chat.message != "" || chat.message != null)) && (
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
                    disabled={true}
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
                  <div className=" text-[14px] relative pl-[24px] ml-[12px] flex  border border-solid border-gray-300 rounded-full w-[72%] py-2 px-2 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none">
                    {/* markup */}
                    <ContentEditable 
                    placeholder="ข้อความ ....."  className="textBox text-[14px] rounded-full w-full py-3 px-3 text-gray-700 leading-tight focus:shadow-outline bg-gray-100 bg-clip-padding transition ease-in-out focus:text-gray-700 focus:border-blue-600 focus:outline-none" 
                    html={userData.message} 
                    onChange={handleMessage}
                    onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault() }}
                    onKeyDown={(e)=>{e.code === 'Space' && e.preventDefault()}}
                      />
                  </div>
                  <div className="ml-[10px] space-x-4">
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
                    {autoToggle && <button className="relative"
                      onClick={() => {
                        sendManualMode(tab.chatId,tab.userId),
                        setOpenToggleAnswer(true),
                        setManualToggle(true),
                        setAutoggle(false)
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(4);
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                      <img src="/images/not-approved.png" className="w-[24px]"  alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 4 && <div className="absolute truncate w-[140px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">Manual Answer</div>}
                    </button>}
                    {manualToggle && <button className="relative"
                      onClick={() => {
                        sendAutoMode(tab.chatId,tab.userId),
                        setOpenToggleAnswer(false),
                        setManualToggle(false),
                        setAutoggle(true)
                      }}
                      onMouseEnter={() => {
                        setOpenDes(true);
                        setCount(5);  
                      }}
                      onMouseLeave={() => {
                        setOpenDes(false);
                        setCount(0);
                      }}>
                        <img src="/images/chat.png" className="w-[24px]" alt="image"
                        style={{
                          filter:
                            "invert(41%) sepia(20%) saturate(1448%) hue-rotate(169deg) brightness(83%) contrast(91%)",
                        }} />
                      {openDes && count === 5 && <div className="absolute truncate w-[120px] rounded-[6px] top-[-40px] left-[-20px] bg-[#336699] text-white py-[4px] text-center">Auto Answer</div>}
                    </button>}
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

export function getServerSideProps(ctx: { params: any; }) {
  const { params } = ctx;
  const { id } = params;

  const currentDate = Date.now();

  return {
    props: {
      currentDate,
    }, // will be passed to the page component as props
  };
}

export default Chat;
