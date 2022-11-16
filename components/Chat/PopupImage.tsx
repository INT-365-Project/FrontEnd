import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Popup from '../common/Popup'

const PopupImage = ({url,setShowPreviewImage,showPreviewImage}) => {
  const [image,setImage] = useState("")

  useEffect(()=>{
    axios.get(url,{responseType: 'blob'}).then((response)=>{
      // var objectUrl = URL.createObjectURL(response.data)
      // const new_blob = new Blob( [ response.data ], { type: 'image/png' } );
      const url = URL.createObjectURL( response.data );
      // console.log(new_blob)
      console.log(url)
      setImage(url)
      // console.log('object url',objectUrl)
    })
  },[])
  return (
    <Popup isImage={true} isChat={false} >
        <img src={image} className="w-full h-full object-contain" alt="image" />
        {showPreviewImage && <img src="/images/X.png" className='absolute top-[-10px] right-[-10px] cursor-pointer' onClick={()=>setShowPreviewImage(false)} alt="x" />}
        <div className='pt-[8px]'>
          {/* <button onClick={()=>openImage()}> */}
            {/* Open original  */}
          {/* </button> */}
        </div>
    </Popup>
  )
}

export default PopupImage