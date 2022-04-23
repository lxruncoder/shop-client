// 引入需要的组件
// import Home from '@/pages/Home'
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
import MyCenter from '@/pages/Center/MyCenter'
import GroupCenter from '@/pages/Center/GroupCenter'
import store from '@/store'

export default [
  {
    path:'/home',
    component:()=>import('@/pages/Home'),
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
    meta:{title:'登陆'},
    beforeEnter: (to, from, next) => {
      // 引入store获取token
      const token = store.state.user.token
      // 如果已经登陆了还来登陆,就去首页,否则让你去
      if(token) {
        next('/')
      }else {
        next()
      }
    }
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
    meta:{title:'添加购物车成功'},
    // 去成功页面必须携带skuNum和本存储的本地信息才能去, 注意这里要用to,因为是跳转到该页面携带的参数
    beforeEnter:(to,from,next)=>{
      const skuNum = to.query.skuNum
      const skuInfo = sessionStorage.getItem('SKUINFO_KEY')
      console.log(skuNum)
      if(skuNum && skuInfo) {
        next()
      }else {
        next(false)
      }
    }
    
  },
  {
    path:'/shopcart',
    component: ShopCart,
    meta:{title:'我的购物车'}

  },
  {
    path:'/trade',
    component:Trade,
    meta:{title:'订单页面'},
  },
  {
    path:'/pay',
    component:Pay,
    meta:{title:'支付页面'},
    // 只有从trade页面才能跳转到支付页面
    beforeEnter(to,from,next) {
      if(from.path === '/trade') {
        next()
      }else {
        next(false)
      }
    }
  },
  {
    path:'/paysuccess',
    component:PaySuccess,
    meta:{title:'支付成功页面'}
  },
  {
    path:'/center',
    component:Center,
    meta:{title:'个人中心'},
    // 重定向路由第一种配置方式,路径要写全
    // redirect:'/center/mycenter',
    children:[
      {
        path:'mycenter',
        component:MyCenter,
        meta:{title:'我的个人中心'},
      },
      {
        path:'groupcenter',
        component:GroupCenter,
        meta:{title:'团队个人中心'},
      },
      // 第二种配置方式,直接在子路由中配置,path为空,路径不能写全
      {
        path:'',
        redirect:'mycenter'
      }
    ]
  },
  // 配置重定向路由
  {
    path:'/',
    redirect:'/home'
  }
]