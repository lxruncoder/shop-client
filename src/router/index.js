
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
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
// 全局前置导航守卫,用来对token进行校验(根据token获取用户的信息)
router.beforeEach(async (to,from,next)=>{
  // 获取用户的token
  const token = store.state.user.token
  // 获取用户的信息,这里不要用对象判断,因为空对象也为true
  const userInfo = store.state.user.userInfo.name
  if(token) {
    // 登陆过如果还去登陆页面,就不让去了,就去首页
    if(to.path === '/login') {
      next('/') // 注意next后的代码会执行
      // 如果不是去登陆页面去判断用户是否有信息
    }else {
      // 如果登陆并且有用户信息,无条件放行
      if(userInfo) {
        next()
      }else {
        // 用户已经登陆了,但是没有获取用户的信息
        try {
          await store.dispatch('getUserInfo')
          // 获取用户信息成功无条件放行
          next()
        } catch (error) {
          // 获取用户信息失败,代表token可能过期,将用户的过期token清理掉,重新跳转到登陆页
          store.dispatch('clearToken')
          next('/login')
        }
      }
    }
  }else {
    // 没有登陆先放行
    // 追加后续操作:如果没有登陆就交易,支付,个人中心相关的页面,让其去登陆,去其他可以
    const targetPath = to.path
    if(targetPath.indexOf('/trade') !== -1 || targetPath.indexOf('pay') !== -1 || targetPath.startsWith('/center')) {
      // 并且在去往登陆页面的时候,将之前要去的位置带过去,那么登陆后直接跳转到之前要去的位置
      next(`/login?targetPath=${targetPath}`)
    }else {
      // 去其他页面可以放行
      next()
    }
  }
})

// 可以通过全局后置导航守卫设置网页的标题
router.afterEach((to,from)=>{
  document.title = to.meta.title || '尚品汇'
})
export default router