import React from 'react'
import { Navbar } from './Navbar';
import Sidebar from './Sidebar';
interface Props {
  children: JSX.Element;
}
const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
     {/* <Navbar /> */}
     <Sidebar/>
     <div className='relative'>
        {children}
     </div>
    </>
  )
}

export default Layout