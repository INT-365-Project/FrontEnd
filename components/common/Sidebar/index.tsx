import React, { useEffect, useState } from 'react'
import { useNavContext } from '../Layout';
import Content from '../Sidebar/Content'

const Sidebar = () => {
  const { isOpen, setIsOpen } = useNavContext();
  return (
    <nav  id="sidebar" className={` overflow-hidden`} >
      <Content isOpen={isOpen} setIsOpen={setIsOpen}  />
    </nav>
  )
}

export default Sidebar