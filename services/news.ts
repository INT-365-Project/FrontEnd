import { api } from "../config";
import axios from "axios";
let getToken = null
if (typeof window !== 'undefined') {
  getToken = localStorage.getItem('accessToken')
}
let token = 'Bearer ' + getToken

const NewsService = axios.create({
  baseURL: `www.chatbotwebapp.ninja`
})



const NewsServices = {
  sendPathImage: (filePath: any) =>
    NewsService.post("/api/viewFileByPath", filePath),
  getNews: () => NewsService.get("/api/news"),
  getNewsById: (slug: any) => NewsService.get(`/api/news/`, { params: { newsId: slug } }),
  removeNewsById: (slug: any) => NewsService.delete('/api/news/deleteNews/', {
    headers: {
      Authorization: token
    },
    params: {
      newsId: slug
    }
  }),
  storeNews: (data: { title: string; detail: string; thumbnailPath: string; thumbnailFile: string; thumbnailFileName: string }) =>
    NewsService.post("/api/news/createOrUpdateNews", data, { headers: { Authorization: token } })
}

export default NewsServices;