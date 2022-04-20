<template>
  <div class="swiper-container" ref="imgListSwiper">
    <div class="swiper-wrapper">
      <!-- 这里为什么不会出现假报错,因为没有用undefined.任何东西,如果遍历一个空数组,没有内容就不会展示,并不会报错 -->
      <div
        class="swiper-slide"
        v-for="(skuImage, index) in skuImageList"
        :key="skuImage.id"
      >
        <!-- 点击小图让被选中的小图有一个class样式,并且使用全局事件总线通知兄弟组件Zoom更新图片 -->
        <img
          :src="skuImage.imgUrl"
          :class="{ active: currentIndex === index }"
          @click="changeImg(index)"
        />
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
import Swiper from "swiper";
export default {
  name: "ImageList",
  props: ["skuImageList"],
  data() {
    return {
      // 默认给第一个图片添加边框,这个原理跟三级分类移出移入的原理一样
      currentIndex: 0,
    };
  },

  methods: {
    changeImg(index) {
      // 切换选中图片的class
      this.currentIndex = index;
      // 通知兄弟组件修改展示的大图
      this.$bus.$emit("changeImg", index);
    },
  },
  // 监视属性监视有数据,然后nextTick工作
  watch: {
    skuImageList: {
      handler() {
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.imgListSwiper, {
            slidesPerView: 4, // 一个视图有几张图片
            slidesPerGroup: 4, // 每次切换一组几张图片
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

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>
