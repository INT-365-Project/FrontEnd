import React from 'react'
import Popup from '../common/Popup'

const PopupImage = ({url,setShowPreviewImage}) => {
  return (
    <Popup  isChat={false} >
        <img src={url} className="w-full h-full" alt="image" />
        <img src="/images/X.png" className='absolute top-[-10px] right-[-10px] cursor-pointer' onClick={()=>setShowPreviewImage(false)} alt="x" />
    </Popup>
  )
}

export default PopupImage