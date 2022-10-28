import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/common/Layout";
import "../styles/globals.scss";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import  Router ,{ useRouter } from "next/router";

const AppContext = createContext(null);
export function useAppContext(){
  return useContext(AppContext)
}
function MyApp({ Component, pageProps }: AppProps) {
  const [adminUser,setAdminUser] = useState(null);
  const [isLogin,setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      setAdminUser(user)
      setIsLogin(true)
    }
  },[router])

  useEffect(()=>{
    if(router.pathname=='/'){
      if(!isLogin){
        Router.push('/signin')
      }else{
        Router.push('/')
      } 
    }
    if(router.pathname=='/report'){
      if(!isLogin){
        Router.push('/signin')
      }else{
        Router.push('/')
      }
    }
    if(router.pathname =="/news"){
      router.push('/news')
    }
    if(router.pathname == "/form"){
      router.push("/form")
    }
    
    // if(router.pathname=='/chat'){
    //   if(!isLogin){
    //     Router.push('/signin')
    //   }else{
    //     Router.push('/')
    //   }
    // }
    // if(router.pathname=='/intents'){
    //   if(!isLogin){
    //     Router.push('/signin')
    //   }else{
    //     Router.push('/')
    //   }
      
    // }
  },[isLogin])


  

  return (
      <>
      <AppContext.Provider value={{adminUser,isLogin,setIsLogin}}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>SIT-CHATBOT</title>
      </Head>
      <Layout>
        <Component {...pageProps}/>
      </Layout>
      </AppContext.Provider>
      </>
  
  );
}

export default MyApp;
