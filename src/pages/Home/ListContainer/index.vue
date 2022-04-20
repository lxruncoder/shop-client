<template>
  <div class="list-container">
    <div class="sortList clearfix">
      <div class="center">
        <!--banner轮播-->
        <Carousel :bannerList="bannerList" />
      </div>
      <div class="right">
        <div class="news">
          <h4>
            <em class="fl">尚品汇快报</em>
            <span class="fr tip">更多 ></span>
          </h4>
          <div class="clearix"></div>
          <ul class="news-list unstyled">
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[公告]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[公告]</span>备战开学季 全民半价购数码</li>
            <li><span class="bold">[特惠]</span>备战开学季 全民半价购数码</li>
          </ul>
        </div>
        <ul class="lifeservices">
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">话费</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">机票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">电影票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">游戏</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">彩票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">加油站</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">酒店</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">火车票</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">众筹</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">理财</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">礼品卡</span>
          </li>
          <li class="life-item">
            <i class="list-item"></i>
            <span class="service-intro">白条</span>
          </li>
        </ul>
        <div class="ads">
          <img src="./images/ad1.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "ListContainer",
  mounted(){
    this.getBannerList()
  },
  methods: {
    getBannerList(){
      this.$store.dispatch('getBannerList')
    }
  },
  mounted(){
    this.getBannerList() // 发送ajax请求异步任务
    /* 
      挂载完成去实例化swiper,这样不行,因为实例化的时候,页面不一定显示成功,按道理来说挂载完成,页面的dom就算完成了,在此实例化是可以的,但是,这个页面当中的wiper-slide是根据请求回来的数据
      动态创建生成的,所以必须得保证数据回来之后,在去实例化,有了数据,v-for的结构才会生成
    */
    /* setTimeout(() => { 
      new Swiper ('.swiper-container', { // 同步代码,在数据回来之,结构形成之前,就已经实例化了,所以无法生效,使用定时器指定一个时间,banner部分和floor部分的轮播都生效了
        loop: true, // 循环模式选项   
        // 如果需要分页器
        pagination: {
          el: '.swiper-pagination',
        },      
        // 如果需要前进后退按钮
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      })  
    }, 1000); */
  },
  computed:{
    ...mapState({bannerList:state=>state.home.bannerList})
    // 因为有没有开启namesapced所以无法使用这种方式获取到数据,也不能现在开启了,如果现在开启,之前的dispatch都需要更改方式需要添加home/getCategoryList
    // ...mapState('home',['bannerList'])
  },
/*   watch:{
    bannerList(){
      // 不需要深度监视,因为给对象和数组赋值,都能监视到
      // 为什么需要nextTick,因为数据回来,之后,数据改变,要引起页面的重新渲染,for循环生成新的结构,新旧dom的对比等
      // 虽然流程是这样,但是vue不会立即去渲染页面,而是等待函数都执行完毕才去,这个时候新的结构还是旧的,但是函数的内容会继续执行,函数执行$refs.获取内容
      // 还是虚拟dom阶段,如果使用class获取轮播容器,还可能获取到,但是使用refs获取获取最新的结构肯定获取不到,然后在执行函数代码的时候结构也不是完成的新结构,需要等待函数执行完才是新结构
      // 所以要所以watch配合nexttick(),在下次dom更新的时候,执行其中的回调这样获取的内容都是最新的
      // 这样官网的解释就好理解多了:下次dom更新循环结束之后延迟执行回调,在修改数据之后,立即执行这个方法,获取更新后的dom
      //  - 数据改变,引起下次dom更新,等更新完成调用回调 
      // 并且推荐使用ref,因为如果使用class则也会选择到Floor组件的轮播容器,容器之间需要分开
      this.$nextTick(()=>{
        new Swiper (this.$refs.bannerSwiper, { 
          loop: true, // 循环模式选项   
          // 如果需要分页器
          pagination: {
            el: '.swiper-pagination',
          },      
          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })  
      })
    }
  } */
};
</script>

<style lang="less" scoped>
.list-container {
  width: 1200px;
  margin: 0 auto;

  .sortList {
    height: 464px;
    padding-left: 210px;

    .center {
      box-sizing: border-box;
      width: 740px;
      height: 100%;
      padding: 5px;
      float: left;
    }

    .right {
      float: left;
      width: 250px;

      .news {
        border: 1px solid #e4e4e4;
        margin-top: 5px;

        h4 {
          border-bottom: 1px solid #e4e4e4;
          padding: 5px 10px;
          margin: 5px 5px 0;
          line-height: 22px;
          overflow: hidden;
          font-size: 14px;

          .fl {
            float: left;
          }

          .fr {
            float: right;
            font-size: 12px;
            font-weight: 400;
          }
        }

        .news-list {
          padding: 5px 15px;
          line-height: 26px;

          .bold {
            font-weight: 700;
          }
        }
      }

      .lifeservices {
        border-right: 1px solid #e4e4e4;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;

        .life-item {
          border-left: 1px solid #e4e4e4;
          border-bottom: 1px solid #e4e4e4;
          margin-right: -1px;
          height: 64px;
          text-align: center;
          position: relative;
          cursor: pointer;
          width: 25%;

          .list-item {
            background-image: url(./images/icons.png);
            width: 61px;
            height: 40px;
            display: block;
          }

          .service-intro {
            line-height: 22px;
            width: 60px;
            display: block;
          }

          &:nth-child(1) {
            .list-item {
              background-position: 0px -5px;
            }
          }

          &:nth-child(2) {
            .list-item {
              background-position: -62px -5px;
            }
          }

          &:nth-child(3) {
            .list-item {
              background-position: -126px -5px;
            }
          }

          &:nth-child(4) {
            .list-item {
              background-position: -190px -5px;
            }
          }

          &:nth-child(5) {
            .list-item {
              background-position: 0px -76px;
            }
          }

          &:nth-child(6) {
            .list-item {
              background-position: -62px -76px;
            }
          }

          &:nth-child(7) {
            .list-item {
              background-position: -126px -76px;
            }
          }

          &:nth-child(8) {
            .list-item {
              background-position: -190px -76px;
            }
          }

          &:nth-child(9) {
            .list-item {
              background-position: 0px -146px;
            }
          }

          &:nth-child(10) {
            .list-item {
              background-position: -62px -146px;
            }
          }

          &:nth-child(11) {
            .list-item {
              background-position: -126px -146px;
            }
          }

          &:nth-child(12) {
            .list-item {
              background-position: -190px -146px;
            }
          }
        }
      }

      .ads {
        margin-top: 5px;

        img {
          opacity: 0.8;
          transition: all 400ms;

          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>