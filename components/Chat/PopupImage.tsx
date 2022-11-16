import React from 'react'
import Popup from '../common/Popup'

const PopupImage = ({url,setShowPreviewImage,showPreviewImage}) => {
  return (
    <Popup isImage={true} isChat={false} >
        <img src={url} className="w-full h-full object-contain" alt="image" />
        {showPreviewImage && <img src="/images/X.png" className='absolute top-[-10px] right-[-10px] cursor-pointer' onClick={()=>setShowPreviewImage(false)} alt="x" />}
        <div className='pt-[8px]'>
          <button>
            Open original 
          </button>
        </div>
    </Popup>
  )
}

export default PopupImage