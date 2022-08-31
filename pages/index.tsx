import Head from 'next/head'
import InsiderNews from '../components/InsiderNews'
import Logs from '../components/Logs'
import Reports from '../components/Reports'
import { useAppContext } from './_app'


export default function Home() {
  const {adminUser} = useAppContext()
  return (
    <>
    {<div className=" bg-[#F8F8F8] lg:px-0 lg:pl-[130px] pt-[80px] lg:pt-[120px]  w-full ">
    <Head>
      <title>Dashboard</title>
      <meta name="Dashboard" content="Dashboard" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className='min-h-screen relative w-full'>
      <div className='w-full '>
        <div className='w-full min-h-screen flex flex-col lg:flex-row'>
          <div className='lg:w-[75%]'>
          <div>
                <Reports/>
            </div>
            <div className='h-[60%] mt-[20px]'>
            <InsiderNews/>
            </div>
          </div>
          <div className='lg:ml-[24px] w-full '>
          <Logs/>
          </div>
        </div> 
      </div> 
    </main>
    </div>}
    </>
  )
}
