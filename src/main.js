import Vue from 'vue'
import App from './App.vue'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'
import TypeNav from './components/TypeNav'
Vue.config.productionTip = false

Vue.component(TypeNav.name,TypeNav)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
