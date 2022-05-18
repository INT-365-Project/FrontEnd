import Head from 'next/head'
import React from 'react'
import Logs from '../components/Logs'
import News from '../components/News'
import Reports from '../components/Reports'

const Dashboard = () => {
  return (
    <div className="pl-[30px]  lg:pl-[130px] pt-[80px] lg:pt-[40px] lg:pr-[50px] w-full ">
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
        <div className='w-full pt-[30px]  min-h-screen flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[50%]'>
            <div className='h-[64%]'>
                <Logs/>
            </div>
            <div className='h-[36%]'>
                <Reports/>
            </div>
          </div>
          <div className='block h-auto lg:hidden '>
          <News/>
          </div>
          <div className='hidden lg:block w-[50%] '>
          <News/>
          </div>
        </div> 
      </div> 
    </main>
    </div>
  ) 
}

export default Dashboard