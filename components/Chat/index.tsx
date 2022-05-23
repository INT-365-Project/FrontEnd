import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
const mockUsers = [
  {
    uid: '1',
    user: "Blaine Cottrell",
  },
  {
    uid: '2',
    user: "Zlaine Cottrell",
  },
  {
    uid: '3',
    user: "Dlaine Cottrell",
  },
  {
    uid: '4',
    user: "Rlaine Cottrell",
  },
  {
    uid: '5',
    user: "Olaine Cottrell",
  },
  {
    uid: '6',
    user: "Olaine Cottrell",
  },
  {
    uid: '7',
    user: "Olaine Cottrell",
  }

]

type FormData = {
  message: string;
};
const Chat = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonClick, setButtonClick] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    console.log(data)
  }
  const [privateChats, setPrivateChats] = useState(new Map());     
  const [publicChats, setPublicChats] = useState([]); 
  const [tab,setTab] =useState("CHATROOM");
  const [userData, setUserData] = useState({
      username: '',
      receivername: '',
      connected: false,
      message: ''
    });
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const connect =()=>{
      let Sock = new SockJS('http://localhost:8080/chat');
      stompClient = over(Sock);
      stompClient.connect({},onConnected, onError);
  }

  const onConnected = () => {
      setUserData({...userData,"connected": true});
      stompClient.subscribe('/chatroom/public', onMessageReceived);
      stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
      userJoin();
  }

  const userJoin=()=>{
        var chatMessage = {
          senderName: userData.username,
          status:"JOIN"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  }

  const onMessageReceived = (payload)=>{
      var payloadData = JSON.parse(payload.body);
      switch(payloadData.status){
          case "JOIN":
              if(!privateChats.get(payloadData.senderName)){
                  privateChats.set(payloadData.senderName,[]);
                  setPrivateChats(new Map(privateChats));
              }
              break;
          case "MESSAGE":
              publicChats.push(payloadData);
              setPublicChats([...publicChats]);
              break;
      }
  }
  
  const onPrivateMessage = (payload)=>{
      console.log(payload);
      var payloadData = JSON.parse(payload.body);
      if(privateChats.get(payloadData.senderName)){
          privateChats.get(payloadData.senderName).push(payloadData);
          setPrivateChats(new Map(privateChats));
      }else{
          let list =[];
          list.push(payloadData);
          privateChats.set(payloadData.senderName,list);
          setPrivateChats(new Map(privateChats));
      }
  }

  const onError = (err) => {
      console.log(err);
      
  }

  const handleMessage =(event)=>{
      const {value}=event.target;
      setUserData({...userData,"message": value});
  }
  const sendValue=()=>{
          if (stompClient) {
            var chatMessage = {
              senderName: userData.username,
              message: userData.message,
              status:"MESSAGE"
            };
            console.log(chatMessage);
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }
  }

  const sendPrivateValue=()=>{
      if (stompClient) {
        var chatMessage = {
          senderName: userData.username,
          receiverName:tab,
          message: userData.message,
          status:"MESSAGE"
        };
        
        if(userData.username !== tab){
          privateChats.get(tab).push(chatMessage);
          setPrivateChats(new Map(privateChats));
        }
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        setUserData({...userData,"message": ""});
      }
  }

  const handleUsername=(event)=>{
      const {value}=event.target;
      setUserData({...userData,"username": value});
  }

  const registerUser=()=>{
      connect();
  }

  return (
    <div className="container">
    {userData.connected?
    <div className="chat-box">
        <div className="member-list">
            <ul>
                <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                {[...privateChats.keys()].map((name,index)=>(
                    <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                ))}
            </ul>
        </div>
        {tab==="CHATROOM" && <div className="chat-content">
            <ul className="chat-messages">
                {publicChats.map((chat,index)=>(
                    <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                        {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                    </li>
                ))}
            </ul>

            <div className="send-message">
                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                <button type="button" className="send-button" onClick={sendValue}>send</button>
            </div>
        </div>}
        {tab!=="CHATROOM" && <div className="chat-content">
            <ul className="chat-messages">
                {[...privateChats.get(tab)].map((chat,index)=>(
                    <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                        {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                        <div className="message-data">{chat.message}</div>
                        {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                    </li>
                ))}
            </ul>

            <div className="send-message">
                <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
            </div>
        </div>}
    </div>
    :
    <div className="register">
        <input
            id="user-name"
            placeholder="Enter your name"
            name="userName"
            value={userData.username}
            onChange={handleUsername}
          />
          <button type="button" onClick={registerUser}>
                connect
          </button> 
    </div>}
</div>
    // <div className='px-[10px] lg:px-0  lg:pl-[130px] pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full'>
    //   <Head>
    //     <title>Chat</title>
    //     <meta name="Chat" content="Chat" />
    //     <link rel="icon" href="/favicon.ico" />
    //   </Head>
    //   {userData.connected ? <div></div> : <main className='lg:min-h-screen relative w-full'>
    //     <div className='w-full'>
    //       <div>
    //         <h1 className='title'>
    //           Chat
    //         </h1>
    //         <h2 className='breadcrumb'>
    //           <a>Home</a> | Chat
    //         </h2>
    //       </div>
    //     </div>
    //     <div className='mt-[15px] block lg:hidden w-full mx-auto h-[30px]'>
    //       <button onClick={() => { setIsOpen(false) }} className={`${isOpen ? 'bg-purple text-white' : 'text-purple border-purple'} border-[1.6px]  p-2 rounded-xl w-full lg:w-[92%]`}>Back</button>

    //     </div>
    //     <div className=' min-h-[80vh] mt-[35px] flex flex-col lg:flex-row'>
    //       <div className='lg:w-[30%] lg:h-auto'>
    //         <div id="desktop" className='w-full lg:w-[93%] lg:h-full bg-white rounded-3xl drop-shadow-md'>
    //           <div className='flex justify-center px-[30px] pb-[20px] h-[80px]'>
    //             <button onClick={() => setButtonClick(true)} className={`${'border-t-4 text-purple'} border-purple w-full `}>Message</button>
    //           </div>
    //           <div className=' hidden pt-[30px] space-y-[32px] lg:flex flex-col overflow-y-scroll h-[520px]'>
    //             {mockUsers.map(u => {
    //               return <button key={u.uid} className="p-[10px] w-[50%] mx-auto">{u.user}</button>
    //             })}
    //           </div>
    //           {!isOpen ? <div className='lg:hidden pt-[30px] space-y-[32px] flex flex-col overflow-y-scroll h-[360px]'>
    //             {mockUsers.map(u => {
    //               return <button key={u.uid} className="p-[10px] w-[50%] mx-auto" onClick={() => { setIsOpen(true) }}>{u.user}</button>
    //             })}
    //           </div> :
    //             <div className='pt-[30px] lg:hidden space-y-[32px] flex flex-col overflow-y-scroll h-[360px] pl-[30px] pb-[20px]'>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //             </div>
    //           }
    //         </div>
    //         <div className='h-[15%] w-full lg:w-[93%]  lg:hidden bg-white  drop-shadow-md flex items-center mt-[20px]'>
    //           <input
    //             className="text-[14px] pl-[30px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //             type="text"
    //             {...register("message", { required: true })}
    //           />
    //           <button className='w-[30%] lg:w-[10%] mx-auto h-[30px] mr-[10px] text-white bg-purple rounded-lg  '>
    //             Send
    //           </button>
    //         </div>
    //       </div>
    //       <div id="mobile" className='hidden lg:w-[70%] lg:block '>
    //         <div className=' h-[85%] '>
    //           <div className='h-[95%] bg-white rounded-3xl drop-shadow-md  px-[20px]'>
    //             <div className='h-[15%] w-[90%] mx-auto border-b-[1.5px] px-[20px] flex items-center'>
    //               Blaine Cottrell
    //             </div>
    //             <div className='overflow-y-scroll h-[400px]'>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //               <p>Blaine Cottrell</p>
    //             </div>
    //           </div>
    //         </div>
    //         <div className='h-[15%] bg-white rounded-3xl drop-shadow-md flex items-center'>
    //           <input
    //             className="text-[14px] pl-[30px]  mt-[6px]  rounded w-[90%] py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    //             type="text"
    //             {...register("message", { required: true })}
    //           />
    //           <button className='w-[8%] mx-auto h-[30px] text-white bg-purple rounded-lg  '>
    //             Send
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </main>}
    // </div>
  )
}

export default Chat