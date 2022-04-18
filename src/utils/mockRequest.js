import axios from 'axios'
import nprogress from 'nprogress'
const request = axios.create({
  baseURL:'/mock',
  timeout: 2000
})
request.interceptors.request.use((config)=>{
  // 给服务器添加额外的请求头信息,就必须使用请求拦截器
  nprogress.start()
  return config
})
request.interceptors.response.use(
  // 响应成功的情况
  response=>{
    nprogress.done()
    return response.data
  },
  // 响应失败的情况
  error=>{
    nprogress.done()
    alert('发送ajax请求发生错误' + error.message || '未知错误')
    return new Promise(()=>{})
  }
)
export default request