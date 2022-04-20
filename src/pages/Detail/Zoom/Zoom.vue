<template>
  <div class="spec-preview">
    <img :src="skuImg.imgUrl" />
    <div class="event" @mousemove="move"></div>
    <div class="big">
      <img :src="skuImg.imgUrl" ref="img" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ["skuImageList"],
  data() {
    return {
      // 定义数据,图片是一个列表默认显示第一张图片
      currentIndex: 0,
    };
  },
  methods: {
    // 放大镜
    move(event) {
      const mask = this.$refs.mask;
      const img = this.$refs.img
      let mouseX = event.offsetX;
      let mouseY = event.offsetY;
      // 鼠标的位置减去盒子的一半,就是盒子的left
      let maskX = mouseX - mask.offsetWidth / 2;
      let maskY = mouseY - mask.offsetHeight / 2;
      // 限定位置
      maskX = maskX <= 0 ? 0 : maskX;
      // 因为蒙版是正方形,所以都使用offsetWidth没有问题
      maskX = maskX >= mask.offsetWidth ? mask.offsetWidth : maskX;
      maskY = maskY <= 0 ? 0 : maskY;
      maskY = maskY >= mask.offsetWidth ? mask.offsetWidth : maskY;
      // 设置
      mask.style.left = maskX + "px";
      mask.style.top = maskY + "px";
      // 大图移动是蒙版反方向的二倍
      img.style.left = - maskX * 2 + 'px'
      img.style.top = - maskY * 2 + 'px'

    },
  },
  mounted() {
    // 全局事件总线,绑定自定义事件,当ImageList组件改变当前图片的时候,这里跟着一起变化
    this.$bus.$on("changeImg", (index) => {
      this.currentIndex = index;
    });
  },
  computed: {
    // 如果请求的数据没有回来这里得到一个skuImageList空数组,空数组的0索引为undefiend,然后.imgUrl就会报错,使用计算属性解决
    skuImg() {
      return this.skuImageList[this.currentIndex] || {};
    },
  },
};
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
