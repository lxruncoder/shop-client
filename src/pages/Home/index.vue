<template>
  <div>
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <!-- 一个注意点,如果单独使用组件标签,则闭合的/可有可无,但是向下面这样,有很多属性,则必须空格才能闭合 -->
    <Floor v-for="floor in floorList" :key="floor.id" :floor="floor" />
  </div>
</template>

<script>
import ListContainer from './ListContainer'
import Recommend from './Recommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
import { mapState } from 'vuex'
export default {
  name: "Home",
  components: {ListContainer,Recommend,Rank,Like,Floor},
  data(){
    return {
      age:12
    }
  },
  mounted(){
    this.getFloorList()
  },
  methods:{
    getFloorList(){
      this.$store.dispatch('getFloorList')
    }
  },
  computed:{
    ...mapState({floorList:state=>state.home.floorList})
  }
};
</script>

<style lang="less" scoped>

</style>