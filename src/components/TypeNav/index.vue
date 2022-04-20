<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <!-- mouseenter表示显示,在显示home组件的时候,本来就是true,在变成true也不会有问题 -->
      <div @mouseleave="moveOutDiv" @mouseenter="isShow = true">
        <!-- 如果不嵌套在外层的父元素上,则只有当离开h2标题的时候才会触发 -->
        <h2 class="all">全部商品分类</h2>
        <!-- 设置:appear="true"会让动画在上来就执行一次 -->
        <transition name="sort">
          <div class="sort" v-show="isShow">
            <div class="all-sort-list2" @click="toSearch">
              <div
                class="item"
                :class="{ active: currentIndex === index }"
                v-for="(c1, index) in categoryList"
                :key="c1.categoryId"
                @mouseenter="moveInItem(index)"
              >
                <h3>
                  <a
                    href="javascript:;"
                    :data-category1Id="c1.categoryId"
                    :data-categoryName="c1.categoryName"
                    >{{ c1.categoryName }}</a
                  >
                </h3>
                <div class="item-list clearfix">
                  <div class="subitem">
                    <!-- dl是二级分类 -->
                    <dl
                      class="fore"
                      v-for="c2 in c1.categoryChild"
                      :key="c2.categoryId"
                    >
                      <dt>
                        <a
                          href="javascript:;"
                          :data-category2Id="c2.categoryId"
                          :data-categoryName="c2.categoryName"
                          >{{ c2.categoryName }}</a
                        >
                      </dt>
                      <dd>
                        <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                          <a
                            href="javascript:;"
                            :data-category3Id="c3.categoryId"
                            :data-categoryName="c3.categoryName"
                            >{{ c3.categoryName }}</a
                          >
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "TypeNav",
  data() {
    return {
      // 控制数据移入移出显示二级和三级分类的数据
      currentIndex: -1,
      // 控制sort部分的显示和隐藏
      isShow: true,
    };
  },
  mounted() {
    // 发送请求获取三级分类的数据,优化之后再App的mounted中发送
    // this.getCategoryList()
    // sort部分一上来只有在home路由组件中才会显示,其他组件默认隐藏
    if (this.$route.path !== "/home") {
      this.isShow = false;
    }
  },
  methods: {
    // 鼠标移出实现显示二三级分类效果,抽成一个方法实现
    moveInItem: throttle(
      function (index) {
        this.currentIndex = index;
        // 输出index,验证并非所有的移入回调都会被触发
        // console.log(index)
      },
      20,
      { trailing: false }
    ),
    // 鼠标移开全部商品分类触发的,将sort部分隐藏,同时将离一级分类隐藏二三级分类的语句合并
    moveOutDiv() {
      // 控制二三级分类的隐藏
      this.currentIndex = -1;
      // 控制sort部分的隐藏
      if (this.$route.path !== "/home") {
        this.isShow = false;
      }
    },
    // 跳转到搜索页面
    toSearch(event) {
      // $event,只能在模板中使用,就是浏览器调用回调函数传递的事件对象
      // 使用事件委派之后,父组件之内的任何元素都能触发该事件,要判断那些是a标签触发的事件,target是真正触发事件的元素
      const { categoryname, category1id, category2id, category3id } =
        event.target.dataset;
      // 如果点击的是a标签,进进入if
      if (categoryname) {
        const location = { name: "search" };
        const query = { categoryName: categoryname };
        if (category1id) {
          query.category1Id = category1id;
        } else if (category2id) {
          query.category2Id = category2id;
        } else {
          query.category3Id = category3id;
        }
        location.query = query;
        // 合并params参数,点击搜索也会跳转到search页面,搜索的关键字是也需要携带过去,在进行搜索的时候服务器需要这些参数
        // 并且这里需要注意,不需要if判断,因为params是空对象,进行判断为true
        location.params = this.$route.params;
        // 为了实现在search组件中多次点击三级分类进行搜索,使用浏览器后退按钮能够回到home组件,需要进行判断,不在search组件中跳转才使用push
        // 这里使用search判断比较合适,因为其他页面也使用了typeNav组件,跳转到search页面也需要这个能够直接退回的功能
        if(this.$route.path !== '/search') {
          this.$router.push(location);
        }else {
          this.$router.replace(location);
        }
      }
    },
  },
  computed: {
    // 这里也可以使用数组的形式,但是mapState的第一个参数要指定模块名称
    ...mapState({ categoryList: (state) => state.home.categoryList }),
  },
};
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;
    .sort-enter,
    .sort-leave-to {
      opacity: 0;
    }
    .sort-enter-to,
    .sort-leave {
      opacity: 1;
    }
    .sort-enter-active,
    .sort-leave-active {
      transition: all 0.5s;
    }
    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &.active {
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }
}
</style>
