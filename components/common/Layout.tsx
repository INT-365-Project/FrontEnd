import React, { createContext, useContext, useState } from 'react'
import Sidebar from './Sidebar';
interface Props {
  children: JSX.Element;
}
const NavContext = createContext(null);
export function useNavContext(){
  return useContext(NavContext)
}
const Layout: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  return (
    <>
    <NavContext.Provider value={{isOpen,setIsOpen}}>
     <Sidebar/>
     <div onClick={()=>setIsOpen(true)} className='relative'>
        {children}
     </div>
    </NavContext.Provider>
    </>
  )
}

export default Layout
