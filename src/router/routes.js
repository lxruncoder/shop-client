// 引入需要的组件
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'

export default [
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
  {
    path:'/detail/:skuId',
    name:'detail',
    component:Detail
  },
  {
    path:'/addcartsuccess',
    component:AddCartSuccess
  },
  {
    path:'/shopcart',
    component: ShopCart
  },
  // 配置重定向路由
  {
    path:'/',
    redirect:'/home'
  }
]