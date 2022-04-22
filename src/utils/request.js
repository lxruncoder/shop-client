import axios from 'axios'
import nprogress from 'nprogress'

// 引入store
import store from '@/store'
const request = axios.create({
  baseURL:'/api',
  timeout: 2000
})
request.interceptors.request.use((config)=>{
  // 给服务器添加额外的请求头信息,就必须使用请求拦截器
  nprogress.start()
  // 获取临时标识，有就添加上，每次请求都携带这个标识，那么后台就能知道是该用户在发送请求
  // 临时标识的请求头是userTempId，这个是服务器规定的,并且要保证标识的唯一性,所以将数据存在本地
  if(store.state.user.userTempId) {
    config.headers.userTempId = store.state.user.userTempId
  }
  // 如果有token携带token
  if(store.state.user.token) {
    config.headers.token = store.state.user.token
  }
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