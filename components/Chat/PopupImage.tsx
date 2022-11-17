import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Popup from '../common/Popup'

const PopupImage = ({url,setShowPreviewImage,showPreviewImage}) => {
  const openInNewTab = (url:any) =>{
    window.open(url, '_blank', 'noopener,noreferrer');
  }
 
  return (
    <Popup isImage={true} isChat={false} >
        <img src={url} className="w-full h-full object-contain" alt="image" />
        {showPreviewImage && <img src="/images/X.png" className='absolute top-[-10px] right-[-10px] cursor-pointer' onClick={()=>setShowPreviewImage(false)} alt="x" />}
        <div className='pt-[6px]'>
          <button className='text-white hover:text-white/70 hover:underline' onClick={() => openInNewTab(url)}>
            Open original 
          </button>
        </div>
    </Popup>
  )
}

export default PopupImage