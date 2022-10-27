import { api } from "../config";
import axios from "axios";
let getToken = null
if (typeof window !== 'undefined') {
  getToken = localStorage.getItem('accessToken')
}
let token = 'Bearer ' + getToken

const botService = axios.create({
  baseURL: ``
})

const BotServices = {
  storeCommand: (data:any) =>botService.post("/api/bot/createOrUpdateBot", data, { headers: { Authorization: token } }),
  getAllBot: () =>botService.get("/api/bot/getAllBot",{ headers: { Authorization: token } }),
  getAllTopic:()=>botService.get("/api/bot/getAllTopic",{ headers: { Authorization: token } })
}

export default BotServices;