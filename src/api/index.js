import request from "@/utils/request"
// 分别暴露出去,这种写法带括号了,所以要return,如果一行代码不用{},可以直接省略return
export const reqCategoryList=()=>{
  return request({
    url:'/product/getBaseCategoryList',
    method:'get'
  })
}

