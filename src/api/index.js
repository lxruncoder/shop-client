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
