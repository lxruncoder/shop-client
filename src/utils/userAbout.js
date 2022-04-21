import { v4 as uuidv4 } from 'uuid';
export const getUserTempId = ()=>{
  let userTmepId = localStorage.getItem('USER_TEMP_ID')
  if(!userTmepId) {
    // 如果没有获取到就生成一个
    userTmepId = uuidv4()
    // 临时标识的请求头是userTempId，这个是服务器规定的,并且要保证标识的唯一性,所以将数据存在本地
    localStorage.setItem('USER_TEMP_ID',userTmepId)
  }
  // 最后将其返回
  return userTmepId
}