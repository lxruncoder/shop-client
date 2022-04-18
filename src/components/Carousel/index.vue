<template>
  <div class="swiper-container" ref="bannerSwiper">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="banner in bannerList"
        :key="banner.id"
      >
        <img :src="banner.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>
    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from "swiper"
import 'swiper/css/swiper.min.css'
export default {
  name: "Carousel",
  props:['bannerList'],
  watch: {
    banner: {
      // 需要上来执行一次,因为没有数据改变不会触发执行,这句话添加给ListContainer中也可以加上,上来执行一次,数据改变执行一次对listContainer一样没有任何影响
      immediate: true,
      handler() {
        this.$nextTick(() => {
          new Swiper(this.$refs.bannerSwiper, {
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
              el: ".swiper-pagination",
              clickable: true, //  让小圆点生效
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
        });
      },
    },
  },
};
</script>