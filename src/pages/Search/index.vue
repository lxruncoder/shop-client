<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <li class="with-x" v-if="searchParams.categoryName">
              {{ searchParams.categoryName
              }}<i @click="deleteCategoryNameForSearch">×</i>
            </li>
            <li class="with-x" v-if="searchParams.keyword">
              {{ searchParams.keyword }}<i @click="deleteKeywordForSearch">×</i>
            </li>
            <li class="with-x" v-if="searchParams.trademark">
              {{ searchParams.trademark.split(":")[1]
              }}<i @click="deleteTrademarkForSearch">×</i>
            </li>
            <!-- 因为有很多,所以用v-for,数组没有东西自然也不会展示 -->
            <li
              class="with-x"
              v-for="(prop, index) in searchParams.props"
              :key="index"
            >
              {{ prop.split(":")[1]
              }}<i @click="deleteAttrForSearch(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector,ref是为了测试另一种绑定自定义事件的方式-->
        <SearchSelector
          ref="searchSelector"
          @searchForTrademark="searchForTrademark"
          @searchForAttr="searchForAttr"
        />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <!-- 给每个li动态的添加背景颜色,条件是根据order的前半部分如果为1,就给综合添加,如果是2就是价格添加 -->
                <li :class="{active:sortFlag === '1'}" @click="sortForSearch('1')">
                  <!-- 添加额外的i标签用来显示箭头,箭头是否显示的条件跟背景颜色添加的条件相同,同时i标签iconfont是必须的,这个前缀可以在创建iconfont项目的时候设置,具体显示哪一种需要根据order后半部分决定 -->
                  <!-- 这里的[0]和[1]可以根据计算属性获取,来简化表达式的写法 -->
                  <a>综合<i v-show="sortFlag === '1'" class="iconfont" :class="{'shop-long-arrow-down':sortType==='desc','shop-long-arrow-up':sortType==='asc'}"></i></a>           
                </li>
                <li :class="{active:sortFlag === '2'}" @click="sortForSearch('2')">
                  <a>价格<i v-show="sortFlag === '2'" class="iconfont" :class="{'shop-long-arrow-down':sortType==='desc','shop-long-arrow-up':sortType==='asc'}"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <!-- 每一个li是一个商品,在这里循环展示goods中的数据 -->
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <a href="item.html"><img :src="goods.defaultImg" /></a>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>&nbsp;&nbsp;
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a href="item.html" :title="goods.title">{{
                      goods.title
                    }}</a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                      >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                      >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="fr page">
            <div class="sui-pagination clearfix">
              <ul>
                <li class="prev disabled">
                  <a href="#">«上一页</a>
                </li>
                <li class="active">
                  <a href="#">1</a>
                </li>
                <li>
                  <a href="#">2</a>
                </li>
                <li>
                  <a href="#">3</a>
                </li>
                <li>
                  <a href="#">4</a>
                </li>
                <li>
                  <a href="#">5</a>
                </li>
                <li class="dotted"><span>...</span></li>
                <li class="next">
                  <a href="#">下一页»</a>
                </li>
              </ul>
              <div><span>共10页&nbsp;</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  data() {
    return {
      // 搜索对象格式,接口文档提供
      searchParams: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
        categoryName: "",
        keyword: "",
        props: [],
        trademark: "",
        // 默认的搜索条件
        order: "1:desc",
        pageNo: 1,
        pageSize: 10,
      },
    };
  },
  // 在发送请求将路由传递的搜索参数整理,但是按照道理在mounted中应该也是可以
  beforeMount() {
    this.initSearchParams();
  },
  mounted() {
    this.getSearchInfo();
    // window.aa = this.$route
    // console.log(this.searchParams)

    // 测试另一种绑定自定义事件的方式,使用ref
    /* this.$refs.searchSelector.$on('searchForTrademark',(trademark)=>{
      console.log(trademark)
    }) */
  },
  methods: {
    // 整理参数的方法
    initSearchParams() {
      const { category1Id, category2Id, category3Id, categoryName } =
        this.$route.query;
      const { keyword } = this.$route.params;
      // ...是浅拷贝一个对象,能够保证存储了传递过来的搜索条件,没有就是undefined
      const searchParams = {
        ...this.searchParams,
        category1Id,
        category2Id,
        category3Id,
        categoryName,
        keyword,
      };
      // 将参数值为空字符串的去掉,然后在赋值,直接请求三级分类实现跳转,这里其实只有一个trademark是空字符串,为什么没有keyword,因为它是从params中获取的,获取不到本就为undefined
      const keys = Object.keys(searchParams)
      keys.forEach(key=>{
        if(searchParams[key] === ''){
          delete searchParams[key]
        }
      })
      // 重新赋值给搜索条件对象
      this.searchParams = searchParams;
    },
    // 获取到的serach数据包括,商品列表,品牌,和属性三个部分,每次重新搜索都需要展示
    getSearchInfo() {
      this.$store.dispatch("getSearchInfo", this.searchParams); // 将空对象替换为参数对象,就能按照条件进行搜索了
    },
    // 删除categoryName重新搜索
    deleteCategoryNameForSearch() {
      // this.searchParams.categoryName = undefined;
      // 使用一级分类的搜索除了要使用categoryName还要使用cateogryId,因为不知道每次点击的是几级分类,所以将每个id都清空
      // this.searchParams.category1Id = undefined;
      // this.searchParams.category2Id = undefined;
      // this.searchParams.category3Id = undefined;
      // this.getSearchInfo();
      // 上面的搜索方式,会在改变搜索条件之后,浏览器地址没有发生改变,所以通过编程式导航引起路径的变化,会替换整个$route对象,那么监视属性也能监视到,就会重新发送请求
      // 在监视属性中重新发送请求之前,会整理参数,因为是整体替换路由对象,在整理参数的时候,所以所有的queyr参数都没有了
      // 所有的query参数获取到的是undefined,undefined会将之前的categoryName和cateGoryId替换
      // 也就不用手动的删除categoryName和id了
      // 会被自动在整理参数的时候获取不到自动获取为undeinfed
      this.$router.replace({ name: "search", params: this.$route.params });
    },
    // 删除关键字重新搜索,这个就是在分类搜索上继续搜索,所以不用清空id
    deleteKeywordForSearch() {
      // this.searchParams.keyword = undefined;
      // this.getSearchInfo();
      // 通过引起路径的变化,导致监视属性工作,同样也不需要手动清除关键字
      this.$router.replace({ name: "search", query: this.$route.query });
      // 通知header组件清空keyword
      this.$bus.$emit("clearKeyword");
    },
    // 定义事件,点击品牌进行搜索,因为发送请求需要的参数对象在父组件中,所以将参数传递过来,通过父组件发送请求
    searchForTrademark(trademark) {
      const trademarkStr = `${trademark.tmId}:${trademark.tmName}`;
      // 整理数据格式,数据格式是接口要求的数据格式,需要自己拼接整理
      this.searchParams.trademark = trademarkStr;
      this.getSearchInfo();
    },
    // 删除品牌重新搜索
    deleteTrademarkForSearch() {
      this.searchParams.trademark = undefined;
      this.getSearchInfo();
    },
    // 自定义事件点击属性进行搜索
    searchForAttr(attr, attrValue) {
      // 整理搜索对象需要的数据结构,这里要注意,属性值在前,属性的名在后面
      const attrStr = `${attr.attrId}:${attrValue}:${attr.attrName}`;
      // 注意属性搜索可以多种属性搜索,条件是一个数组,要判断一下,是否重复点击,否则数组会重复添加
      // 使用forEach实现
      /* let isRepeat = false;
      this.searchParams.props.forEach((item) => {
        if (item === attrStr) return (isRepeat = true);
      });
      */

      // 使用some方法实现,如果有item和条件相同,返回值为true,every方法,必须全部相同才返回true
      const isRepeat = this.searchParams.props.some(item=>{
        return item === attrStr
      })
      // 如果重复就不添加也不发送请求
      if (!isRepeat) {
        this.searchParams.props.push(attrStr);
        this.getSearchInfo();
      }

    },
    // 删除属性搜索,本质就是删除props数组中的指定位置的元素,这个index,需要通过参数传递过来
    deleteAttrForSearch(index) {
      this.searchParams.props.splice(index, 1);
      this.getSearchInfo();
    },
    // 点击排序进行搜索
    sortForSearch(sortFlag) {
      const originSortFlag = this.sortFlag
      const originSortType = this.sortType
      let newOrder = ''
      // 如果点击的和原来的是一个,那么就切换排序的规则是升序还是降序
      if(sortFlag === originSortFlag) {
        newOrder = `${originSortFlag}:${originSortType === 'desc' ? 'asc' : 'desc'}`
      }else {
        // 如果点击的不是一个,那么就按照点击的来,并且指定默认的规则是desc
        newOrder = `${sortFlag}:desc`
      }
      // 最终重新发送请求
      this.searchParams.order = newOrder
      this.getSearchInfo()
    }
  },
  computed: {
    ...mapGetters(["goodsList"]),
    // 使用计算属性对排序进行简化操作
    sortFlag(){
      return this.searchParams.order.split(':')[0]
    },
    sortType(){
      return this.searchParams.order.split(':')[1]
    }
  },
  watch: {
    $route() {
      this.initSearchParams();
      // 输出参数对象,验证改变路径之后,之前的参数都么有了,会重新赋值,并不会重复追加参数
      // console.log(this.searchParams)
      // 页面挂载的时候将路由对象存储到window上,改变路径引起路由变化的时候将这个时候的挂载到widnow上,在控制台输出window.aa === window.bb
      // 结果为false,也就是说明,在路由变化,重新匹配,会将匹配到的路由配置对象重新赋值给$route,并非简单的内部属性变化,所以直接监视是能够监视到的
      // window.bb = this.$route
      this.getSearchInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
                a {
                  background-color: #fafafa;
                }
              }

              &.disabled {
                a {
                  color: #999;
                  cursor: default;
                }
              }

              &.dotted {
                span {
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>
