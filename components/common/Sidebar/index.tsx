import React, { useEffect, useState } from 'react'
import { useNavContext } from '../Layout';
import Content from '../Sidebar/Content'

const Sidebar = () => {
  const [style, setStyle] = useState({ display: "none" });
  const [image, setImage] = useState({ width: "100%" });
  const { isOpen, setIsOpen } = useNavContext();
  useEffect(() => {
    if (isOpen === false) {
      setStyle({ display: "block" });
      setImage({ width: "40%" });
    } else {
      setStyle({ display: "none" });
      setImage({ width: "100%" });
    }
  }, [isOpen]);
  return (
    <nav  id="sidebar" className={` overflow-hidden`} onMouseEnter={() => {
      setStyle({ display: "block" });
      setImage({ width: "40%" });
    }}
    onMouseLeave={() => {
      setStyle({ display: "none" });
      setImage({ width: "100%" });
    }}>
      <Content isOpen={isOpen} setIsOpen={setIsOpen} style={style} image={image} />
    </nav>
  )
}

export default Sidebar