<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cartInfo in cartInfoList" :key="cartInfo.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cartInfo.isChecked" @click="updateIsChecked(cartInfo)" />
          </li>
          <li class="cart-list-con2">
            <img :src="cartInfo.imgUrl" />
            <div class="item-msg">
              {{cartInfo.skuName}}
            </div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{cartInfo.skuPrice}}</span>
          </li>
          <li class="cart-list-con5">
            <!-- 修改商品数量共用一个方法,第三个参数如果为1,表示点击++或者--按钮,第三个参数为2,表示是输入的 -->
            <a href="javascript:void(0)" class="mins" @click="changeCartNum(cartInfo,-1,true)">-</a>
            <input
              autocomplete="off"
              type="text"
              :value="cartInfo.skuNum"
              minnum="1"
              class="itxt"
              @click="changeCartNum(cartInfo,$event.target.value * 1,false)"
            />
            <a href="javascript:void(0)" class="plus" @click="changeCartNum(cartInfo,1,true)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{cartInfo.skuNum * cartInfo.skuPrice}}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteShopCart(cartInfo)">删除</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <!-- 这里v-model,v-model没有使用数组,指定value,默认收集的就是ischecked,能够实现效果,并且需要双向数据绑定,当改变的时候触发计算属性的set方法 -->
        <!-- 如果不用v-mode,就得通过click单独绑定事件来完成,这样借助计算属性的set方法就可以实现 -->
        <input class="chooseAll" type="checkbox" v-model="isCheckAll" />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteShopCartChoice">删除选中的商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>{{choiceNum}}</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{totalPrice}}</i>
        </div>
        <div class="sumbtn">
          <a class="sum-btn" href="###" target="_blank">结算</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "ShopCart",
  mounted(){
    // 直接获取信息是获取不到的,因为后台服务器不知道是那个用户在请求数据,所以需要生成用户的临时表示,在每次请求都携带这个标识
    this.getCartList()
  },
  methods:{
    // 不需要根据请求或者成功或者失败的结果进行后续操作,所以没有必要去拿结果,只需要发送请求将数据存储在vuex中
    getCartList(){
      this.$store.dispatch('getCartList')
    },
    /* 
      改变商品数据:接口的参数就为正数就表示增加几个,负数就表示减少几个(变化的量)
      disNum如果点击的为加号或者减号,传递过来的就是1或者-1,就直接表示是变化的量
      disNum如果是用户输入框传递过来的,那么disNum为最终的量,需要转化为变化的量
      flag是用来判断用户点击还是输入来触发的事件
    */
    async changeCartNum(cartInfo,disNum,flag) {
      // 获取到原来的数量
      const originNum = cartInfo.skuNum
      
      if(flag) {
        // 如果原来的量加上变化的量小于1,那么最后disNum需要等于1
        if(originNum + disNum < 1) {
          disNum = 1 - originNum
        }
      }else {
        // 如果用户输入的小于1,那么disNum最终还是等于1
        if(disNum < 1) {
          disNum = 1 - originNum
        }else {
          // 如果正常情况,那么要使用的disNum就等于用户输入的减去原来的
          disNum = disNum - originNum
        }
      }
      // 这里得到的就是要使用的
      try {
        await this.$store.dispatch('addShopCart',{skuId:cartInfo.skuId,skuNum:disNum})
        // 修改之后获取最新的数据
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }

    },
    // 切换购物车的选中状态
    async updateIsChecked(cartInfo){
      // 如果当前的是cartInfo的isChecked为1,就变成0,0就变成1
      try {
        await this.$store.dispatch('updateIsChecked',{skuId:cartInfo.skuId,isChecked:cartInfo.isChecked ? 0 : 1})
        // 修改成功之后重新发送请求
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    },
    // 删除购物车信息
    async deleteShopCart(cartInfo){
      try {
        await this.$store.dispatch('deleteShopCart',cartInfo.skuId)
        this.getCartList()
      } catch (error) {
        alerat(error.message)
      }
    },
    // 删除选中的购物车信息
    async deleteShopCartChoice(){
      try {
        await this.$store.dispatch('deleteShopCartChoice')
        this.getCartList()
      } catch (error) {
        alert(error.message)
      }
    }
  },
  computed:{
    ...mapGetters(['cartList']),
    // 计算具体需要展示的数据
    cartInfoList(){
      // 数据没回来cartlist是undefined,为了避免假报错再次计算获得需要展示的数据
      return this.cartList.cartInfoList || []
    },
    // 计算全选:比较特殊,因为全选包括修改和获取,所以用计算属性的完整写法
    isCheckAll:{
      get(){
        // 计算属性不要忘记返回值
        return this.cartInfoList.every(item=>{
          // every,如果每一个item的isCheck都为1,则返回true
          return item.isChecked === 1
        })
      },
      // 点击全选,实现全选或者全不选
      async set(value){
        try {
          // true和false要转换为0和1,如果新的值为true,就是选中,所以传递过去的为1,否则传递过去的为0
          await this.$store.dispatch('updateIsCheckedAll',value  ? 1 : 0)
          this.getCartList()
        } catch (error) {
          alert(error.message)
        }
      }
    },
    // 计算已选择的商品数量
    choiceNum(){
      return this.cartInfoList.reduce((pre,item)=>{
        // return pre += item.isChecked ? item.skuNum : 0
        if(item.isChecked) {
          pre += item.skuNum
        }
        return pre
      },0)
    },
    // 计算总价
    totalPrice(){
      return this.cartInfoList.reduce((pre,item)=>{
        // return pre += item.isChecked ? item.skuNum * item.skuPrice : 0
        if(item.isChecked) {
          pre += item.skuNum * item.skuPrice
        }
        return pre
      },0)
    }
  }
};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 13%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
