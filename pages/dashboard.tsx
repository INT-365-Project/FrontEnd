import Head from 'next/head'
import React from 'react'

const Dashboard = () => {
  return (
    <div className="container lg:pl-[100px] pt-[20px] lg:pt-[40px] lg:pr-[40px]">
    <Head>
      <title>Dashboard</title>
      <meta name="Dashboard" content="Dashboard" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className='min-h-screen'>
        <h1 className='title'>
          SIT-CHATBOT Dashboard
        </h1>
        <h2 className='breadcrumb'>
          <a>Home</a>
        </h2> 
        
    </main>
    <main className='min-h-screen'>
        <h1 className='title'>
          SIT-CHATBOT Dashboard
        </h1>
        <h2 className='breadcrumb'>
          <a>Home</a>
        </h2> 
        
    </main>
    </div>
  ) 
}

export default Dashboard