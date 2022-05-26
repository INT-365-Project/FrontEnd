import { useRouter } from 'next/router';
import React, { createContext, useContext, useMemo, useState } from 'react'
import { useAppContext } from '../../pages/_app';
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
  const { adminUser, isLogin, setIsLogin } = useAppContext();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  let isSignin = useMemo(() => {
    if (router.pathname === "/signin") {
      return true;
    } else {
      return false;
    }
  }, [router]);

  let isAdmin = useMemo(()=>{
    if (adminUser) {
      return true;
    } else {
      return false;
    }
  },[])

  let isReport = useMemo(() => {
    if (router.pathname === "/report") {
      return true;
    } else {
      return false;
    }
  }, [router]);
  
  let isChat = useMemo(() => {
    if (router.pathname === "/chat") {
      return true;
    } else {
      return false;
    }
  }, [router]);

  let isNews = useMemo(() => {
    if (router.pathname === "/news") {
      return true;
    } else {
      return false;
    }
  }, [router]);

  let isHome = useMemo(() => {
    if (router.pathname === "/") {
      return true;
    } else {
      return false;
    }
  }, [router]);

  return (
    <>
    <NavContext.Provider value={{isOpen,setIsOpen}}>
     { isLogin && <Sidebar/>}
     <div onClick={()=>setIsOpen(true)} className='relative'>
        {children}
     </div>
     {isSignin || !isReport  || isChat&&  "/signin" &&  <Footer/>}
    </NavContext.Provider>
    </>
  )
}

export default Layout
