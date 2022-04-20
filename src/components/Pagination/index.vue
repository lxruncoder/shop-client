<template>
  <div class="pagination">
    <!-- 上一页并非一直能够使用,如果当前页就等于1,那么无法使用 -->
    <button :disabled="currentPageNo === 1" @click="$emit('paginationForSearch',currentPageNo-1)">上一页</button>
    <!-- 1按钮页不是一直都显示的,如果计算的连续页面为1-5,则这里的1就不显示,否则重复了 -->
    <button v-if="startEnd.start > 1" @click="$emit('paginationForSearch',1)">1</button>
    <!-- ...按钮页不是完全显示的,如果起始页大于2,就是3开始,那么显示上面的1,和...,得到1...3456 -->
    <button v-if="startEnd.start > 2">···</button>

    <!-- 中间部分的按钮利用计算的起始位置和结束位置的遍历得出 -->
    <!-- 同时需要配合v-if,因为如果直接end,则会从0开始,我们需要从计算的起始页开始,v-if的优先级比较高,先判断,如果满足条件v-for生效 -->
    <!-- 这里的v-if是会报错的,但是是正常的,不是因为代码的问题, 使用-v-show也能实现同样的效果-->
    <!-- 并且在这里动态的添加class样式,不用管前面的1按钮,因为如果这里显示了,上面的不会显示 -->
    <button @click="$emit('paginationForSearch',page)" :class="{active:page === currentPageNo}" v-for="page in startEnd.end" :key="page" v-show="page >= startEnd.start">{{page}}</button>
    
    <!-- 总页数9,9-1为8,小于8就是7,连续页的结束为7,才显示...为7...9 -->
    <button v-if="startEnd.end < totalPageNo - 1">···</button>
    <!-- 举例子:如果结束位置为9,总页数为9,这个总页数不应该显示,因为计算出来的连续页包括9 -->
    <button v-if="startEnd.end < totalPageNo" @click="$emit('paginationForSearch',totalPageNo)">{{totalPageNo}}</button>
    <!-- 如果当前页等于最后一页,就禁用 -->
    <button :disabled="currentPageNo === totalPageNo" @click="$emit('paginationForSearch',currentPageNo+1)">下一页</button>
    
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  // 获取到的总条数可以直接展示total
  props:['currentPageNo','pageSize','total','continueNo'],
  computed:{
    // 计算总页数,可以直接展示
    totalPageNo(){
      return Math.ceil(this.total/this.pageSize)
    },
    // 计算连续页的起始页和结束页
    startEnd(){
      // 需要当前页,连续页和总页码
      const {currentPageNo,totalPageNo,continueNo} = this
      let start = 0
      let end = 0
      // 如果总页面直接小于或者等于连续页,那么起始位置是1,结束位置就是总页码
      if(totalPageNo <= continueNo) {
        start = 1
        end = totalPageNo
      }else {
        // 先当成正常情况来处理:假设当前页是7,那么连续页起始位置为5,结束位置为9,那么就应该是7-2和7+2,2通过连续页计算得出
        start = currentPageNo - Math.floor(continueNo / 2)
        end = currentPageNo + Math.floor(continueNo / 2)
        // 非正常情况,计算的起始页小于1,比如当前页为2,连续页为5,计算出的连续页为01234,那么纠正起始页为1,那么连续页就应该是12345,无论计算出什么样的连续页,将起始页纠正为1之后,结束页都是5,也就是连续页
        if(start < 1){
          start = 1
          end = continueNo
        }
        // 非正常情况,计算的结束页大于总页数:比如当前页为7,计算出来的连续页为56789,但是只有8页,那么就让结束页等于总页数就是45678,那么起始页4如何计算,totalPageNo - continueNo + 1
        if(end > totalPageNo) {
          start = totalPageNo - continueNo + 1 // 8-5+1
          end = totalPageNo
        }
      }
      // 最后将计算出的来起始位置和结束位置返回
      return {start,end}
    }
  }
}
</script>

<style lang="less" scoped>
  .pagination {
    button {
      margin: 0 5px;
      background-color: #f4f4f5;
      color: #606266;
      outline: none;
      border-radius: 2px;
      padding: 0 4px;
      vertical-align: top;
      display: inline-block;
      font-size: 13px;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      box-sizing: border-box;
      text-align: center;
      border: 0;

      &[disabled] {
        color: #c0c4cc;
        cursor: not-allowed;
      }

      &.active {
        cursor: not-allowed;
        background-color: #409eff;
        color: #fff;
      }
    }
  }
</style>