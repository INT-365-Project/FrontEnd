import { useRouter } from 'next/router';
import React, { createContext, useContext, useState } from 'react'
import Footer from './Footer';
import Sidebar from './Sidebar';
interface Props {
  children: JSX.Element;
}
const NavContext = createContext(null);
export function useNavContext(){
  return useContext(NavContext)
}
const Layout: React.FC<Props> = ({ children }) => {
  const {pathname} = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <>
    <NavContext.Provider value={{isOpen,setIsOpen}}>
     {pathname != "/signin" && <Sidebar/>}
     <div onClick={()=>setIsOpen(true)} className='relative'>
        {children}
     </div>
     {pathname != "/signin" &&  <Footer/>}
    </NavContext.Provider>
    </>
  )
}

export default Layout
