import Vue from 'vue'
import App from './App.vue'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'
import TypeNav from './components/TypeNav'
import Carousel from './components/Carousel'
import Pagination from './components/Pagination'
import * as API from '@/api'
import './mock/mockServer'
// 将轮播图封装为组件之后,在组件中引入了,这里就不引入了,但是发现Detail组件的轮播还是需要用到,并且不能使用封装的轮播组件,所以打开
import 'swiper/css/swiper.min.css'
// 引入图标的css样式
import './style/iconfont.css'
// element-ui的按需引入
import { Button, Select,MessageBox,Message } from 'element-ui';
Vue.component(Button.name,Button)
// 按需引入引入这些比较特殊的,需要挂载到VUe的原型上alert必须在msgbox的基础上使用,所以必须引入msgbox,但是messageBox不需要Vue.componet来注册
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$message = Message;
Vue.config.productionTip = false

Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)

new Vue({
  router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  render: h => h(App),
}).$mount('#app')
