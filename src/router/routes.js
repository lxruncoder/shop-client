// 引入需要的组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'

export default [
  {
    path:'/home',
    component:Home,
    meta:{title:'首页'}
  },
  {
    path:'/search/:keyword?',
    name:'search',
    component:Search,
    meta:{title:'搜索'}

  },    
  {
    path:'/login',
    component:Login,
    meta:{isHidden:true},
    meta:{title:'登陆'}

  },    
  {
    path:'/register',
    component:Register,
    meta:{isHidden:true,title:'注册'}

  },
  {
    path:'/detail/:skuId',
    name:'detail',
    component:Detail,
    meta:{title:'详情'}

  },
  {
    path:'/addcartsuccess',
    component:AddCartSuccess,
    meta:{title:'添加购物车成功'}

  },
  {
    path:'/shopcart',
    component: ShopCart,
    meta:{title:'我的购物车'}

  },
  {
    path:'/trade',
    component:Trade,
    meta:{title:'订单页面'}
  },
  {
    path:'/pay',
    component:Pay,
    meta:{title:'支付页面'}
  },
  {
    path:'/paysuccess',
    component:PaySuccess,
    meta:{title:'支付成功页面'}
  },
  {
    path:'/center',
    component:Center,
    meta:{title:'个人中心'}
  },
  // 配置重定向路由
  {
    path:'/',
    redirect:'/home'
  }
]