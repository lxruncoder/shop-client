<template>
  <div>
    <Header />
    <router-view></router-view>
    <!-- 在显示Login和Register的时候Footer不显示,如果使用path进行判断,需要整体为true,两个条件必须都要满足 -->
    <!-- <Footer v-show="$route.path!=='/register' && $route.path!=='/login'" /> -->
    <!-- 第二种方式,通过路由元信息配置,给login和register配置isHidden为true,则上来是现实的取反,v-show为false就不显示了 -->
    <Footer v-show="!$route.meta.isHidden" />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name:'App',
  components: {
    // 这里的名字是Header为html标签,但是可以使用,因为首字母大写的,在使用的时候必须也是大写字母开头,如果不是html同名标签,大写开头注册,在使用的时候可以小写字母开头使用
    Header,Footer
  }
}
</script>
