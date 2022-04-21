import Vue from 'vue'
import VueRouter from 'vue-router'
// vue-router的use可以在main.js中进行,但是vuex则绝对不可以,必须先use在创建new Vuex.Store()
Vue.use(VueRouter)



// 模块化之后引入路由配置
import routes from './routes'

const originPush = VueRouter.prototype.push
const originReplace = VueRouter.prototype.replace
// 在调用方法的时候,this.$router返回的是一个VueRouter的实例化对象,push和replace方法在VueRouter的原型对象身上,调用push方法返回的是一个promise实例对象,实例对象调用方法,this就是实例对象
VueRouter.prototype.push = function(location,onResolve,onReject){
  if(onResolve && onReject) {
    return originPush.call(this,location).then(onResolve,onReject)
  }else {
    return originPush.call(this,location).then(()=>{},()=>{})
  }
}
VueRouter.prototype.replace = function(location,onResolve,onReject){
  if(onResolve && onReject) {
    return originReplacecall(this,location).then(onResolve,onReject)
  }else {
    return originReplace.call(this,location).then(()=>{},()=>{})
  }
}

const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部,这里官网写的是top,但是这里top不好使,可能跟vuerouter的版本有关系
    return { y: 0 }
  },
  routes
})
export default router