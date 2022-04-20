import { reqSearchInfo } from "@/api"
const state = {
  searchInfo: {}
}
const mutations = {
  RECEIVE_SEARCHINFO(state,searchInfo){
    state.searchInfo = searchInfo
  }
}
const actions = {
  // searchParams是用户传递的数据,如果没有传递数据,则这里就默认是一个空对象,参数必须至少是一个空对象,接口需要
  async getSearchInfo({commit},searchParams={}){
    const result = await reqSearchInfo(searchParams)
    if(result.code === 200) {
      commit('RECEIVE_SEARCHINFO',result.data)
    }
  }
}
// state中的searchInfo是一个对象类型,需要使用里面的数组,用mapState获取后,直接使用起来需要searchInfo.goodsList,比较麻烦,使用getters简化数,那么在使用的时候
// 使用mapGetters得到就可以直接使用
// 理解为什么使用[]
const getters = {
  goodsList(state) {
    return state.searchInfo.goodsList || []
  },
  attrsList(state) {
    return state.searchInfo.attrsList || []
  },
  trademarkList (state) {
    return state.searchInfo.trademarkList || []
  }
}
export default {
  state,mutations,actions,getters
}