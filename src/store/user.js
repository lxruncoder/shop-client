import { getUserTempId } from "@/utils/userAbout"
// 当该vuex一加载就会自动发送请求获取临时标识
const state = {
  userTempId: getUserTempId()
}
const mutations = {}
const actions = {}
const getters = {}

export default {
  state,mutations,actions,getters
}