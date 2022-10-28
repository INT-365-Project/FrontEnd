import React from 'react'
import Popup from '../common/Popup'

const PopupImage = ({url,setShowPreviewImage,showPreviewImage}) => {
  return (
    <Popup  isChat={false} >
        <img src={url} className="w-full h-full" alt="image" />
        {showPreviewImage && <img src="/images/X.png" className='absolute top-[-10px] right-[-10px] cursor-pointer' onClick={()=>setShowPreviewImage(false)} alt="x" />}
    </Popup>
  )
}

export default PopupImage