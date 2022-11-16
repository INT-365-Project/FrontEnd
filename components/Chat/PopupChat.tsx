import React, { useState } from "react";
import Popup from "../common/Popup";
import { emojis } from "../../utils/emojis"
import { stickers } from "../../utils/stickers"
const PopupChat = ({
  base64,
  setBase64,
  chatId,
  sendPrivateValue,
  sticker,
  setSticker,
  setEmoji,
  emoji,
  userData,
  setUserData,
  imgSrc,
  setImgSrc,
  setSelectedImage,
  selectedImage,
  setOpenPopup,
  isHasEmoji,
  setIsHasEmoji,
  isHasImage,
  setIsHasImage,
  isHasSticker,
  setIsHasSticker,
}) => {

  const [emojiArray, setEmojiArray] = useState(emojis)
  const [stickersArray, setStickersArray] = useState(stickers)
  const uploadImage = (e: any) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    let endCode64 = null;
    reader.onloadend = function () {
      endCode64 = reader.result;
      // console.log(file.name.slice(file.name.length-3,file.name.length))
      setBase64(reader)
      setSelectedImage(true);
      setImgSrc(endCode64)
      // setBase64(endCode64.slice(
      //   endCode64.indexOf(",") + 1,
      //   endCode64.length - 1
      // ),)

    };
    reader.readAsDataURL(file);
  };

  const emojiCategory = ["All", ...emojiArray.map((item) => item.productId)]
  const emojiCategoryImage = []
  const allEmojiCategories = emojiCategory.filter(
    (q, idx) => emojiCategory.indexOf(q) === idx
  );
  if (allEmojiCategories) {
    for (let i = 0; i < allEmojiCategories.length; i++) {
      const data = {
        src: '001',
        productId: allEmojiCategories[i]
      }
      emojiCategoryImage.push(data)
    }
    // console.log(emojiCategoryImage)
  }

  const stickersCategory = ["All", ...stickers.map((item) => item.packageId)];
  const allCategories = stickersCategory.filter(
    (q, idx) => stickersCategory.indexOf(q) === idx
  );

  const [stickersItem, setStickersItem] = useState(stickers);
  const [emojiItem, setEmojiItem] = useState(emojis)
  const filter = (button: any) => {
    // console.log(button);
    if (button === "All") {
      setStickersItem(stickers);
      return;
    }
    const filteredData = stickers.filter((item) => item.packageId === button);
    // console.log(filteredData);
    setStickersItem(filteredData);
  };
  const filterEmoji = (button: any) => {
    // console.log(button);
    if (button === "All") {
      setEmojiItem(emojis);
      return;
    }
    const filteredData = emojis.filter((item) => item.productId === button);
    // console.log(filteredData);
    setEmojiItem(filteredData);
  };

  return (
    <Popup isImage={false} isChat={true} >
      <div className="w-full">
        <div className="bg-[#53a1f0] h-[56px] flex items-center">
          {isHasImage &&
            <label
              className="p-2 ml-[10px] bg-white text-black rounded-[10px] text-[18px]"
            >
              เลือกรูปภาพจากคลังของคุณ
            </label>
          }
          {isHasSticker &&
            allCategories.map((categories, index) => {
              return (
                <button
                  key={index}
                  onClick={() => filter(categories)}
                  className="p-2 ml-[10px] bg-white text-black rounded-[10px] text-[18px]"
                >
                  {categories}
                </button>
              );
            })}
          {isHasEmoji &&
            allEmojiCategories.map((categories, index) => {
              return (
                <button
                  key={index}
                  onClick={() => filterEmoji(categories)}
                  className="p-2 ml-[10px] bg-white text-black rounded-[10px] text-[18px]"
                >
                  {index === 0 && categories}
                  {index !== 0 && <img src={`/emoji/${emojiCategoryImage[index].productId}/${emojiCategoryImage[index].src}.jpg`} className="w-[30px]" alt="emoji" />}
                </button>
              );
            })}
        </div>
        {isHasImage && (
          <div className="h-[490px] overflow-y-scroll flex flex-col items-center justify-center">
            <div className="border-dashed border-[2px] w-[260px] min-h-[220px] flex items-center flex-col justify-center">
              <label htmlFor="inputFileToLoad">
                {!selectedImage ?
                  <img
                    src={`${"images/upload.png"}`}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                  :
                  <img
                    src={imgSrc}
                    alt="Thumb"
                    className="mx-auto cursor-pointer w-full"
                  />
                }
                <input
                  className="mt-[20px] hidden"
                  id="inputFileToLoad"
                  accept="image/*"
                  type="file"
                  onChange={uploadImage}
                />
              </label>
              <label htmlFor="inputFileToLoad" className="text-[12px] text-[#919191] flex justify-center pt-[10px] cursor-pointer">
                คลิก เลือกรูปภาพ เพื่ออัพโหลดรูปภาพ
              </label>
            </div>
            <div className="flex justify-center pt-[20px] space-x-4">
              {!selectedImage ? <label htmlFor="inputFileToLoad" className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-[#53a1f0] rounded-[5px] text-white`}>
                เลือกรูปภาพ
              </label> :
                <button onClick={() => {
                  sendPrivateValue(chatId,{type:'image',message:imgSrc})
                  // console.log({type:'image',message:base64})
                  setSelectedImage(false)
                  setIsHasImage(false);
                  setOpenPopup(false)
                }} className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-green-600 rounded-[5px] text-white`}>
                  ยืนยัน
                </button>
              }
              {selectedImage && <button onClick={() => {
                setImgSrc(null)
                setSelectedImage(false)
              }} className={`w-[105px] h-[30px] mb-[30px] cursor-pointer flex justify-center items-center  bg-red-600 rounded-[5px] text-white`}>
                ลบรูปภาพ
              </button>}
            </div>
          </div>
        )}
        {isHasSticker && (
          <div className=" h-[490px] overflow-y-scroll">
            <div className="grid grid-cols-4 pt-[20px] gap-6 pl-[40px]">
              {isHasSticker &&
                stickersItem.map((sticker, index) => {
                  return (
                    <div key={index} onClick={() => {
                      setSticker(sticker)
                      sendPrivateValue(chatId, sticker)
                      setIsHasSticker(false)
                      setOpenPopup(false)
                    }}>
                      <button>
                        {sticker.packageId === "446" ? <img
                          src={`/sticker/${sticker.packageId}/${sticker.stickerId}.png`}
                          alt="sticker"
                        /> :
                          <img
                            src={`/sticker/${sticker.packageId}/${sticker.stickerId}.jpg`}
                            alt="sticker"
                          />
                        }
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        {isHasEmoji && (
          <div className=" h-[490px] overflow-y-scroll">
            <div className="grid grid-cols-6 pt-[20px] gap-6 pl-[30px]">
              {isHasEmoji &&
                emojiItem.map((emoji, index) => {
                  return (
                    <div key={index}  onClick={() => {
                      setEmoji(oldEmoji => [...oldEmoji, emoji])
                      setUserData({ ...userData, message: `${userData.message}<img src="/emoji/${emoji.productId}/${emoji.emojiId}.jpg" alt="emoji">`})
                      setIsHasEmoji(false)
                      setOpenPopup(false)
                    }}>
                      <button>
                        <img
                          src={`/emoji/${emoji.productId}/${emoji.emojiId}.jpg`}
                          alt="sticker"
                        />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
        <button
          onClick={() => {
            setSelectedImage(false);
            setImgSrc(null);
            setIsHasSticker(false);
            setIsHasEmoji(false);
            setIsHasImage(false);
            setOpenPopup(false);
          }}
          className="bg-[#53a1f0] ml-[10px] flex items-center p-2 rounded-[10px] text-white"
        >
          Close
        </button>
      </div>
    </Popup>
  );
};

export default PopupChat;
