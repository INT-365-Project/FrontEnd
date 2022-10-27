import { api } from "../config";
import axios from "axios";
let getToken = null
if (typeof window !== 'undefined'){
  getToken = localStorage.getItem('accessToken') 
}
let token = 'Bearer '+ getToken
const ReportService = axios.create({
  baseURL:`www.chatbotwebapp.ninja`
})

const ReportServices = {
  getReport:()=> ReportService.get("/api/reports"),
  getReportById:(slug:any)=> ReportService.get(`/api/reports/`,{params:{reportId:slug}}),
  storeReport:(data:{topic:string;description:string})=>ReportService.post("/api/reports/createReport",data)
}

export default ReportServices;