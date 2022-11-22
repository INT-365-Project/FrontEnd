import { useEffect, useState } from "react";
import NewsServices from "../services/news";
const useFetch = (path:any) =>{
  const [newsData, setNewsData] = useState(null);
  const [isFinish, setIsFinish] = useState(false);
  const [errors, setErrors] = useState(null);
  const [isConvert, setIsConvert] = useState(false);
  useEffect(() => {
    let timer1 = setTimeout(() => {
      NewsServices.getNews()
        .then((res) => {
          setIsFinish(true);
          setNewsData(res.data.responseData);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }, 500);
    return () => {
      clearTimeout(timer1);
      setIsConvert(false);
    };
  }, []);

  return [newsData,isFinish,errors]
}
export default useFetch;