import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import liff from "@line/liff/dist/lib";
import { api } from "../../config";
import { useAppContext } from "../../pages/_app";

var stompClient = null;

const Chat = () => {
  const { adminUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [allHistory,setAllHistory] = useState([]);
  const [buttonClick, setButtonClick] = useState(false);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [publicChats, setPublicChats] = useState([]);
  const [tab, setTab] = useState(
    {
      name:"CHATROOM",
      chatId:0
    });
 
  const [userData, setUserData] = useState({
    username: "admin",
    receivername: "",
    connected: false,
    message: "",
  });
  const [currentUser,setCurrentUser] = useState({
    name:"",
    chatId:0
  });
  // useEffect(()=>{
  //   connect()
  // },[])

  const connect = () => {
    let Sock = new SockJS(`${api}/api/chat`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    setUserData({ ...userData, connected: true });
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    setTimeout(function() {
      stompClient.subscribe(
        "/user/" + userData.username + "/private",
        onPrivateMessage
      );
    },1000)
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

  const showHistory = (chatId:any) =>{
    var temp = allHistory
    var data;
    temp = temp.map((item,index)=>{
       if(item.chatId === chatId){
         data = item
       }
    })
    let list = [];
    for (const history of data.chatHistory) {
         list.push(history);
         console.log('history=',history)
         privateChats.set(data.chatId, list);
    }
    setPrivateChats(new Map(privateChats));
  } 

  const onMessageReceived = (payload:any) => {
    var payloadData = JSON.parse(payload.body);
    setAllHistory(payloadData)
    for (let i = 0; i < payloadData.length; i++) {
      // publicChats.push(payloadData[i])
      privateChats.set(payloadData[i].displayName,[])
    }
    // publicChats.push(payloadData)
    // setPublicChats([...publicChats])
    // switch (payloadData.status) {
    //   case "JOIN":
        // if (!privateChats.get(payloadData.senderName)) {
        //   privateChats.set(payloadData.senderName, []);
        //   setPrivateChats(new Map(privateChats));
        // }
    //     break;
    //   case "MESSAGE":
    //     publicChats.push(payloadData);
    //     setPublicChats([...publicChats])
    //     break;
    // }
  };

  const onPrivateMessage = (payload) => {
    var payloadData = JSON.parse(payload.body);
    if (privateChats.get(payloadData.chatId)) {
      privateChats.get(payloadData.chatId).push(payloadData);
      setPrivateChats(new Map(privateChats));
    } else {
      let list = [];
      list.push(payloadData);
      privateChats.set(payloadData.chatId, list);
      setPrivateChats(new Map(privateChats));
    }
    showHistory(payload.chatId)
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
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const sendPrivateValue = (chatId:any) => {
    if (stompClient) {
      var chatMessage = {
        senderName: "admin",
        receiverName: tab.name,
        message: userData.message,
        date: new Date(),
        status: "MESSAGE",
      };

      if (chatId == tab.chatId) {
        console.log('hi')
        privateChats.get(tab.chatId).push(chatMessage);
        setPrivateChats(new Map(privateChats));
      }
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setUserData({ ...userData, message: "" });
    }
  };

  const handleUsername = (event) => {
    const { value } = event.target;
    setUserData({ ...userData, username: value });
  };

  const registerUser = () => {
    connect();
  };
  const tabName = (name:any,chatId:any) => {
    showHistory(chatId)
    setTab({
      name:name,
      chatId:chatId
    });
    setCurrentUser({
      name:name,
      chatId:chatId
    })
    setIsOpen(true);
  };

  return (
    <div className="px-[10px] bg-[#F8F8F8] lg:px-0  lg:pl-[130px] pt-[80px] lg:pt-[90px] lg:pr-[50px] w-full">
      <Head>
        <title>Chat</title>
        <meta name="Chat" content="Chat" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {adminUser && (
        <main className="lg:min-h-screen relative w-full pt-[30px]">
          <div className="w-full bg-white ">
            <div className="h-[70px] flex justify-between items-center pl-[25px] rounded-[10px]">
              <h1 className="text-[24px] text-black font-bold">ข้อความทั้งหมด</h1>
              {!userData.connected &&<button className="mr-[40px] text-white bg-[#336699] p-2  my-auto rounded-lg shadow-lg" type="button" onClick={registerUser}>
                 connect
          </button>}
            </div>
          </div>
          <div className="mt-[15px] block lg:hidden w-full mx-auto h-[30px]">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className={`${
                isOpen ? "bg-[#336699] text-white" : "text-[#336699] border-[#336699]"
              } border-[1.6px]  p-2 rounded-xl w-full lg:w-[92%]`}
            >
              Back
            </button>
          </div>
          {/* Contact */}
          <div className=" min-h-[80vh] mt-[35px] flex flex-col lg:flex-row">
            <div className="lg:w-[30%] lg:h-auto">
              <div
                id="desktop"
                className="w-full lg:w-[93%] lg:h-full bg-white rounded-3xl drop-shadow-md"
              >
                <div className="lg:flex hidden justify-center px-[30px] pb-[10px] h-[60px]  border-b border-[#919191]-[0.8px]">
                  <button
                    onClick={() => setButtonClick(true)}
                    className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                  >
                    Message
                  </button>
                </div>
                {!isOpen && <div className="flex lg:hidden justify-center items-center px-[30px] pb-[10px] h-[40px] ">
                  <button
                    onClick={() => setButtonClick(true)}
                    className={`${"border-t-4 text-[#336699]"} border-[#336699] w-full `}
                  >
                    Message
                  </button>
                </div>}
                {isOpen&&<div className="flex lg:hidden items-center px-[30px] pt-[20px] h-[40px] ">
                {tab.name && tab.name}
                </div>}
                <div className=" hidden space-y-[20px] lg:flex flex-col overflow-y-scroll h-[520px]">
                  <ul>
                    {allHistory.map((history,index)=>{
                      return <li  onClick={() => {
                        tabName(history.displayName,history.chatId)
                      }} className={`member ${
                        tab.chatId === history.chatId && "active"
                      } text-center`}
                      key={index}>
                          {history.displayName}
                      </li>
                    })}
                  </ul>
                </div>
                {!isOpen ? (
                  <div className="lg:hidden pt-[30px] space-y-[32px] flex flex-col overflow-y-scroll h-[360px]">
                    <ul>
                      {allHistory.map((history,index)=>{
                      return <li  onClick={() => {
                        tabName(history.displayName,history.chatId)
                      }} className={`member ${
                        tab.chatId === history.chatId && "active"
                      } text-center`}
                      key={index}>
                          {history.displayName}
                      </li>
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
                              className={`message ${
                                chat.senderName === userData.username && "self"
                              }`}
                              key={index}
                            >
                              {chat.senderName !== userData.username && (
                                <div className="avatar">{chat.senderName}</div>
                              )}
                              <div className={`message-data w-[280px] break-words ${chat.senderName === userData.username && "self" ? 'text-right' : 'text-left'}`}>{chat.message}</div>
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
                      <div className="pt-[30px] lg:hidden space-y-[10px] flex flex-col  h-[360px]  pb-[20px] ">
                        <div className="border-[1px] overflow-y-scroll h-full border-[#336699] rounded-[15px] mx-[4px]">
                          {[...privateChats.get(tab.chatId)].map((chat, index) => (
                            <li
                              className={`message ${
                                chat.senderName === userData.username && "self"
                              }`}
                              key={index}
                            >
                              {chat.senderName !== userData.username && (
                                <div className="avatar">{chat.senderName}</div>
                              )}
                              <div className={`message-data w-[280px] break-words ${chat.senderName === userData.username && "self" ? 'text-right' : 'text-left'}`}>{chat.message}</div>
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
                    <div className="h-[15%] w-full lg:w-[93%]  lg:hidden bg-white rounded-xl drop-shadow-md flex items-center mt-[20px]">
                      <textarea
                        className="text-[14px] pl-[30px] ml-[4px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows={2}
                        placeholder="ข้อความ ...."
                        value={userData.message}
                        onChange={handleMessage}
                      />
                      <button
                        onClick={()=>sendPrivateValue(tab.chatId)}
                        className="w-[30%] lg:w-[10%] mx-auto h-[30px] mr-[10px] text-white bg-[#336699] rounded-lg  "
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
                    <div className="h-[400px]">
                      <ul className="overflow-y-auto h-[90%] border-[1px] border-[#336699] rounded-[15px]">
                        {publicChats.map((chat, index) => (
                          <li
                            className={`message ${
                              chat.senderName === userData.username && "self"
                            }`}
                            key={index}
                          >
                            {chat.senderName !== userData.username && (
                              <div className="avatar">{chat.senderName}</div>
                            )}
                            <div className={`message-data w-[280px] break-words ${chat.senderName === userData.username && "self" ? 'text-right' : 'text-left'}`}>{chat.message}</div>
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
                    <div className="h-[400px]">
                      <ul className="overflow-y-auto h-[90%] border-[1px] border-[#336699] rounded-[15px]">
                        {[...privateChats.get(tab.chatId)].map((chat, index) => (
                          <li
                            className={`message ${
                              chat.senderName === userData.username && "self"
                            }`}
                            key={index}
                          >
                            {chat.senderName !== userData.username && (
                              <div className="avatar">{chat.senderName}</div>
                            )}
                            <div className={`message-data w-[280px] break-words ${chat.senderName === userData.username && "self" ? 'text-right' : 'text-left'}`}>{chat.message}</div>
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
                </div>
              </div>
              {tab.name === "CHATROOM" && (
                <div className="h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center">
                  <textarea
                    className="text-[14px] pl-[30px] ml-[4px] mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={2}
                    placeholder="ข้อความ ....."
                    value={userData.message}
                    onChange={handleMessage}
                  />
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
                <div className="h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center">
                  <textarea
                    rows={2}
                    className="text-[14px] pl-[30px] ml-[4px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="ข้อความ ....."
                    value={userData.message}
                    onChange={handleMessage}
                  />
                  <button
                    onClick={()=>sendPrivateValue(tab.chatId)}
                    className="w-[8%] mx-auto h-[30px] text-white bg-[#336699] rounded-lg  "
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      ) 
      }
    </div>
  );
};

export default Chat;
