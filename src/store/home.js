import { reqCategoryList,reqBannerList,reqFloorList } from "@/api"
const state = {
  categoryList:[],
  bannerList:[],
  floorList:[]
}
const mutations = {
  RECEIVE_CATEGORYLIST(state,categoryList){
    state.categoryList = categoryList
  },
  RECEIVE_BANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },
  RECEIVE_FLOORLIST(state,floorList){
    state.floorList = floorList
  }
}
const actions ={
  // 获取三级分类的数据
  async getCategoryList({commit}){
    const result = await reqCategoryList()
    if(result.code === 200){
      commit('RECEIVE_CATEGORYLIST',result.data)
    }
  },
  // 获取banner的数据
  async getBannerList({commit}){
    const result = await reqBannerList()
    if(result.code === 200) {
      commit('RECEIVE_BANNERLIST',result.data)
    }
  },
  // 获取floor的数据
  async getFloorList({commit}) {
    const result = await reqFloorList()
    if(result.code === 200) {
      commit('RECEIVE_FLOORLIST',result.data)
    }
  }
}
const getters = {}
export default {
  // namespaced:true,
  state,mutations,actions,getters
}