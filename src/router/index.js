import Vue from 'vue'
import VueRouter from 'vue-router'
// vue-router的use可以在main.js中进行,但是vuex则绝对不可以,必须先use在创建new Vuex.Store()
Vue.use(VueRouter)
// 引入需要的组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'

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
  routes:[
    {
      path:'/home',
      component:Home
    },
    {
      path:'/search/:keyword?',
      name:'search',
      component:Search
    },    
    {
      path:'/login',
      component:Login,
      meta:{isHidden:true}
    },    
    {
      path:'/register',
      component:Register,
      meta:{isHidden:true}

    },
    // 配置重定向路由
    {
      path:'/',
      redirect:'/home'
    }
  ]
})
export default router