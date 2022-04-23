import request from "@/utils/request";
// 专门向mock请求数据的axios
import mockRequest from "@/utils/mockRequest";
// 分别暴露出去,这种写法带括号了,所以要return,如果一行代码不用{},可以直接省略return
export const reqCategoryList = () => {
  return request({
    url: "/product/getBaseCategoryList",
    method: "get",
  });
};
// 获取mock模拟的数据
export const reqBannerList = () => {
  return mockRequest({ url: "/banner", method: "get" });
};
export const reqFloorList = () => {
  return mockRequest({ url: "/floor", method: "get" });
};
// 搜索页面数据获取
export const reqSearchInfo = (searchParams) => {
  return request({ url: "/list", method: "post", data: searchParams });
};
// 获取详情数据
export const reqDetailInfo = (skuId) => {
  return request({ url: `/item/${skuId}`, method: "get" });
};
// 添加购物车
export const reqAddOrUpdateShopCart = (skuId, skuNum) => {
  return request({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });
};
// 点击去购物车结算之后,获取购物车的信息
export const reqCartList = ()=>{
  return request({url:'/cart/cartList',method:'get'})
}
// 修改购物车的选中状态:isChecked为1代表选中,为0代表取消选中
export const reqIsChecked = (skuId,isChecked)=>{
  return request({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})
}
// 删除购物车信息:注意请求方式为delete
export const reqDeleteShopCart=(skuId)=>{
  return request({url:`/cart/deleteCart/${skuId}`,method:'delete'})
}
// 点击获取注册的验证码
export const reqCode = (phone)=>{
  return request({url:`/user/passport/sendCode/${phone}`,method:'get'})
}
// 注册
export const reqUserRegister = (userInfo)=>{
  return request({url:'/user/passport/register',data:userInfo,method:'post'})
}
// 登陆
export const reqUserLogin = (userInfo)=>{
  return request({url:'/user/passport/login',data:userInfo,method:'post'})
}
// 根据token获取用户的信息
export const reqUserInfo = ()=>{
  return request({url:'/user/passport/auth/getUserInfo',method:'get'})
}
// 退出登陆
export const reqLogout=()=>{
  return request({url:'/user/passport/logout',method:'get'})
}
// 获取用户的地址
export const reqUserAddress = ()=>{
  return request({url:'/user/userAddress/auth/findUserAddressList',method:'get'})
}
// 获取订单交易页信息
export const reqTradeInfo=()=>{
  return request({url:'/order/auth/trade',method:'get'})
}
// 提交订单
export const reqSubmitOrder=(tradeNo,tradeInfo)=>{
  return request({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data:tradeInfo,method:'post'})
}
// 获取订单的支付信息
export const reqPayInfo = (orderId)=>{
  return request({url:`/payment/weixin/createNative/${orderId}`,method:'get'})
}
// 查询支付的状态
export const reqPayStutas = (orderId)=>{
  return request({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
}
// 获取我的订单列表
export const reqCenterList=(page,limit)=>{
  return request({url:`/order/auth/${page}/${limit}`,method:'get'})
}
