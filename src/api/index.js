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
