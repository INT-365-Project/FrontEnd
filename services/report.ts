import { api } from "../config";
import axios from "axios";
let getToken = null
if (typeof window !== 'undefined'){
  getToken = localStorage.getItem('accessToken') 
}
let token = 'Bearer '+ getToken
const ReportService = axios.create({
  baseURL:`${api}`
})

const ReportServices = {
  getReport:()=> ReportService.get("/reports"),
  getReportById:(slug:any)=> ReportService.get(`/reports/`,{params:{reportId:slug}}),
  storeReport:(data:{topic:string;description:string})=>
  ReportService.post("/reports/createReport",data)
}

export default ReportServices;