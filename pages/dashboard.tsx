import Head from 'next/head'
import React from 'react'
import Logs from '../components/Logs'
import News from '../components/News'
import Reports from '../components/Reports'

const Dashboard = () => {
  return (
    <div className="container lg:pl-[100px] pt-[80px] lg:pt-[40px] lg:pr-[40px] w-full ">
    <Head>
      <title>Dashboard</title>
      <meta name="Dashboard" content="Dashboard" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className='min-h-screen relative w-full'>
      <div className='w-full '>
        <div>
        <h1 className='title'>
          Dashboard
        </h1>
        <h2 className='breadcrumb'>
          <a>Home</a> | Dashboard
        </h2> 
        </div>
        <div className='w-full bg-purple-300 min-h-screen flex'>
          <div className='w-[50%] bg-green-300'>
            <div className='h-[70%]'>
                <Logs/>
            </div>
            <div className='h-[30%]'>
                <Reports/>
            </div>
          </div>
          <div className='w-[50%] bg-red-300'>
          <News/>
          </div>
        </div>  
        {/* <div className='pt-[30px] flex justify-between'>
        <div className='h-[50vh]'><Logs/></div>
        <div className=''><News/></div>
        </div>
        <div className=''><Reports/></div> */}
      </div> 
    </main>
    </div>
  ) 
}

export default Dashboard