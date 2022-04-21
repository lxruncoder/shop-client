import { reqAddOrUpdateShopCart,reqCartList,reqIsChecked,reqDeleteShopCart } from "@/api";

const state = {
  cartList:[]
};
const mutations = {
  RECEIVE_CARTLIST(state,cartList){
    state.cartList = cartList
  }
};
const actions = {
  // 添加购物车不需要存储数据,只需要发送请求,所以只有actions,而且actions中的方法只能收到第二个参数,所以需要放在对象中
  async addShopCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateShopCart(skuId, skuNum);
    if (result.code === 200) {
      return "ok";
    } else {
      // 不能让该函数返回的Promise永远成功,所以手动返回一个失败状态的Promise,那么async函数返回的Promise实例状态就是失败的,失败的原因就是该Promise实例失败的原因
      return Promise.reject(new Error('failed'));
    }
  },
  // 获取购物车信息
  async getCartList({commit}) {
    const result = await reqCartList()
    if(result.code === 200) {
      commit('RECEIVE_CARTLIST',result.data)
    }
  },
  // 取消购物车的选中状态
  async updateIsChecked({commit},{skuId,isChecked}){
    const result = await reqIsChecked(skuId,isChecked)
    if(result.code === 200) {
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 全选或者全不选,正常应该是有一个接口,这里没有全选和全部选的接口,所以采用promise.all来实现
  updateIsCheckedAll({getters,commit,dispatch},isChecked) {
    const promises = []
    // 通过getters拿到数据,假报错因为不是正的错,这里拿到了之后,没有.而是forEach就算有假报错的可能也不会假报错
    getters.cartList.cartInfoList.forEach(item=>{
      if(item.isChecked === isChecked) return // 如果状态一样就不需要改变,我为1,想让请你们都为1,但是你们都是1了就不用改变了
      // 
      const promise = dispatch('updateIsChecked',{skuId:item.skuId,isChecked})
      promises.push(promise)
    })
    return Promise.all(promises)
  },
  // 删除购物车信息
  async deleteShopCart({commit},skuId){
    const result = await reqDeleteShopCart(skuId)
    if(result.code === 200) {
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 删除选中的购物车信息
  deleteShopCartChoice({getters,dispatch}){
    const promises = []
    getters.cartList.cartInfoList.forEach(item=>{
      if(!item.isChecked) return
      const promise = dispatch('deleteShopCart',item.skuId)
      promises.push(promise)
    })
    return Promise.all(promises)
  }
};


const getters = {
  cartList(state) { 
    // 如果数组数据没有得到则空数组的0索引为undefined,避免假报错
    return state.cartList[0] || {}
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
