<template>
  <div>
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor />
  </div>
</template>

<script>
import ListContainer from './ListContainer'
import Recommend from './Recommend'
import Rank from './Rank'
import Like from './Like'
import Floor from './Floor'
export default {
  name: "Home",
  components: {ListContainer,Recommend,Rank,Like,Floor}
};
</script>

<style lang="less" scoped>

</style>