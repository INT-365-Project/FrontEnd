import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/common/Layout";
import "../styles/globals.scss";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>SIT-CHATBOT</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
