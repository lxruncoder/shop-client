import Vue from 'vue'
import App from './App.vue'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'
import TypeNav from './components/TypeNav'
import Carousel from './components/Carousel'
import './mock/mockServer'
// 将轮播图封装为组件之后,在组件中引入了,这里就不引入了
// import 'swiper/css/swiper.min.css'
Vue.config.productionTip = false

Vue.component(TypeNav.name,TypeNav)
Vue.component(Carousel.name,Carousel)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
