import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/common/Layout";
import "../styles/globals.scss";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Router, { useRouter } from "next/router";
const AppContext = createContext(null);
export function useAppContext() {
  return useContext(AppContext)
}
function MyApp({ Component, pageProps }: AppProps) {
  const [adminUser, setAdminUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // console.log(pId)
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setAdminUser(user)
      setIsLogin(true)
    }
  }, [router])

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    console.log(JSON.parse(localStorage.getItem("user")))
    /* isLogin == true */
    if (router.pathname == '/') {
      if (!user) {
        Router.push('/signin')
      } else {
        Router.push('/')
      }
    }
    if (router.pathname == '/report') {
      if (!user) {
        Router.push('/signin')
      } else {
        Router.push('/report')
      }
    }
    if (router.pathname == '/chat') {
      if (!user) {
        Router.push('/signin')
      } else {
        Router.push('/chat')
      }
    }
    if (router.pathname == '/intents') {
      if (!user) {
        Router.push('/signin')
      } else {
        Router.push('/intents')
      }
    }
    /* isLogin == false*/
    if (router.pathname == "/news") {
      Router.push('/news')
    }
    if (router.pathname == "/form") {
      Router.push("/form")
    }
  }, [isLogin])




  return (
    <>
      <AppContext.Provider value={{ adminUser, isLogin, setIsLogin }}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>SIT-CHATBOT</title>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppContext.Provider>
    </>

  );
}

export default MyApp;


export async function getServerSideProps() {
  const pId = JSON.parse(localStorage.getItem("pId"));
  return {
      props: {pId},
  };
}