# 笔记

重新回看之后,发现对于一些知识有了新理解,做了很多补充,同时有很多注释也并不准确了,但是要理解

## 项目初始化

创建项目:`vue create shop-client`

启动项目:`npm run serve`

**项目目录:**
1. node_modules:依赖包
2. public:静态资源,该目录不会被webpack处理,打包之后直接放在dist目录中
3. src/assets:多个组件共同使用的静态资源,该目录下的资源会被webpack处理
4. src/components:非路由组件和公共组件,还会创建一个pages或views目录用来存放路由组件
5. src/App.vue:根组件
6. src/mian.js:入口文件(项目启动第一个执行的文件)
7. babel.config.js:babel的配置文件
8. package-lock.json:依赖包的详细说明,版本锁定
9. package.json:表示该项目是一个包文件,项目如何启动如何打包的命令都在该文件中声明,在public/index.html中的网页标题会读取该文件中创建项目名 
10. .gitignore:git的忽略文件
11. vue.config.js:相当于webpack的配置文件,在该配置文件中配置的内容会和webpack的配置进行合并

**禁用eslint语法检查**
1. 默认项目中安装了eslint语法检查工具,而且默认检查的严格级别很高,定义了一个变量没有使用就会报错,所以在开发阶段需要把eslint完全禁用
2. 在项目根目录下创建**vue.config.js**配置文件,该文件可以看作是webpack延申出的配置文件,对webpack进行配置
   - 注意现在vue-cli的版本为5的,会自动有该配置文件
   
注意:***任何配置文件在修改之后都要重启项目才会生效***

```js
module.exports = {
  lintOnSave: false, // 禁用eslint语法检查
}
```

**配置@别名提示**
1. `@`代表src目录,可以直接使用,但是在使用的时候没有提示,所以要配置
2. 在项目根目录下创建**jsconfig.json**配置文件,进行如下配置

注意:***在新版本的vue-cli创建的项目自带该配置文件,并且已经将这个配置项配好了***

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "exclude": ["node_modules","dist"]
}
```

**配置项目启动浏览器自动打开**
1. 在**package.json**文件中启动命令后增加`--open`
```js
"scripts": {
  "serve": "vue-cli-service serve --open", // 新增的open
  "build": "vue-cli-service build",
  "lint": "vue-cli-service lint"
},
```

问题:vue-cli(脚手架)升级为5版本之后,配置自动打开打开之后,显示的为:http://0.0.0.0:8080/,也就是自动开打不显示网页
解决1:
1. 卸载当前的脚手架环境`npm uninstall -g vue-cli`
2. 重新安装四版本的脚手架`npm install -g @vue/cli@4.5.15`

解决2:vue.config.js配置文件中配置devServer配置项,手动配置端口号和host:
```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port:8080,
    host:'localhost'
  }
})
```

**git主要操作逻辑**
1. 创建本地仓库:`git init`,使用vue-cli创建的项目已经为我们初始化了
2. 创建远程仓库
3. 让本地仓库和远程仓库进行关联
4. 本地代码改变推向远程仓库:`git push`
5. 远程仓库代码改变拉向本地:`git pull`
6. 以上的步骤是说的先有本地仓库,在有远程仓库,如果已经有远程仓库,使用`git clone xxx`将远程仓库的代码下载到本地

**分支操作**
1. 在本地创建一个新分支同时切换到新建的分支:`git checkout -b dev`
2. 分支开发完成之后,执行add和commit命令,然后将分支推送到远程库:`git push origin dev`
3. 合并分支之前如果是多人协作,先拉取一下远程的master分支,防止master已经做了修改:`git pull`
4. 切换到本地分支:`git checkout master`
5. 然后合并分支:`git merge dev`
6. 分支合并之后,将主分支推送到远程master:`git push`
7. 合并之后可以将本地的分支删除:`git barnch -d dev`
8. 也可以将远程分支删除:`git push origin --delete dev`


## 分析页面的主体结构

**需要删除的内容:**
1. 删除src/components中的组件
2. 删除src/App.vue中内容,创建一个空白的模板

分析:
1. SPA(单页面应用)上写结构不变为一般组件,中间部分发生改变为路由组件
2. 切换页面的时候页面不刷新,发送ajax请求
3. Footer和Header为路由组件创建在components目录中
4. Home,Search,Login,Register都是点击才会出现所以是路由组件,路由组件定义在**src/pages**或者**src/views**

## 路由组件和非路由组件

**路由组件和非路由组件的区别**
1. 使用的步骤相同:定义,注册,使用
2. 定义:都是一样去定义,只是定义在不同的目录中
3. 注册:非路由组件在使用的组件中使用`components`配置项注册,而路由组件是在路由器对象VueRouter的配置对象中注册的
   - 组件当中注册
   - 路由配置当中注册
4. 使用:非路由组件使用注册的组件标签,而路由组件使用声明式导航`<router-link>`和编程式导航`this.$router.push()`配合`<router-view>`

***非路由组件和路由组件的生命周期不同,路由组件在切换的时候会销毁重建,可以使用`<keep-alive>`保持不销毁,而非路由组件不会销毁,需要执行`this.$destroy()`才会被销毁***这里能够延伸出两个生命周期函数
1. activated:激活
2. unactivated:失活

**非路由组件的使用步骤**
1. 定义:在components目录中去定义
2. 注册:在使用的组件中,先使用`import`语法将要使用的组件引入,然后注册`components:{Header,Footer}`
3. 使用:直接只用组件标签`<Header/>`

**路由组件的具体使用步骤**
1. 创建`src/pages`目录
2. 安装router:`npm i vue-router@3`
3. 创建`src/router`目录,并且该目录下创建index.js文件
   - 引入并声明使用router插件
   - 向外暴露一个路由器对象
   - 引入路由组件
   - 路由器对象中使用`routes`配置路由组件的路由信息(配置路由)
4. 在main.js中引入暴露出来的路由器对象,并且注册到Vue的配置对象当中
5. 在需要使用非路由组件的地方指定出口`<router-view>`,该场景下需要在App.js中使用该标签

:src/router/index.js路由器文件如何配置:
```js
// 引入并使用
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 引入需要使用的路由组件
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Search from '@/pages/Search'
// 暴露路由器对象
export default new VueRouter({
  routes:[
    // 包含一个个路由配置对象
    {
      path:'/home',
      name:'home',
      component:Home
    },
    {
      path:'/search',
      name:'search',
      component:Search
    },
    {
      path:'/login',
      name:'login',
      component:Login
    },
    {
      path:'/register',
      name:'register',
      component:Register
    },
    // 配置转发,当访问/就访问/home
    {
      path:'/',
      redirect:'/home'
    }
  ]
})
```

在main.js中如何注册:
```js
// 引入路由器对象配置文件
import router from '@/router'
new Vue({
  router, // 在所有的组件内部都可以使用this.$router和this.$route
  render: h => h(App),
}).$mount('#app'
```

App.js中指定路由组件的出口:完成后可以在浏览器的地址栏手动改变路径来切换非路由组件的显示
```html
<div>
  <Header/>
  <router-view></router-view>
  <Footer/>
</div>
```

## 静态页转换为组件
1. 在`template`标签中拷贝结构
2. 在`style`标签中拷贝样式
3. 在对应的组件目录中创建images目录存放该组件需要的图片资源

***注意静态资源在html和css中路径问题***

**如何解析less文件**
1. 将style标签的lang指定为less:`<style lang="less" scoped></scoped>`
2. 安装less:`npm i less -D`(在基础的时候没有安装less,只安装less-loader也可以使用)
3. 安装less-loader:`npm i less-loader@7 -D`
   - 因为vue2项目基于webpack4,而less-loader最新版本8,9,10,都是基于webpack5的

因为程序真正运行的时候并不需要,所以安装为开发环境,安装包会在package中的 devDependencies对象中

***注意:需要限定版本为7***

**使用全局css初始化样式的两种方式**
1. 在src目录下创建styles目录,将css样式放在该目录中,然后在main.js中引入:`import '@/styles/reset.css'`
2. 在public目录下创建css目录,将css样式放在该目录中,然后在index.html中引入
```html
<link rel="stylesheet" type="text/css" href="<%= BASE_URL %>css/reset.css" />
```

**实现路由的跳转**
1. 将Header组件中使用`<router-link>`标签对登陆注册以及logo的`<a>`标签进行替换实现路由的跳转
   - 注意:***<router-link>最终会被转换为超链接标签,但是因为是单页面应用,所以`target="_blank"`属性不需要***
2. 点击Header组件中的搜索按钮,通过编程式路由导航`this.$router.push('/search')`实现跳转到Search路由组件

**设置路由对象的meta属性**

Footer组件并非在任何时候都显示,在切换到Login和Register路由组件的时候Footer组件并不显示,有两种方式控制Footer组件的显示:
1. 使用`$route.path`进行判断
2. 在路由对象中定义`meat`元信息,使用元信息进行判断
   - 元信息可以配置自定义的任何数据
   - 元信息如果不进行配置则默认为一个空对象

src/router/index.js中关于元信息的配置,在Login组件和Register组件的路由配置中添加元信息
```js
{
  path:'/login',
  name:'login',
  component:Login,
  // 在展示该组件的的时候需要隐藏Footer组件,就配置元信息
  meta:{isHidden:true}
},
```

在App.js中使用`v-show`对是否显示Footer组件进行判断:
为什么能控制:
1. 每个路由组件都有一个`$route`属性,每次`router-view`只能显示一个组件,切换的时候,展示的挂载,其他的销毁,当前对应的route对象也会更新
2. 组件内部是一个template标签,里面包含了一个根标签div,最终就相当于`v-show`作用在了这个div身上
```html
<div>
  <Header />
  <router-view></router-view>
  <!-- 在显示Login和Register的时候Footer不显示,如果使用path进行判断,需要整体为true,两个条件必须都要满足 -->
  <!-- <Footer v-show="$route.path!=='/register' && $route.path!=='/login'" /> -->
  <!-- 第二种方式,通过路由元信息配置,给login和register配置isHidden为true,则上来是现实的取反,v-show为false就不显示了 -->
  <!-- 如果没有配置,则meta为空对象,然后isHidden为undefined为false,取反为true,显示 -->
  <Footer v-show="!$route.meta.isHidden" />
</div>
```

## 路由传参

**路由跳转的两种方式**
1. 声明式路由导航:`<router-link>`
2. 编程式路由导航:`this.$router.push()`和`this.$router.replace`,这种方式更加灵活,可以添加自己的逻辑,在某些情况下效率更好(没有创建VueComponet的实例对象,即没有使用组件标签)

**路由匹配的过程**
1. 编程式路由导航或声明式路由导航引起浏览器地址栏发生改变
2. 当路径改变,这个路径就会到路由器当中的路由数组内部和路由对象的路径,一个一个的继续往下匹配,匹配不到就继续往下,如果匹配到,就显示注册的对应的路由组件
3. 传递的params参数会被路径后`:xxx`匹配到,并且`xxx`会收集到传递过来的params参数,最终这个参数会被放到这个路由对象的params属性中
4. query参数不会在匹配的时候占位,但是query参数也会在匹配的时候被收集到当前这个路由对象的query属性中
5. 显示组件的同时,会把刚才匹配的路由对象放在这个组件的`$route`当中,所以才能`this.$route.params`和`this.$route.query`,也就是一个路由配置对象对应一个`this.$route`属性

相当于以下这种形式:
```js
{
  path:'/login',
  name:'login',
  component:Login,
  meta:{isHidden:true},
  // 收集的queyr参数和params参数
  query:{}
  params:{}
},
```

**路由传参的种类**
1. params参数:属于路径的一部分,路由当中匹配的的时候需要照顾到这个参数,如果路由当中没有使用占位符配合,就匹配不到
2. query参数:在路径后面以`?`分割`?name=tomcat&age=12`,query参数不是路径的一部分,也就是`?`后面不是路径的一部分,路由匹配不需要关心这个参数

**路由传参的写法**

1. 字符串写法
2. 模板字符串写法
3. 对象写法

在Search组件中进行路由配置添加占位符进行params参数的接收:
```js
{
  path:'/search/:keyword',
  name:'search',
  component:Search
},
```

声明式路由导航的三种写法:
```html
<!-- 添加的一个声明式路由导航,做测试来用,后面删除 -->
<!-- 字符串写方法,就是字符串的拼接,因为:之后,里面是js表达式,所以用''单引号包裹 -->
<!-- <router-link :to="'/search/'+keyword + '?keywordUpper=' + keyword.toUpperCase()">搜索</router-link> -->
<!-- 模板字符串写法 -->
<!-- <router-link :to="`/search/${keyword}?keywordUpper=${keyword.toUpperCase()}`">搜索</router-link> -->
<!-- 对象写法,如果有params参数就不能使用path,要使用命令路由,并且params中的key要和路由对象中的占位符一样 -->
<router-link :to="{name:'search',params:{keyword:keyword},query:{keywordUpper:keyword.toUpperCase()}}">搜索</router-link>
```

编程式路由导航的三种写法:
```js
methods:{
  toSearch(){
    // 字符串写法
    // this.$router.push('/search/'+this.keyword + '?keywordUpper=' + this.keyword.toUpperCase())
    // 模板字符串
    // this.$router.push(`/search/${this.keyword}?keywordUpper=${this.keyword.toUpperCase()}`)
    // 对象写法,同样主要注意,如果有params参数就不能用path
    this.$router.push({name:'search',params:{keyword:this.keyword},query:{keywordUpper:this.keyword.toUpperCase()}})
  }
}
```

在Search组件中测试是否能够接收到参数:
```html
<div>
  <p>query参数{{$route.query.keywordUpper}}</p>
  <p>params参数{{$route.params.keyword}}</p>
</div>
```


**传递params参数的注意**

切记:***无论是声明式路由导航还是编程式路由导航,对象写法只要传递了params参数,就不能使用path属性指定切换的路由,而是要使用命令路由,在路由配置中配置name属性,在跳转到时候使用name属性切换到指定的路由***

总结:***如果使用对象形式传递参数,就使用name,这样就不会出现问题***

**在路由配置中指定了占位符,却没有传递params参数**
```js
methods:{
  toSearch(){
    // 没有传递params参数跳转到Search组件
    this.$router.push({name:'search',query:{keywordUpper:this.keyword.toUpperCase()}})
  }
}
```

测试:如果是用name跳转则可以跳转到Serch页面因为显示了query参数,但是路径当中丢失了search,而使用path跳转路径没丢,但是query参数也不显示了
```js
http://localhost:8080/#/?keywordUpper=NIHAO
http://localhost:8080/#/search?keywordUpper=NIHAO
```

解决:***在路由配置对象中占位符后面使用`?`表示该参数可以传递也可以不传递***

**在params参数可传可不传的基础上,如果传递了一个空字符串会出现路径丢失问题**

问题:如果使用name,在params参数可以传递可以不传递的基础上,如果传递的是一个空字符串,会有路径丢失的问题
解决:
1. 在参数可传递或者不可传递的前提下,也就是在路由配置中,配置了`?`,在参数后面或一个`undefiend`当参数为空字符串的时候,指定为`undefiend`则不会出现路径丢失的问题(只能是对象写法能解决这个问题)
2. 不传递params参数
```js
toSearch(){
  // params参数如果在输入框中没有输入内容,收集的就是一个空字符串
  this.$router.push({name:'search',params:{keyword:this.keyword || undefiend},query:{keywordUpper:this.keyword.toUpperCase()}})
}
```

**路由配置中使用props**

props是在路由组件当中去操作query参数和params参数的简化写法
1. 值为true:会默认将传递过来的params参数,额外的映射为组件当中的属性去操作
2. 值为一个对象:传递的额外需要的静态数据
3. 值为一个函数:参数为当前的路由对象route,可以手动的将params参数和query参数映射为组件当中的属性

在Search的路由对象中使用`props`简化操作参数的获取:
```js
{
  path:'/search/:keyword?',
  name:'search',
  component:Search,
  // props:true
  // props:{username:'tomcat'}
  props:({query:{keywordUpper},params:{keyword}}) => { // 连续结构赋值的写法
    return {keywordUpper,keyword}
  }
},
```

在Search组件中使用`props`接收就可以直接使用了
```js
export default {
  name:'Search',
  props:["keyword","keywordUpper"]
}
```

## 解决编程式路由导航的bug,即修改原型对象方法的原理

编程式路由导航,在不改变参数的情况下,连续点击,就抛出错误
```html
NavigationDuplicated: Avoided redundant navigation to current location: 
```

因为在vue-router3.1.0之后,引入了promise语法
如果没有通过参数指定成功的回调或者失败的回调函数就返回一个Promise实例,且内部会判断如果要跳转的路径和参数都没有变化,会抛出一个失败的Promise实例

解决方式:
1. 在调用`push`的时候指定成功的回调和失败的回调或者使用`catch`处理
2. 修改Vue原型上的push和replace方法(一劳永逸)

指定promise的then或者catch方法来解决:
```js
methods: {
  // 使用then指定成功或者失败的回调
  toSearch(){
    this.$router.push({name:'search',params:{keyword:this.keyword || undefined},query:{keywordUpper:this.keyword.toUpperCase()}}).then(
      // 返回的promise实例状态为成功的,则返回的是当前的$route对象,如果失败就是抛出的错误咯
      ()=>{},
      ()=>{}
    )
  }
  // 使用catch只指定失败的回调,陈功的回调相当于补充了undefined,但是成功是积极的不会报错
  toSearch(){
    this.$router.push({name:'search',params:{keyword:this.keyword || undefined},query:{keywordUpper:this.keyword.toUpperCase()}}).catch(()=>{})
  }
}
```

重新方法解决:在src/router/index.js中重写VueRouter原型对象上的push方法和replace方法(this.$router调用的方法就在VueRouter的原型对象上)
```js
// ... 引入需要注册的路由组件
// 我们还是要调用这些方法的,所以将这些方法存储起来,后期使用
const originPush = VueRouter.prototype.push  // push方法就在VueRouter的原型对象上
const originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function(location,onResolve,onReject){
  /* 
    参数
      1. location:就是对象形式传递参数传递的对象
      2. resolve:成功的回调函数
      3. reject:失败的回调函数
    原理:
      1. VueRouter是路由器对象的构造函数
      2. this.$router.push调用的是路由器对象的方法,这个方法并不是路由器对象实例的方法,而是VueRouter原型对象上的方法
      3. this.$router是实例化对象,是VueRouter的实例化对象
    this问题:
      1. 如果全局调用originPush,this为window,但是在这里应该undefiend
      2. 所以使用call,谁调用这个方法this就是谁,是VueRouter的实例对象调用的,即this.$router(就是VueRouter的实例对象)
      3. 如果不用call就是全局调用会出问题
      3. 这里不能使用箭头函数,因为箭头函数没有自己的this,就去找到外面,依然是undefined
  */
  if(onReject === undefined && onReject === undefined){ // 如果没有传递就是undefined,所以可以直接判断,不需要===undefiend
    // originPush.call(this,location,()=>{},()=>{})
    originPush.call(this,location).catch(()=>{})
  }else {
    originPush.call(this,location,onReject,onResolve)
  }
}
VueRouter.prototype.replace = function(location,onResolve,onReject){
  if(onReject === undefined && onReject === undefined){
    console.log(this)
    originReplace.call(this,location,()=>{},()=>{})
  }else {
    originReplace.call(this,location,onReject,onResolve)
  }
}
// ...暴露路由器对象
```

## 拆分Home组件的非路由组件

1. 即在Home组件中需要展示的组件,因为是Home组件使用,所以在Home目录中创建其他组件的目录
2. 三级导航组件TypeNav需要被多个组件使用,一个非路由组件被多个组件使用,那么定义在componets中,注册在全局`Vue.component()`

在mian.js中对共用的组件进行全局注册
```js
import TypeNav from '@/components/TypeNav'
Vue.component(TypeNav.name,TypeNav)
```

注意:***别忘记html和css中在引入静态资源时候的路径问题***


## axios的二次封装以及利用请求拦截器和响应拦截器添加nprogress功能

**axios的二次封装**
1. 安装axios:`npm i axios`
2. 创建src/utils/ajax.js用来封装axios,也可以在src/api/ajax.js目录中对axios进行封装(老师是这样)

**nprogress的使用**
1. 安装nprogress:`npm i nprogress`
2. 在请求拦截器中引入nprogress,使用其方法
   - 在请求拦截中开启进度条:`nprogress.start()`
   - 在响应拦截器成功和失败的回调中都要停止进度条:`nprogress.done()`
3. 在main.js中引入nprogress的样式,因为在所有页面中都要使用:`import 'nprogress/nprogress.css'`

**插件Search node_modules的使用**
1. 安装插件
2. `ctrl+shift+p`调用出命令,搜索安装的Search node_modules,回车使用
3. 下次`ctrl+shift+p`调出命令,该工具就会出现在第一个,回车之后,输入关键字搜索node_modules中的依赖包
4. 查看搜索依赖包的package.json文件中的`"main": "nprogress.js",`可以看到指定该包目录引入的就是nprogress.js文件

封装文件在请求拦截器和影响拦截器使用nprogress:src/uitls/ajax.js
```js
import axios from "axios"
import nprogress from "nprogress"  // 引入nprogress
// 创建一个和axios工具具有相同功能的一个实例,相当于axios的一个复制品
const service = axios.create({
  baseURL: '/api', // 设置所有接口的公共路径,每次请求都带着这个表示走代理
  timeout: 5000 // 设置超时时间
})
// 请求拦截器,每个ajax请求都要经过,一般给服务器添加额外的请求头,比如token
service.interceptors.request.use((config) => {
  nprogress.start() // 开启进度条
  return config
})
// 响应拦截器,每个响应都要经过
service.interceptors.response.use(
  // 响应成功的情况
  response => {
    nprogress.done() // 关闭进度条 
    // response.data就是响应的数据,响应的数据格式中还有一个data才是我们需要的数据
    return response.data
  },
  // 响应失败的情况
  error => {
    nprogress.done()  // 关闭进度条
    // 统一处理错误
    alert('发送ajax请求失败'+error.message || '未知错误')
    // return Promise.reject(new Error('发送ajax请求失败')) 这种方式可以继续处理错误
    return new Promise(() => { }) // 返回pending状态的promise实例,这种方式中断了promise链条,无法继续处理
  }
)
// 将封装的axios暴露出去
export default service
```

## 请求接口函数文件

使用请求接口函数对接口进行统一的管理,当需要使用接口的时候,直接调用方法就可以
1. 创建src/api/index.js文件,该文件存储请求接口函数
2. 引入封装好的二次封装的axios文件,然后根据接口写请求接口函数

请求接口函数文件:
1. axios有两种使用方式,对象用法和函数用法,这里使用了函数用法
2. 三种参数,params参数和query参数以及请求头参数
   - prams参数,是在url当中携带,属于路径的一部分
   - query参数,可以在url当中携带,也可以在配置对象当中配置,配置的属性名是params
   - 请求体参数,在配置对象当中的data里面去配置
   
```js
import request from "@/utils/request"
// 分别暴露出去,这种写法带括号了,所以要return,如果一行代码不用{},可以直接省略return
export const reqCategoryList=()=>{
  return request({
    url:'/product/getBaseCategoryList',
    method:'get'
  })
}
```

**验证请求是否成功的两种方式**
1. 在请求接口函数文件中直接调用函数,然后在main.js中引入该请求函数文件`import './api/index'`,让该文件执行,就会调用方法(只执行一下就不需要接收)
2. 在mian.js中引入请求接口函数文件暴露的函数,然后在直接调用函数即可

第二种方式验证请求是否成功:
```js
import {reqCategoryList} from '@/api' // 分别暴露的引入方式
reqCategoryList()
```

测试访问不成功出现404错误,通过network查看请求地址为下面,默认访问的是本地,而本地没有这个资源
```sh
http://localhost:8080/api/product/getBaseCategoryList
```

**配置代理访问**
1. 在vue.config.js中进行配置
2. 配置内容:webpack官网->配置->devServer->proxy
3. 配置之后重启项目之后,测试请求能够获取到响应数据

配置的具体内容如下:
```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // 为了解决自动打开浏览器之后,访问的地址是0.0.0.0问题
    port:8080,
    host:'localhost',
    /* 
      发送请求没有写请求的域名和端口号:直接就是请求的资源/product/getBaseCategoryList
      那么就去本地去这里找资源:http://localhost:8080/api/product/getBaseCategoryList
      但是拼接了api前缀,表示要走代理,所以就去http://39.98.123.211/api/product/getBaseCategoryList找资源
      因为我们本身的资源路径就带有api,所以不用去掉前缀,就不需要配置pathRewrite: { '^/api': '' },
    */
    proxy: {
      '/api': {
        // 转发目标服务器地址
        target: 'http://39.98.123.211',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
```

## Vuex的环境搭建

**整体步骤**
1. 安装Vuex:`npm i vuex@3`
2. 创建src/store/index/js文件,该文件中引入并使用Vuex,并且暴露出一个`Vuex.Store({})`
3. 在main.js中引入暴露的Vuex,并且在Vue的配置项中进行注册

**模块化开发**
1. 创建store/home.js文件,该文件专门存储Home组件相关的数据
2. 在store/index.js文件(总stroe)中引入模块并且使用`modules`进行配置
3. state,muations,actions,getters在本身的模块中去写,但是最终还是合并到了总的store中,所以会产生命名空间的问题
   - state在获取的时候需要指定模块`this.$store.state.home`
   - 对于muations,actions,getters的获取,不需要指定具体的模块,相当于在总的store中,如果需要开启单独的空间,需要在模块中使用`namespaced: true`开启命名空间
   - state中的数据天生不会产生冲突,相当于$store,下面的state中一个user模块有一个home模块,分别存储内容
   - actions和其他模块中的会产生冲突(同名),但是不会覆盖,而是以数组的方式存储,如果调用同名,则两者都会被调用
   - 如果开启了命名空间,则都不会被调用,结构变成了根state一样,$store,下面的actions,actions下面有user模块和home模块

开启命名空间的一个测试:
```js
import { mapState } from 'vuex'
export default {
  name: "TypeNav",
  mounted(){
    console.log(this)
    // 没有开启命名空间,则两个模块的都会被调用,开启了之后不可用,就变成根state一样的状态
    // this.$store.dispatch('show')
    //开启之后的调用
    // this.$store.dispatch('home/show')
  },
  computed:{
    // 没有开启命名空间可用,开启命名空间也可用
    // ...mapState({name:(state)=>state.user.name})
    // 开启命名空间之后,第一个参数可以指定模块名,获取指定模块的内容
    ...mapState('home',['name'])
  }
};
```

scr/store/index.js文件,总的store:
```js
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 模块化省略了总的state,muations,actions和getters
// 引入category模块
import home from './home'
export default new Vuex.Store({
  // Vuex的模块化开发
  modules:{home}
})
```

在mian.js中的注册:
```js
import store from '@/store'
new Vue({
  router, // 在所有的组件内部都可以使用this.$router和this.$route
  store, // 注册之后所有的组件都可以使用$this.$store
  render: h => h(App),
}).$mount('#app')
```

**Vuex的编写**
1. 因为是获取的是Home组件需要的数据,所以在src/store/home.js中写Vuex的三连环操作
2. 需要引入请求接口函数文件,因为需要掉用该文件的方法发送请求获取数据

src/store/home.js文件,Home模块文件
```js
import { reqCategoryList } from "@/api" // 引入请求接口函数
const state = {
  categoryList: [] // 数据的定义要看请求接口返回的数据data是什么类型
}
const mutations = {
  RECEIVE_CATEGORYLIST(state,categoryList){
    state.categoryList = categoryList
  }
}
const actions = {
  async getCategoryList({commit}){ // 一个上下文对象,解构出commit,用来提交mutations
    // async和await可以通过同步代码实现异步效果,可读性比较强
    const result = await reqCategoryList()
    // 我们只需要接收成功的结果,标准做法应该用trycatch处理失败,但是失败在封装axios的响应拦截器中已经处理了
    if(result.code === 200){
      commit('RECEIVE_CATEGORYLIST',result.data)
    }
  }
}
const getters = {}
export default {state,mutations,actions,getters} 
```

**发送请求获取数据进行展示**
1. 在TypeNav组件的`mounted`中通过`dispath`调Vuex中的actions发送请求
2. 在TypeNav组件中使用计算属性来简化数据的获取(将Vuex中的数据拿到Vue中)
3. 拿到了数据就可以使用`v-for`遍历展示数据

```js
// 引入映射文件
import { mapState } from 'vuex';
export default {
  name: "TypeNav",
  mounted(){
    // dispathc就是分发触发的意思,和emit意思一样,本质就是在调用actions中的函数,发送请求将数据存储到Vuex中
    // 注意:数据存储在Vuex中,但是Vue中没有,Vue使用数据需要向Vuex中去获取
    this.$store.dispatch('getCategoryList')
  },
  computed:{
    // 将Vuex中的数存储在Vue中,通过计算属性简化数据的获取,因为state使用了模块化开发,这里就必须使用对象形式
    // 使用数组需要满足的条件:1. 数据就是总的state中的数据,数组当中的名字必须和state当中的名字一致
    // 同时要注意,计算属性是根据已经有的数据计算的来的,优先级别叫低,会等待actios中的异步数据得到结果才会计算
    ...mapState({categoryList:state=>state.home.categoryList})
  }
};
```

## TypeNav组件的完成

**鼠标移入移出实现二三级分类的显示和隐藏**

原本的移入移出显示二级分类和三级分类是通过样式的`:hover`来控制的
```css
/* &代表的是item,所以给item添加事件,每一个item一级分类之后,让他下面的item-list隐藏或者显示 */
&:active {  
  background-color: #e1251b;
  .item-list {
    display: block;
  }
}
```

现在通过强制绑定class来控制,先将样式中的`:hover`改为一个样式
```css
&.active {
  background-color: #e1251b;
  .item-list {
    display: block;
  }
}
```

实现步骤:
1. 定义数据,currentIndex,当`currentIndex===index`的时候就强制绑定class
2. 原本直接给item添加移入移出事件就可以实现效果,但是效果要求移出h2全部商品分类,才隐藏二级分类和三级分类
3. 所以采用事件委派的方式,将鼠标移出事件添加给div,(这个div是额外的包裹解构,因为内部的h2和sort采用的是绝对定位所以不会影响布局)
   - 如果不采用时间委派直接给h2(全部商品分类添加移出效果)则只有移出h2的时候每一个item-list才会隐藏 
```html
<div @mouseleave="currentIndex=-1">
  <h2 class="all">全部商品分类</h2>
  <!-- sort部分就是整个三级分类 -->
  <div class="sort">
    <div class="all-sort-list2">
      <!-- 强制绑定class样式,根据定义的数据currentIndex,移出事件可以添加到这里,但是不符合设计要求,所以将全部商品分类的h2使用sort用一个div包裹,将移出事件放在包裹的div身上,利用事件委派 -->
      <div class="item" :class="{active:currentIndex===index}" v-for="(c1,index) in categoryList" :key="c1.categoryId" @mouseenter="currentIndex = index">
        <h3>
          <a href="">{{c1.categoryName}}</a>
        </h3>
        <div class="item-list clearfix">
          <div class="subitem">
            <dl class="fore" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
              <dt>
                <a href="">{{c2.categoryName}}</a>
              </dt>
              <dd>
                <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                  <a href="">{{c3.categoryName}}</a>
                </em>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```


**函数的防抖和节流**

将移入事件不在写入html标签,中而是定义成一个方法,并且打印对应的index
```js
methods:{
  moveInItem(index){
    this.currentIndex = index
    console.log(index)
  }
},
```

问题:***当快速的移入所有的item,按道理来说移入了每一个item,则对应的回调函数都应该被触发,但是并非都触发了,如果回调函数中有大量的计算,触发的有很快,就会发生卡顿现象***

什么是防抖和节流:
1. 正常:事件触发的非常频繁,而且每一次的触发,回调函数都去执行(如果时间很短,且函数内部大量计算,就会出现卡顿)
2. 防抖(只触发一次):前面所有的触发都被取消掉,最后一次执行在规定的时间之后才会触发,也就是说如果快速连续的触发,只会执行一次,将大量的触发变为一次触发
3. 节流(频繁触发变为少量触发):在固定的时间间隔内不会重复的触发回调,只有大于这个时间间隔才会触发回调,将大量的触发变为少量的触发

lodash的使用:
1. lodash的[官网](https://www.lodashjs.com/)
1. 是一个依赖包,不需要单独的安装,因为初始化项目的时候项目当中依赖了该包
2. 引入lodash的方式
   - 全部引入,引入全部:`import _ from 'lodash' // loadsh暴露出来的是一个_`
   - 按需引入,只引入需要使用的函数:`import throttle from 'lodash/throttle'`
3. lodash的防抖函数和节流函数,返回值是一个函数,是节流后和防抖后的函数,所以在methods中定义方法的时候,不能用简写形式,写成key:value的形式
   - 防抖函数:`_.debounce()`
   - 节流函数:`_.throttle()`

使用节流函数改进鼠标移入事件:
问题:当鼠标移走之后,list-item项可能还会显示,因为默认节流函数是在指定的时间间隔之后调用的,在时间间隔之内我已经移出去了,但是刚移出到时间它才执行
注意:***内部使用this,不要使用箭头函数,并且理解第三个参数的含义***
```js
methods:{
  // trailing:false默认为true,也就是在间隔事件结尾执行回调,会导致鼠标移出之后才执行,则样式会停留在item上,所以将其设置为true
  // trailing:是否在事件间隔之后执行函数,默认为true
  // leading:是否在时间间隔之前执行函数,默认为false
  moveInItem:throttle(function(index){ // 返回的函数是节流后的函数,之前定义的函数名不变,不能使用对象中函数的简写形式
    this.currentIndex = index
    console.log(index)
    // 设置为false,让其在时间间隔之间执行
  },20,{trailing:false})
},
```

**点击三级分类导航跳转到Search组件并且携参数**

三种实现方式:
1. 使用`<router-link>`替换原有的超链接标签进行跳转
   - `<router-link>`是组件标签,每一个组件表示是一个VueComponent的构造含糊,标签使用一次就创建一个该构造函数的实例对象,三层for循环生成大量的实例,内存中有大量的组件标签实例,会造成卡顿现象
2. 绑定事件使用编程式导航`push`进行跳转,需要给每一个a标签添加事件,触发编程式导航的跳转,但是这种方式三层for循环绑定了大量的回调函数
   - ***=右侧只要是出现`[]`代表一个新的数组出现,=右侧出现`{}`代表一个对象出现,=右侧出现一个`function`内存中就会有一个新的函数***
3. 使用事件委派和编程式导航结合跳转
   - 事件委派使用的场景:子元素绑定同样的事件,以及新增的子标签和其他子标签一样拥有相同的事件
   - 给事件添加在共有的最近的且唯一的祖先元素身上(这里共同的父元素是item,但是time身上有循环,所以在找上一层)

**event事件对象的深入理解**
1. 每一次触发事件的时候,系统(浏览器内核)会把这一次触发事件相关的所有信息,封装为一个对象
2. 在浏览器调用回调函数(我们自己定义,自己没有调用,最后却执行了)的时候,会自动传递一个回调函数的第一个形参
3. $event就是浏览器在调用回调函数的时候传递的事件对象

**自定义属性**

如何确定点击的是超链接标签和点击的是几级分类,需要借助自定义属性
1. 自定义属性是以`data-xxx`开头的属性
2. 标签元素的`dataset`属性能够获取到自定义属性组成的对象,对象中的属性为自定义属性,并且去掉data前缀改为小写字母(因为标签上的属性默认就是小写的)




**三级分类中sort部分的显示和隐藏**

在Home组件中和Search组件中都需要三级分类,并且在Home组件中三级分类的sort部分是显示的,而在Serach组件(其他组件)上来时隐藏的,只有当鼠标移入h2全部商品分类标题的时候才会显示,并且移出隐藏
1. 定义一个数据让sort部分上来就是显示的
2. 在`mounted`的时候通过路径判断,然后改变数据来决定sort部分是显示还是隐藏
3. 当鼠标移入h2全部商品分类的时候,让其显示
4. 移出的是时候让其隐藏,已经有事件了,但是需要添加逻辑,所以修改为回调函数

**给sort的显示和隐藏添加过渡动画**
1. 谁要添加过渡就给谁包裹一个`<transition name="sort">`,name表示类名的前缀,如果指定了就不需要使用`v`开头,并且如果添加了`:appear="true"`属性,则过渡会在一上来就执行一次
2. 定义样式`enter`表示开始进入,`enter-to`表示进入完毕,`enter-active`表示过程[文档](https://cn.vuejs.org/v2/guide/transitions.html)

在.sort类中添加如下用户动画过渡的类,进入和离开都添加过渡效果
```css
.sort-enter,.sort-leave-to {
  opacity: 0;
}
.sort-enter-to,.sort-leave {
  opacity: 1;
}
.sort-enter-active,.sort-leave-active {
  transition: all .5s;
}
```

**优化TypeNav中发送多次请求**

当在Home组件和Search组件进行切换的过程中,因为Home组件和Search组件都是路由组件,切换会被销毁重建,其中使用的TypeNav组件就会重建而`mounted`就会被执行多次,获取三级分类的数据就会重复发送,而三级分类的数据都一样的,不需要重复发送

解决:将发送请求获取三级分类的数据在App.js中的`mounted`发送
```js
export default {
  name:'App',
  components:{Header,Footer},
  mounted(){
    this.$store.dispatch('getCategoryList')
  }
}
```

**合并参数的问题**

点击三级分类和点击Header中搜索的参数,在进行查询的时候都需要接口都需要这些参数,所以都需要携带过去
1. 点击三级分类导航跳转到Search组件的时候,需要将通过点击Header组件中的搜索按钮传递的params参数合并
2. 而点击Header中搜索按钮跳转到Search组件的时候,需要将通过三级分类跳转到Search的query参数合并

Header组件点击按钮跳转到Search组件的方法
```js
methods:{
  toSearch(){
    // undefined是为了解决指定了params参数但是传递的是一个空字符串的bug
    const location = {name:'search',params:{keyword:this.keyword || undefined}}
    // 这里其实不需要判断,直接添加就可以
    if(this.$route.query) {
      location.query = this.$route.query
    }
    this.$router.push(location)
  }
}
```

TypeNav组件中的html:
```html
<!-- 移入h2商品分类控制数据让sort显示  -->
<div @mouseleave="moveOutDiv" @mouseenter="isShow = true">
  <h2 class="all">全部商品分类</h2>
  <!-- 添加过渡效果需要使用transition标签将需要过渡的内容包裹,并且过渡的内容必须v-if或者v-show -->
  <transition name="sort">
    <!-- sort部分就是整个三级分类 -->
    <div class="sort" v-show="isShow">
      <div class="all-sort-list2" @click="toSearch">
        <!-- 强制绑定class样式,根据定义的数据currentIndex,移出事件可以添加到这里,但是不符合设计要求,所以将全部商品分类的h2使用sort用一个div包裹,将移出事件放在包裹的div身上,利用事件委派 -->
        <div class="item" :class="{active:currentIndex===index}" v-for="(c1,index) in categoryList" :key="c1.categoryId" @mouseenter="moveInItem(index)">
          <h3>
            <!-- 自定义属性传递的参数是id和name -->
            <a :data-category1Id="c1.categoryId" :data-categoryName="c1.categoryName">{{c1.categoryName}}</a>
          </h3>
          <div class="item-list clearfix">
            <div class="subitem">
              <dl class="fore" v-for="c2 in c1.categoryChild" :key="c2.categoryId">
                <dt>
                  <a :data-category2Id="c2.categoryId" :data-categoryName="c2.categoryName">{{c2.categoryName}}</a>
                </dt>
                <dd>
                  <em v-for="c3 in c2.categoryChild" :key="c3.categoryId">
                    <a :data-category3Id="c3.categoryId" :data-categoryName="c3.categoryName">{{c3.categoryName}}</a>
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
```

TypeNav中的逻辑交互部分:
```js
import { mapState } from 'vuex';
import throttle from 'lodash/throttle'
export default {
  name: "TypeNav",
  data(){
    return {
      // 控制输入移出移出一级分类,二级分类和三级分类的显示和隐藏
      currentIndex:-1,
      // 控制三级分类sort部分的显示隐藏
      isShow:true
    }
  },
  methods:{
    // trailing:false默认为true,也就是在间隔事件结尾执行回调,会导致鼠标移出之后才执行,则样式会停留在item上,所以将其设置为true
    // trailing:是否在事件间隔之后执行函数,默认为true
    // leading:是否在时间间隔之前执行函数,默认为false
    moveInItem:throttle(function(index){
      this.currentIndex = index
    },20,{trailing:false}), 
    // 事件委派,点击跳转到Search组件
    toSearch(event){
      const target = event.target // 获取目标元素
      // dataset方法会将自定义事件封装为一个对象,不过属性都变成了小写形式,解构出需要的数据
      const {category1id,category2id,category3id,categoryname} = target.dataset
      // 确定点击的是a标签
      if(categoryname) {
        const location = {name:'search'}
        const query = {categoryName:categoryname}
        // 确定点击的是几级分类,服务器需要的参数类型是大写的,所以我们要写成大写的,赋值是从dataset中取出的数据天然小写
        // 在标签上使用data-定义自定义属性,默认在标签上都会变为小写形式
        if(category1id){
          query.category1Id = category1id
        }else if(category2id){
          query.category2Id = category2id
        }else {
          query.category3Id = category3id
        }
        location.query = query
        // 合并params参数,点击搜索也会跳转到search页面,搜索的关键字是也需要携带过去,在进行搜索的时候服务器需要这些参数
        // 并且这里需要注意,不需要if判断,因为params是空对象,进行判断为true
        if(this.$route.params){
          location.params = this.$route.params
        }
        this.$router.push(location)
      }
    },
    // 鼠标移出div,让改变currentIndex,并且让srot隐藏
    moveOutDiv(){
      this.currentIndex = -1
      if(this.$route.path !== '/home'){
        this.isShow = false
      }
    }
  },
  mounted(){
    // dispathc就是分发触发的意思,和emit意思一样,本质就是在调用actions中的函数,发送请求将数据存储到Vuex中
    // 注意:数据存储在Vuex中,但是Vue中没有,Vue使用数据需要向Vuex中去获取
    // 避免重复发送请求,将发送请求放在App.js中的mounted中
    // this.$store.dispatch('getCategoryList')
    // sort部分的显示和隐藏
    if(this.$route.path !== '/home'){
      this.isShow = false
    }
  },
  computed:{
    // 将Vuex中的数存储在Vue中,通过计算属性简化数据的获取,因为state使用了模块化开发,这里就必须使用对象形式
    // 使用数组需要满足的条件:1. 数据就是总的state中的数据,数组当中的名字必须和state当中的名字一致
    ...mapState({categoryList:state=>state.home.categoryList})
  }
};
```


## ListContainer组件(主要处理轮播图)

### mock

>生成随机数据,拦截ajax请求(模拟接口需要本地数据)

**使用步骤:**
1. 安装mock:`npm i mockjs`
2. 准备模拟的数据
   - 创建src/mock/banner.json模拟banner需要的数据,创建你mock/floor.json模拟Floor组件需要的数据
3. 使用mock的语法模拟接口
   - 创建src/mock.mockServer.js文件,在该文件中引入模拟的数据,然后使用`mock()`方法模拟接口
   - 在main中引入mock/mockServer.js:`import '@/mock/mockServer'`

src/mock/banner.json:模拟的banner数据
```json
[
  {
    "id": "1",
    "imgUrl": "/images/banner1.jpg"
  },
  {
    "id": "2",
    "imgUrl": "/images/banner2.jpg"
  },
  {
    "id": "3",
    "imgUrl": "/images/banner3.jpg"
  },
  {
    "id": "4",
    "imgUrl": "/images/banner4.jpg"
  }
]
```

src/mock/floor.json:模拟的Floor数据
```json
[
  {
    "id": "001",
    "name": "家用电器",
    "keywords": [
      "节能补贴",
      "4K电视",
      "空气净化器",
      "IH电饭煲",
      "滚筒洗衣机",
      "电热水器"
    ],
    "imgUrl": "/images/floor-1-1.png",
    "navList": [
      {
        "url": "#",
        "text": "热门"
      },
      {
        "url": "#",
        "text": "大家电"
      },
      {
        "url": "#",
        "text": "生活电器"
      },
      {
        "url": "#",
        "text": "厨房电器"
      },
      {
        "url": "#",
        "text": "应季电器"
      },
      {
        "url": "#",
        "text": "空气/净水"
      },
      {
        "url": "#",
        "text": "高端电器"
      }
    ],
    "carouselList": [
      {
        "id": "0011",
        "imgUrl": "/images/floor-1-b01.png"
      },
      {
        "id": "0012",
        "imgUrl": "/images/floor-1-b02.png"
      },
      {
        "id": "0013",
        "imgUrl": "/images/floor-1-b03.png"
      }
    ],
    "recommendList": [
      "/images/floor-1-2.png",
      "/images/floor-1-3.png",
      "/images/floor-1-5.png",
      "/images/floor-1-6.png"
    ],
    "bigImg": "/images/floor-1-4.png"
  },
  {
    "id": "002",
    "name": "手机通讯",
    "keywords": [
      "节能补贴2",
      "4K电视2",
      "空气净化器2",
      "IH电饭煲2",
      "滚筒洗衣机2",
      "电热水器2"
    ],
    "imgUrl": "/images/floor-1-1.png",
    "navList": [
      {
        "url": "#",
        "text": "热门2"
      },
      {
        "url": "#",
        "text": "大家电2"
      },
      {
        "url": "#",
        "text": "生活电器2"
      },
      {
        "url": "#",
        "text": "厨房电器2"
      },
      {
        "url": "#",
        "text": "应季电器2"
      },
      {
        "url": "#",
        "text": "空气/净水2"
      },
      {
        "url": "#",
        "text": "高端电器2"
      }
    ],
    "carouselList": [
      {
        "id": "0011",
        "imgUrl": "/images/floor-1-b01.png"
      },
      {
        "id": "0012",
        "imgUrl": "/images/floor-1-b02.png"
      },
      {
        "id": "0013",
        "imgUrl": "/images/floor-1-b03.png"
      }
    ],
    "recommendList": [
      "/images/floor-1-2.png",
      "/images/floor-1-3.png",
      "/images/floor-1-5.png",
      "/images/floor-1-6.png"
    ],
    "bigImg": "/images/floor-1-4.png"
  }
]
```

src/mock/mockServer.js文件模拟接口,注意该文件需要在main.js中执行一次,否则不会生成随机数据
```js
import Mock  from "mockjs"
import banner from './banner'
import floor from './floor'
// 第一个参数代表请求的路径,第二个参数代表返回的数据,使用一个对象模拟我们返回数据的格式
Mock.mock('/mock/banner',{code:200,data:banner})
Mock.mock('/mock/floor',{code:200,data:floor})
```

**使用mock模拟的接口获取数据**
1. 在utils目录中新建一个mockAjax.js文件用来封装专门给mock模拟的接口发送请求的axios,只需要改变baseURL:`baseURL: '/mock'`
2. 在src/api/index.js就写请求接口函数
3. 在store/home.js中写Vuex获取mock模拟的数据
4. mock会拦截ajax请求,所以请求发不出去,通过浏览器控制台的network选项卡,无法查看请求,可以通过Vue开发者工具查看Vuex中的数据

请求接口函数内容:
```js
// 引入给mock接口发送请求的axios
import mockRequest from '@/utils/mockAjax'
// 获取banner的数据
export const reqBannerList = () => {
  return mockRequest({url:'/banner',method:'get'}) // 封装的ajax中共baseUrl设置了前缀,这里就不添加了
}
// 获取floor的数据
export const reqFloorList = ()=>{
  return mockRequest({url:'/floor',method:'get'})
}
// 模拟之后发送请求实际请求的是该地址:http://localhost:8080/mock/product/getBaseCategoryList
// 因为在baseURL中有mock,所以就被mock拦截,获取到的是mock的数据
```

src/store/home.js文件内容:
```js
import { reqCategoryList,reqBannerList, reqFloorList } from "@/api" // 引入请求接口函数
const state = {
  categoryList: [], // 数据的定义要看请求接口返回的数据data是什么类型
  bannerList: [],
  floorList:[]
}
const mutations = {
  RECEIVE_CATEGORYLIST(state,categoryList){
    state.categoryList = categoryList
  },
  RECEIVE_BANNERLIST(state,bannerList){
    state.bannerList = bannerList
  },
  RECEIVE_FLOORLIST(state,floorList){
    state.floorList = floorList
  }
}
const actions = {
  async getCategoryList({commit}){ // 一个上下文对象,解构出commit,用来提交mutations
    // async和await可以通过同步代码实现异步效果,可读性比较强
    const result = await reqCategoryList() // 我们只需要接收成功的结果,而失败在封装axios的响应拦截器中已经处理了
    if(result.code === 200){
      commit('RECEIVE_CATEGORYLIST',result.data)
    }
  },
  async getBannerList({commit}){
    const result = await reqBannerList()
    if(result.code === 200){
      commit('RECEIVE_BANNERLIST',result.data)
    }
  },
  async getFloorList({commit}){
    const result = await reqFloorList()
    if(result.code === 200){
      commit('RECEIVE_FLOORLIST',result.data)
    }
  }
}
const getters = {}
export default {state,mutations,actions,getters} 
```

**banner数据的展示**

注意:
1. 模拟数据图片的地址是`"imgUrl":"/images/banner1.jpg"`,/表示根目录,public就是根目录
2. 请求的完整路径是:http://localhost:8080/images/banner1.jpg 404 (Not Found)
3. http://localhost:8080代表的就是public目录,所以需要在该目录下创建images目录,将图片放在其中


ListContinaer中获取数据:
```js
import { mapState } from 'vuex';
export default {
  name: "ListContainer",
  mounted(){
    this.$store.dispatch('getBannerList')
  },
  computed:{
    ...mapState({bannerList:state=>state.home.bannerList})
  }
};
```

**Floor组件数据的展示**

注意:***Floor组件的数据应该在Home组件中获取,因为Floor的数据应该通过`v-for`在Home组件中遍历得出,然后通过属性的方式传递给Floor组件***

Home组件中获取数据
```js
export default {
  name:'Home',
  components:{ListContainer,Recommend,Like,Floor,Rank,Brand},
  mounted(){
    this.$store.dispatch('getFloorList')
  },
  computed:{
    ...mapState({floorList:state=>state.home.floorList})
  }
}
```

### Swiper

**使用步骤**
1. 安装Swiper使用5版本:`npm i swiper@5`
2. 在需要使用Swiper的组件中引入Swiper:`import Swiper from 'swiper'`
3. 在main.js中引入Swiper的样式(因为很多地方需要使用):`import 'swiper/css/swiper.min.css'`
4. 在需要使用轮播图的地方使用轮播图的解构并且创建Swiper实例[官网文档](https://www.swiper.com.cn/usage/index.html)

注意:***Swiper的实例对象必须在页面的数据结构显示完成之后创建才会生效***

**使用Swiper实现banner的轮播**

轮播图的结构:
```html
<!--banner轮播-->
<div class="swiper-container" ref="bannerSwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
      <img :src="banner.imgUrl" />
    </div>
  </div>
  <!-- 如果需要分页器 -->
  <div class="swiper-pagination"></div>

  <!-- 如果需要导航按钮 -->
  <div class="swiper-button-prev"></div>
  <div class="swiper-button-next"></div>
</div>
```

第一种实现方式:***在`mounted`中配合定时器来实现***
```js
mounted(){
  this.$store.dispatch('getBannerList') // 异步代码
  // 实例化Swiper实例,的时候异步代码没有执行,也就是没有数据
  setTimeout(() => {
    /* 
     挂载完成去实例化swiper,这样不行,因为实例化的时候,页面不一定显示成功,按道理来说挂载完成,页面的dom就算完成了,在此实例化是可以的,但是,这个页面当中的wiper-slide是根据请求回来的数据
     动态创建生成的,所以必须得保证数据回来之后,在去实例化,有了数据,v-for的结构才会生成
    */
    var mySwiper = new Swiper (this.$refs.bannerSwiper, { //同步代码,在数据回来之,结构形成之前,就已经实例化了,所以无法生效,使用定时器指定一个时间,banner部分和floor部分的轮播都生效了
      // 第一个参数是容器,因为是单页面应用,不是同一个组件,但是最终会在同一个组件,所以Floor中的轮播的class和这里相同,所以Floor中的轮播也生效了,为了避免多个组件冲突,使用ref解决
      loop: true, // 循环模式选项        
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        clickable :true, //  让小圆点生效
      },
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    })  
  }, 2000);
},
```
第二种方式实现:***使用监视属性`watch`配合`this.$nextTick()`***

>在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。
理解:
1. 如果有for循环生成结构,那么数据没有的时候就是第一次for循环,那么有了数据之后的for循环就是下次DOM更新
2. 数据修改之后,如果引起了DOM结构的变化,那么也会执行回调获取更新的DOM

总结:***最近一次dom更新之后,执行`$nextTick()`其中的回调***

和`updated`的区别:***update只要页面有数据更新就会执行,不关心是不是最近的一次***

```js
watch:{
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
}
```

**实现Floor组件中的轮播图**

Floor中的轮播图直接在`mouted`中创建Swiper的实例对象就直接能够生效
原因:
1. ***在banner的时候,数据是在mouted里面请求的,必须等数据请求回来之后,根据数据创建好结构,才能实例化Swiper***
2. ***而在Floor中,不需要请求数据,数据是父组件传递过来的,而且Foor组件的创建必须是根据请求回来的数据`v-for`创建的,所以Floor中实例化的时候数据一定是存在的,结构也就不需要等待数据,早早就形成了***
```js
import Swiper from 'swiper'
export default {
  name: "Floor",
  // 接收传递过来的楼层数据
  props: ["floor"], 
  // 前提条件,该组件本身是通过v-for生成的,那么就有数据了,不需要等待数据,然后挂载完成表示页面结构完成(这个不知道是否准确)
  // 之前的是没有数据,然后需要异步任务将数据来了,挂载完成结构没有生成
  // 数据从父组件传递过来原本已经存在,也没有改变,不需要dom更新渲染直接就是完整的结构,所以在moutned中就可以完成
  mounted() {
    var mySwiper = new Swiper(this.$refs.floorSwiper, {
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
  },
};
```

**实现轮播组件的封装**

看看Floor中的轮播组件和Banner中的轮播组件是否能够更改为相同的实现方式

Floor中更改为使用监视属性`watch`和`$nextTick()`来实现:***因为监视的数据是从父组件传递过来的,没有变化的过程,所以使用`immediate:true`,上来就执行一次,这样将Banner中的轮播添加上该属性配置,就和Floor一模一样了***
```js
watch: {
  floor: {
    // 监视属性数据是传递过来的没有变化的过程所以监视不到,不会执行Swiper的实例就不会创建,所以先执行一次
    // immediate:true给listContainer中添加也没有问题,上来执行一次,等数据改变在此执行一次没有任何影响
    immediate:true,
    handler() {
      this.$nextTick(() => {
        var mySwiper = new Swiper(this.$refs.floorSwiper, {
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
```
封装轮播组件:因为是多个组件使用,所以定义在components目录中,注册在全局
封装的轮播组件
```html
<template>
  <!--banner轮播-->
  <div class="swiper-container" ref="bannerSwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="banner in bannerList" :key="banner.id">
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
// css部分也在这里引入
import 'swiper/css/swiper.min.css'
export default {
  name: "Carousel",
  // 监视的是bannerList,所以父组件在使用该组件的时候需要通过属性传递名称为bannerList的数组结构
  props:['bannerList'],
  watch: {
    // 即使有数据,但是也不能保证结构就有了,因为结构式通过`v-for`来形成的
    bannerList: {
      immediate: true,
      handler() {
        // nextTick保证dom结构更新完毕
        this.$nextTick(() => {
          var mySwiper = new Swiper(this.$refs.bannerSwiper, {
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

```

删除轮播相关的内容,直接在ListContainer中使用轮播组件:
```html
<!-- 传递数据 -->
<Carousel :bannerList="bannerList" />
```

删除轮播相关的内容,直接在Floor中使用轮播组件:
```html
<Carousel :bannerList="floor.carouselList" />
```

## Search组件(主要是搜索和分页)

### 静态组件

**静态组件直接使用教程课件提供的组件,其中有一个子组件SearchSelector**

**初始化动态数据展示**
1. 在src/api/index.js中写获取搜索数据的请求接口函数
2. 新建src/store/search.js文件,在该文件中写该模块的Vuex,***不要忘记将模块化的Vuex进行合并***
3. 使用getters简化数据的获取
   注意:***之前存储到state中的内容直接是一个数组,拿过来就遍历,这次获取到的是一个对象,对象里面包含数组,所以使用getters简化数据获取**
4. 在Search组件中发送请求将数据存储在Vuex中,并且使用getters将数据从Vuex中转换到Vue中

请求接口函数:**该函数需要一个参数,为请求体参数,这个参数是用来搜索的对象,可以通过接口文档查看数据格式**
```js
// 获取搜索数据的请求接口函数
export const reqSearchInfo = (searchParams) =>{
  // searchParams参数是用户发送请求需要传递的参数,该参数必须是一个对象,可以是空对象,空对象获取默认数据,用来展示
  return request({url:'/list',method:'post',data:searchParams})
}
```

存储Search数据的Vuex文件:src/store/search.js
注意:
1. ***用户在`dispath`的时候传递的参数只能方法上下文对象之后,作为第二个参数使用,并且只能传递一个参数,有多个数据要封装为对象传递,如果传递了第三个参数,则获取到的是undefined***
2. ***异步任务发送请求获取数据,可能数据还没有获取到,但是代码会继续执行,所以getters中获取到的可能是一个空对象,空对象.一个数据为undefined,为了避免undefined,所以要`|| []`***
```js
import { reqSearchInfo } from "@/api"
const state = {
  // 数据的定义是根据返回的data来定义的
  searchInfo: {}
}

const mutations = {
  RECEIVE_SEARCHINFO(state, searchInfo) {
    state.searchInfo = searchInfo
  }
}
const actions = {
  // 用户dispath的时候传递过来的参数
  async getSearchInfo({ commit }, searchParams = {}) {
    const result = await reqSearchInfo(searchParams)
    if (result.code === 200) {
      commit('RECEIVE_SEARCHINFO', result.data)
    }
  }
}
// 简化数据的获取
const getters = {
  /* 
    state中的searchInfo是一个对象类型,需要使用里面的数组,用mapState获取后,直接使用起来需要searchInfo.goodsList,比较麻烦,使用getters简化数,那么在使用的时候使用mapGetters得到就可以直接使用
    并且上面发送请求为异步代码,程序会继续执行,执行到这里,如果没有searchInfo数据就是一个空对象,空对象.属性会得到undefiend,避免这种情况,如果没有数据时为undefined,就变成空数组(原本的数据格式就是数组)
  */
  attrsList: state => state.searchInfo.attrsList || [],
  goodsList: state => state.searchInfo.goodsList || [],
  trademarkList: state => state.searchInfo.trademarkList || []
}
export default {
  state, mutations, actions, getters
}
```

Search组件中的逻辑操作:
```js
import { mapGetters } from "vuex";
import SearchSelector from "./SearchSelector/SearchSelector";
export default {
  name: "Search",
  components: {
    SearchSelector,
  },
  // 在mounted中调用函数,因为需要多次发送请求,所以将methods中定义发送请求的方法
  mounted() {
    this.getSearchInfo();
  },
  methods: {
    getSearchInfo() {
      this.$store.dispatch("getSearchInfo", {});
    },
  },
  // 在计算属性中,使用mapGetters获取getters中的数据,遍历这个数据,展示商品的信息
  computed: {
    ...mapGetters(["goodsList"]),
  },
};
```

**Search中子组件SearchSelector组件的展示**

因为在Search中使用`dispatch`发送请求获取到了数据,数据存储在Vuex中,所以在SearchSelecor组件中可以获取到getters中的数据
获取到数据使用`v-for`遍历展示数据就可以了
```js
export default {
  name: 'SearchSelector',
  computed:{
    ...mapGetters(['trademarkList','attrsList'])
  }
}
```

### 搜索

**初始化搜索参数,实现三级分类搜索和点击关键字搜索**

三级分类搜索就是点击TypeNav三级分类跳转到Search组件,而关键字搜索就是点击Header组件中的搜索按钮跳转到Search组件
1. 从接口文档中找到发送请求需要的参数,在data中初始化数据
2. 在`mounted`发送请求之前`beforeMount`,收集数据
3. 在发送请求的方法中将之前用做获取初始化数据的空对象替换为收集的数据

**解决只能搜索一次的问题**
1. 发送请求是在`mounted`钩子函数中进行的,该钩子函数在页面挂载的时候只会执行一次,当重新改变搜索条件的时候,不会重新收集参数并且重新发送请求获取数据
2. 使用`watch`监视属性对路由对象`$route`进行监视,当重新点击搜索,或者点击三级分类引起路径的变化,引起路由对象的变化,而重新收集参数发送请求

这里有一个非常要注意的问题:
1. 当路径改变之后,则在路由器对象的路由配置对象,会重新替换整个`this.$route`
2. 这也是为什么监视属性简写形式能够监视到`$route`变化的原因
3. 因为是直接替换,所以原来的参数都已经没有了,在重新搜索的时候也不需要担心搜索参数残留原来的值
4. 在如下代码中有验证的部分,在注释中说明了
```js
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
        props: [""],
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
      // 重新赋值给搜索条件对象
      this.searchParams = searchParams;
    },
    // 获取到的serach数据包括,商品列表,品牌,和属性三个部分,每次重新搜索都需要展示
    getSearchInfo() {
      this.$store.dispatch("getSearchInfo", this.searchParams); // 将空对象替换为参数对象,就能按照条件进行搜索了
    },
  },
  computed: {
    ...mapGetters(["goodsList"]),
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
```

**动态显示搜索条件和删除搜索条件之后重新发送请求获取数据**

点击三级分类后,在全部搜索结果的位置显示categoryName,点击搜索按钮之后,在全部搜索结果位置显示keyword,同时这些动态显示的内容可以删除,删除之后会重新发送请求
1. 本质就是动态的展示数据,data中的初始化参数中有categoryName证明点击了三级分类那么就显示该属性,如果有keyword就显示keyword
2. 删除cateogryName重新搜索,需要重置categoryName和所有的id,然后重新发送请求
3. 删除keyword重新搜索,需要重置keyword,然后重新发送请求
4. 在清空数据的时候,最好赋值`undefined`而不是空字符串,因为空字符串同样会将数据带过去只是值是空字符串,使用undeinfed就不会有该属性了
5. 同时要清除所有的id,因为如果带有id,当清除categoryName和keyword重新发送的请求,不是默认的商品数据列表

为什么在清空categoryName,重新发送请求的时候需要清除categoryId
因为三级分类的搜索是需要配合categoryName和cateogryId来进行搜索的,两者都有效才可以,但是清除的时候又不知道是点击几级分类过来的,所以将三级的categoryId全部清除掉

为什么要使用全局事件总线:search组件要影响header组件,两个组件没有任何关系
1. 自定义事件:是父组件给子组件绑定自定义事件,自定义事件被绑定到了子组件的实例身上,只有子组件才能使用emit方法触发
2. 全局实现总线的原理就是自定义事件,但是需要任何组件都能访问到共有的`$on`和`$meit`等方法,所以将提供方法的Vue实例挂载到Vue原型上,这样所有组件访问的都是同一个(如果不这样做在组件内部使用this的时候,访问的是当前组件的`this.$on`,`this.$emit`,其他组件也看不到)
3. 接收数据的地方`$on`
4. 发送数据的地方`$emit`

注意:
1. ***直接发送请求的话,浏览器路径不会发生改变,所以通过`push`重新发送请求,这样通过引起路径变化,导致监视属性工作,重新发送请求,使用这种方式来引起路径的改变发送请求,任何数据都不需要手动重置,因为发送请求之前会整理参数,可以通过Vue开发者工具查看到***
2. ***删除关键字之后,要通知Header组件中将搜索框的内容清空,现在所在的位置是Search组件,而关键字在Header组件,两者好像没啥事关系,所以使用全局事件总线来实现通信***

为什么使用`push`改变浏览器路径引起监视属性工作就不需要手动的删除参数了呢
1. 因为push引起路径的变化,`$route`也会被整体替换,那么之前的参数都没有了
2. watch中在发送请求整理参数,没有获取到的就是undefiend,会将之前的已有的数据替换为undeinfed

删除关键字和categoryName重新搜索的方法解释:注释很重要
```js
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
  this.$router.push({name:'search',params:this.$route.params})
  
},
// 删除关键字重新搜索,这个就是在分类搜索上继续搜索,所以不用清空id
deleteKeywordForSearch() {
  // this.searchParams.keyword = undefined;
  // this.getSearchInfo();
  // 通过引起路径的变化,导致监视属性工作,同样也不需要手动清除关键字
  this.$router.push({name:'search',query:this.$route.query})
  // 通知header组件清空keyword
  this.$bus.$emit("clearKeyword");  
},
// watch中路径改变重新整理参数，如果删除的是categoryName则query参数都没有整理出来的是undeinfed替换之前的，所以不用手动清空
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
```

**注册全局事件总线**
1. 在main.js中注册全局事件总线,通过`beforeCreate`
2. 在需要传递数据的组件中通过`this.$bus.$emit()`激活事件
3. 在接收数据的组件中的`mounted`中通过`this.$bus.$on()`绑定事件
   - 事件的回调如果直接在第二个参数的位置,就使用箭头函数
   - 如果定义在methods中就直接使用

注册全局实现总线:
```js
new Vue({
  beforeCreate(){
    Vue.prototype.$bus = this  // 全局事件总线
  },
  render: h => h(App),
}).$mount('#app')
```

使用`$emit`
```js
// 删除keyword之后重新进行搜索
removeKeyword(){
  this.searchParams.keyword = ''
  // this.getSearchInfo()
  this.$router.push({name:'search',query:this.$route.query})
  // 然后使用全局事件总线将Header中的关键字进行清空
  this.$bus.$emit('clearKeyword')
}
```

使用`$on`
```js
mounted() {
  // 如果被激活的回调定义在methtods中这样使用
  // this.$bus.$on("clearKeyword",this.clearKeyword)
  // 如果第二个参数是函数,则必须使用箭头函数
  this.$bus.$on('clearKeyword',()=>{
    this.keyword = ''
  })
},
```

**点击品牌进行搜索**

品牌是在Search的子组件中的SearchSelector中,所以需要在SearchSelector使用自定义事件,将数据传递给父组件Search,因为Search中负责发送请求
1. 在子组件中通过自定义事件将trademark传递给父组件
2. 父组件在自定义事件的回调中拼接需要的参数,然后发送请求
3. 当删除品牌的时候,将trademark搜索条件设置为空字符串,然后重新发送请求

注意:***在全部搜索结果展示品牌的时候,使用`v-if`如果使用`v-show`会出现undeinde.调用方法报错的问题***

为什么会有这个问题:
```html
<!-- 
  如果是用v-if则删除品牌之后,整体就没有这个li结构,就不会有报错情况
  但是如果使用v-show,那么在触发删除事件之后,searchParams.trademark被设置为undefined,从undefined身上读取split就会出现错误
  所以这里最好使用v-if
-->
<li class="with-x" v-if="searchParams.trademark">
  {{ searchParams.trademark.split(":")[1]
  }}<i @click="deleteTrademarkForSearch">×</i>
</li>
```

**点击平台属性进行搜索**

1. 平台属性也是在子组件SearchSelector中的,实现的原理跟点击品牌搜索一样,只不过用于搜索的属性比较复杂
2. 因为是一个数组,所以使用数组的方式添加,并且在添加之前需要进行判断,不能重复添加  
3. 因为是一个数组,所以在展示的时候使用`v-for`
4. 因为是一个数组,在移出平台属性的时候,需要将index作为参数传递,使用`splice()`方法进行移出

数据结构:
```js
// 商品属性的数组: ["属性ID:属性值:属性名"]
"props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"]
// 每一个attr对象的格式如下,
{
  "attrId": 1,
  "attrValueList": [ // 属性值部分
      "4500-11999",
      "2800-4499"
  ],
  "attrName": "价格"
},
```

**在Search组件中多次搜索不能直接后退到Home组件的问题**

如果在Search组件中通过多次点击三级分类或者搜索按钮引起路径的变化进行搜索,会记入浏览器的历史记录,需要后退的时候会一步一步的后退,需要实现一次后退即可回到Home组件的效果
1. 修改TypeNav跳转到Search的方法,如果当前组件是Search就用`replace`,否则就用`push`
2. 修改Header组件中跳转到Search的方法,如果当前组件时Search就用`replace`,否则用`push`
3. 将Search组件中,将删除品牌平台属性等发送请求的方式更改为`replace`(也就是搜索页往搜索页跳转)

注意:
1. 有两种判断方式,一种是`this.$route.path !=='/home'`或者`this.$route.path !== '/search'`,选择使用第二种,因为可能其他页面会用的typeNav,也需要相同的效果
2. 但是要注意,在Header组件搜索进行跳转的时候,因为携带了params参数,如果用`this.$route.path`来判断就匹配不到了,所以使用`this.$route.name`

TypeNav组件的点击三级分类进行跳转:
```js
// 为了实现在search组件中多次点击三级分类进行搜索,使用浏览器后退按钮能够回到home组件,需要进行判断,不在search组件中跳转才使用push
// 这里使用search判断比较合适,因为其他页面也使用了typeNav组件,跳转到search页面也需要这个能够直接退回的功能
if(this.$route.path !== '/search') {
  this.$router.push(location);
}else {
  this.$router.replace(location);
}
```

Header组件中点击搜索按钮进行跳转:
```js
// 因为这里携带了params参数,所以用path来判断,无法匹配,所以这里用name来判断
if (this.$route.name !== "search") {
  console.log(this.$route.path)
  // 验证了如果使用patch判断,第二次点击因为路径携带了参数无法匹配到search,所以要用name来判断
  // this.$router.push(location);
} else {
  console.log(this.$route.path)
  // this.$router.replace(location);
}
```

**发送请求不发送为空字符串的参数,在整理参数的时候最后要将空字符串过滤掉(filter可以forEach可以)**

在整理参数的时候,将空字符串的参数删除掉,或者设置为undefined
1. 携带的属性值如果是undefined,这个属性是不会被发送的,不占带宽
2. 如果是空字符串会发送,占带宽,所以应该删除掉或赋值为undefined

**循环的总结**
1. for循环:js中最基本的遍历方法,主要是针对数组进行遍历,效率不高,可以使用break和continue
2. for-in:主要用来遍历对象的可枚举属性(Object.definedProperty后添加的属性默认就是不可以遍历的),效率最低,因为不光要遍历自身的属性,还要遍历原型上的属性
3. forEach:数组的一个方法,主要用来遍历数组,效率最高,不能使用break和continue,通常配合`Object.keys`来遍历对象以实现最高的遍历效率
4. for-of:es6新增的遍历方法,前提是必须是可迭代的对象(不可以遍历对象),即先了Itetator接口(实现了该接口可以使用展开运算符展开),效率没有forEach高,但是比其他的要好,可以使用break和continue

遍历对象最快的方法也是使用`forEach`,是把对象的属性,使用`Object.keys`方法转化为数组

**排序搜索**

如何排序是根据初始化参数中的该属性决定的
```js
// 1表示按照默认,2表示按照价格,desc表示降序(从大到小),asc表示升序(从小到大),一共有四种排序规则
"order": "1:desc", 
```

实现步骤:
1. 动态的绑定class属性,根据`order:1`中的数字,决定谁被强制绑定class
2. 因为要频繁的获取排序的类型和排序的方式,所以先将1和desc这两个值通过计算属性获取出来
3. 是否显示图标根添加class的条件一样,而添加那种样式的字体图标,跟desc或者asc有关系
4. 字体图标的两种引入方式
   - 直接使用网络地址,在public/index.html中引入,但是要记得添加前缀`https`,最后为`<link rel="stylesheet" href="https://at.alicdn.com/t/font_3343513_0a7pfmh60kq4.css">`
   - 拷贝生成的地址中的css内容,创建src/style/iconfont文件,拷贝到该文件中,然后在main.js中引入该文件就可以使用了(采用的这种方式)`import './style/iconfont.css'`
5. 具体排序的方法调用的是同一个方法,需要将点击的标识作为参数传递,通过标识判断是要改变排序方式,还是改变升序降序,最后发送请求重新获取数据

动态添加背景颜色和动态显示图标样式的结构:
```html
<!-- 给每个li动态的添加背景颜色,条件是根据order的前半部分如果为1,就给综合添加,如果是2就是价格添加 -->
<li :class="{active:searchParams.order.split(':')[0] === '1'}">
  <!-- 添加额外的i标签用来显示箭头,箭头是否显示的条件跟背景颜色添加的条件相同,同时i标签iconfont是必须的,这个前缀可以在创建iconfont项目的时候设置,具体显示哪一种需要根据order后半部分决定 -->
  <!-- 这里的[0]和[1]可以根据计算属性获取,来简化表达式的写法 -->
  <a>综合<i v-show="searchParams.order.split(':')[0] === '1'" class="iconfont" :class="{'shop-long-arrow-down':searchParams.order.split(':')[1]==='desc','shop-long-arrow-up':searchParams.order.split(':')[1]==='asc'}"></i></a>           
</li>
<li :class="{active:searchParams.order.split(':')[0] === '2'}">
  <a>价格<i v-show="searchParams.order.split(':')[0] === '2'" class="iconfont" :class="{'shop-long-arrow-down':searchParams.order.split(':')[1]==='desc','shop-long-arrow-up':searchParams.order.split(':')[1]==='asc'}"></i></a>
</li>
```

**搜索功能的主要代码**

Search组件的主要html结构:
```html
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
        </div>
      </div>
    </div>
  </div>
</template>
```

Search组件的交互逻辑:
```js
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
```

SearchSelector组件的交互逻辑;
```js
import { mapGetters } from "vuex";
export default {
  name: "SearchSelector",
  computed: {
    ...mapGetters(["attrsList", "trademarkList"]),
  },
  methods:{
    // 点击品牌进行搜索
    searchForTrademark(trademark){
      this.$emit('searchForTrademark',trademark)
    },
    // 点击属性搜索
    searchForAttr(attr,attrValue){
      this.$emit('searchForAttr',attr,attrValue)
    }
  }
};
```

### 分页功能

**静态组件**

分页器组件使用提供的创建,因为是共用组件,所以将Pagination组件定义在components中,注册在全局,然后直接使用分页器组件替换Search组件中原来的分页结构

分页器的组件内容如下:
```html
<template>
  <div class="pagination">
    <button>上一页</button>
    <button>1</button>
    
    <button>···</button>

    <button>3</button>
    <button>4</button>
    <button>5</button>
    <button>6</button>
    <button>7</button>
    
    <button>···</button>
    <button>9</button>
    <button>下一页</button>
    
    <button style="margin-left: 30px">共 60 条</button>
  </div>
</template>

<script>
  export default {
    name: "Pagination",
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
```

**分页器的作用**
1. 用于展示当前页码
2. 用于展示总条数
3. 用于展示总页码
4. 用于展示连续页数量
5. 翻页的功能

**需要的数据**
1. 当前页码:分页器本身没有,但是Search组件(父组件)的初始化参数中有该数据
2. 总条数:分页器本身没有,但是Search组件发送的请求列表数据的时候包含的其他信息中有分页器的数据,在Vuex中的searchInfo中有该数据,可以通过`mapState`计算出searchInfo然后获取其中的total
3. 总页码:分页器本身没有,但是可以通过总条数/每页的数量来计算,所以父组件还需要传递每页的数量
4. 连续页:分页器中没有,父组件同样需要传递

searchInfo的数据结构:
```js
{
  attrsList:Array[10]
  goodsList:Array[10]
  // 这些就是分页相关的数据
  pageNo:1 // 整理参数的时候有
  pageSize:10 // 整理参数的有
  total:76 // 没有,需要获取
  totalPages:8 // 总页码,虽然有,但是我们自己通过计算属性计算
  trademarkList:Array[7]
}
```

总结:也就是分页器中需要的数据,分页器本身都没有,需要父组件Search组件进行传递过去

```html
<Pagination :currentPageNo="searchParams.pageNo" :total="searchInfo.total" :pageSize="searchParams.pageSize" :continue="5" />        
```

注意:
1. 父组件传递数据给子组件,子组件使用props接收
2. 在接收total数据的时候,因为是使用计算属性计算的searchInfo,该数据可能是一个空对象,空对象.total可能是undefined,所在在子组件中需要使用第三种接收数据的方式,给total指定一个默认值
3. 直接能够展示的数据就是total和使用计算属性计算出总页数

**连续页的分析**
1. 如果是12345678910,如果当前页是6,那么因为连续页是5,则连续页就是45678,23和9就变成...
2. 如果当前页是5,连续页页是5,则连续页就是34567,那么2和89就变成...
3. 然后连续页的起始位置是根据当前页来变化的

**起算起始页和结束页**
1. 没计算之前考虑总页数小于连续页
2. 计算之后考虑，起始页小于1和结束页大于总页数的情况

```js
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
```

**分页器中各种按钮的显示**
1. 根据起始页和结束页的条件判断显示那些按钮
2. 连续按钮通过`v-for`遍历数字生成，同时需要`v-if`判断，因为要从起始页开始显示
   注意：***v-for和v-if可以同时使用，v-for的优先级要高，先被执行，执行之后在进行判断，如果满足条件就显示，不满足就不显示***
3. 给当前的按钮动态的绑定样式,当前页等于遍历的page的时候绑定

分页器按钮的动态显示代码:
```html
<template>
  <div class="pagination">
    <!-- 上一页并非一直能够使用,如果当前页就等于1,那么无法使用 -->
    <button :disabled="currentPageNo === 1">上一页</button>
    <!-- 1按钮页不是一直都显示的,如果计算的连续页面为1-5,则这里的1就不显示,否则重复了 -->
    <button v-if="startEnd.start > 1">1</button>
    <!-- ...按钮页不是完全显示的,如果起始页大于2,就是3开始,那么显示上面的1,和...,得到1...3456 -->
    <button v-if="startEnd.start > 2">···</button>

    <!-- 中间部分的按钮利用计算的起始位置和结束位置的遍历得出 -->
    <!-- 同时需要配合v-if,因为如果直接end,则会从0开始,我们需要从计算的起始页开始,v-if的优先级比较高,先判断,如果满足条件v-for生效 -->
    <!-- 这里的v-if是会报错的,但是是正常的,不是因为代码的问题, 使用-v-show也能实现同样的效果-->
    <!-- 并且在这里动态的添加class样式,不用管前面的1按钮,因为如果这里显示了,上面的不会显示 -->
    <button :class="{active:page === currentPageNo}" v-for="page in startEnd.end" :key="page" v-show="page >= startEnd.start">{{page}}</button>
    

    <!-- 总页数9,9-1为8,小于8就是7,连续页的结束为7,才显示...为7...9 -->
    <button v-if="startEnd.end < totalPageNo - 1">···</button>
    <!-- 举例子:如果结束位置为9,总页数为9,这个总页数不应该显示,因为计算出来的连续页包括9 -->
    <button v-if="startEnd.end < totalPageNo">{{totalPageNo}}</button>
    <!-- 如果当前页等于最后一页,就禁用 -->
    <button :disabled="currentPageNo === totalPageNo">下一页</button>
    
    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>
```

**发送请求进行分页搜索** 
1. 通过自定义事件将要显示的页码传递给Search组件,这里的自定义事件没有将触发的方法定义在methods中,而是直接在写在了`@click="$emit()"`事件中
2. 在Search组件中改变页码的参数，然后重新发送请求
3. 注意:
   - ***分页搜索之后，每次改变搜索条件应该从第一页开始，而不是指定的页数，所以在其他请求发送之前需要将页码设置为1***
   - ***而需要整理参数的请求也需要将当前页设置为1,因为整理参数没有整理页码,只有categoryId和catetoryName***
   - 但是分页搜索本身不用,因为本来就是分页

自定义事件回忆:
1. 子组件给父组件传递数据,使用`$emit`
2. 父组件在组件标签上绑定该自定义事件
3. 父组件在methods中指定回调函数调用该事件,同时获得子组件传递过来的数据


Search组件完整结构:和之前相比就是给分页添加了自定义事件,并且将分页需要的数据传递给分页组件
```html
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
                <li
                  :class="{ active: sortFlag === '1' }"
                  @click="sortForSearch('1')"
                >
                  <!-- 添加额外的i标签用来显示箭头,箭头是否显示的条件跟背景颜色添加的条件相同,同时i标签iconfont是必须的,这个前缀可以在创建iconfont项目的时候设置,具体显示哪一种需要根据order后半部分决定 -->
                  <!-- 这里的[0]和[1]可以根据计算属性获取,来简化表达式的写法 -->
                  <a
                    >综合<i
                      v-show="sortFlag === '1'"
                      class="iconfont"
                      :class="{
                        'shop-long-arrow-down': sortType === 'desc',
                        'shop-long-arrow-up': sortType === 'asc',
                      }"
                    ></i
                  ></a>
                </li>
                <li
                  :class="{ active: sortFlag === '2' }"
                  @click="sortForSearch('2')"
                >
                  <a
                    >价格<i
                      v-show="sortFlag === '2'"
                      class="iconfont"
                      :class="{
                        'shop-long-arrow-down': sortType === 'desc',
                        'shop-long-arrow-up': sortType === 'asc',
                      }"
                    ></i
                  ></a>
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
          <Pagination
            :currentPageNo="searchParams.pageNo"
            :total="searchInfo.total"
            :pageSize="searchParams.pageSize"
            :continueNo="5"
            @paginationForSearch="paginationForSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>
```

Search组件的完整逻辑:就是增加了搜索,和每次改变搜索条件都将pageNo重置为1
```js
import { mapGetters, mapState } from "vuex";
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
        pageSize: 5,
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
      const keys = Object.keys(searchParams);
      keys.forEach((key) => {
        if (searchParams[key] === "") {
          delete searchParams[key];
        }
      });
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
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
      this.$router.replace({ name: "search", params: this.$route.params });
    },
    // 删除关键字重新搜索,这个就是在分类搜索上继续搜索,所以不用清空id
    deleteKeywordForSearch() {
      // this.searchParams.keyword = undefined;
      // this.getSearchInfo();
      // 通过引起路径的变化,导致监视属性工作,同样也不需要手动清除关键字
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
      this.$router.replace({ name: "search", query: this.$route.query });
      // 通知header组件清空keyword
      this.$bus.$emit("clearKeyword");
    },
    // 定义事件,点击品牌进行搜索,因为发送请求需要的参数对象在父组件中,所以将参数传递过来,通过父组件发送请求
    searchForTrademark(trademark) {
      const trademarkStr = `${trademark.tmId}:${trademark.tmName}`;
      // 整理数据格式,数据格式是接口要求的数据格式,需要自己拼接整理
      this.searchParams.trademark = trademarkStr;
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
      this.getSearchInfo();
    },
    // 删除品牌重新搜索
    deleteTrademarkForSearch() {
      this.searchParams.trademark = undefined;
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
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
      const isRepeat = this.searchParams.props.some((item) => {
        return item === attrStr;
      });
      // 如果重复就不添加也不发送请求
      if (!isRepeat) {
        
        this.searchParams.props.push(attrStr);
        // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
        this.searchParams.pageNo = 1
        this.getSearchInfo();
      }
    },
    // 删除属性搜索,本质就是删除props数组中的指定位置的元素,这个index,需要通过参数传递过来
    deleteAttrForSearch(index) {
      this.searchParams.props.splice(index, 1);
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
      this.getSearchInfo();
    },
    // 点击排序进行搜索
    sortForSearch(sortFlag) {
      const originSortFlag = this.sortFlag;
      const originSortType = this.sortType;
      let newOrder = "";
      // 如果点击的和原来的是一个,那么就切换排序的规则是升序还是降序
      if (sortFlag === originSortFlag) {
        newOrder = `${originSortFlag}:${
          originSortType === "desc" ? "asc" : "desc"
        }`;
      } else {
        // 如果点击的不是一个,那么就按照点击的来,并且指定默认的规则是desc
        newOrder = `${sortFlag}:desc`;
      }
      // 最终重新发送请求
      this.searchParams.order = newOrder;
      // 在分页搜索之后,需要在改变搜索条件,应该将页码设置为1
      this.searchParams.pageNo = 1
      this.getSearchInfo();
    },
    // 分页搜索
    paginationForSearch(page){
      this.searchParams.pageNo = page
      this.getSearchInfo()
    }
  },
  computed: {
    ...mapGetters(["goodsList"]),
    // 使用计算属性对排序进行简化操作
    sortFlag() {
      return this.searchParams.order.split(":")[0];
    },
    sortType() {
      return this.searchParams.order.split(":")[1];
    },
    // 计算出searchInfo来获取总条数
    ...mapState({ searchInfo: (state) => state.search.searchInfo }),
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
```

Pagination分页组件的完整结构:和之前的相比就是触发了自定义事件
```html
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
```

Pagination分页组件的完整逻辑
```js
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
```


## Detail组件(详情页)

### 组件展示

1. 直接使用课件提供的静态组件来使用,***因为是路由组件所以放在pages目录下,并且不要忘记注册路由***
2. 修改Search组件中商品展示部分,将标题和图片的超链接标签,替换为`<router-link>`实现跳转到Detail组件
3. 同时需要传递商品的skuId,这里使用params参数,所以需要路由配置占位符,skuId就是searchInfo.goodsList中每一个商品对象的id属性

```html
<router-link :to="`/detail/${goods.id}`" :title="goods.title">{{goods.title}}</router-link>
```
**路由的模块化**
将路由对象的配置放在路由器对象中,有大量的路由配置,所以将路由配置拆分出来
1. 创建src/router/routes.js文件将引入路由组件和配置路由信息的数组放在该文件中并暴露出去
2. 在src/router/index.js中引入该文件使用

**滚动行为**
跳转到Detail组件之后,会出现滚动条在最下方的情况,需要在路由配置文件src/router/index.js中对路由器对象进行配置滚动行为

滚动行为:[VueRouter官网描述](https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html)

```js
// 暴露路由器对象
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部,这里官网写的是top,但是这里top不好使,可能跟vuerouter的版本有关系
    return { y: 0 }
  },
  routes
})
export default router
```

**请求Detail需要的信息并且展示**
1. 在src/api/index.js中写请求接口函数
2. 因为又是一个新的模块了,所以创建src/store/detail.js文件,在其中写Vuex,注意:***不要忘记合并到总的store中***
3. 通过getters属性简化数据的获取,然后展示数据

获取到的数据结构:
```js
detailInfo:{
  categoryView:Object // 该数据是左上角的面包屑
  price:2424
  skuInfo:Object  // 商品的信息和图片
  spuSaleAttrList:Array[2]  // 销售属性
  valuesSkuJson:"{"21|24":21,"19|22":22}
}
```

请求接口函数:
```js
// 获取详情信息的请求接口函数/api/item/{ skuId }
export const reqDetailInfo =(skuId) =>{
  return request({url:`/item/${ skuId }`,method:'get'})
}
```

Vuex文件:
```js
import { reqDetailInfo } from "@/api"
const state = {
  detailInfo:{}
}
const mutations = {
  RECEIVE_DETAILINFO(state,detailInfo){
    state.detailInfo = detailInfo
  }
}
const actions = {
  async getDetailInfo({commit},skuId){
    const result = await reqDetailInfo(skuId)
    if(result.code === 200){
      commit('RECEIVE_DETAILINFO',result.data)
    }
  }
}
const getters = {
  categoryView:state=>state.detailInfo.categoryView || {},
  skuInfo:state=>state.detailInfo.skuInfo || {},
  spuSaleAttrList:state=>state.detailInfo.spuSaleAttrList ||[]
}
export default {
  state,mutations ,actions,getters
}
```

**初始化数据的技巧**
1. 在data中先将数据定义
2. 在`beforeMount`之前将数据赋值,那么这个data中的数据就可以直接使用了

**数据的解释**
1. categoryView:左侧顶部的导航部分
2. skuInfo包含商品信息和图片信息a
3. spuSaleAttrList:售卖属性

Detail中初始化数据和获取数据的逻辑:
```js
import { mapGetters } from "vuex";
import ImageList from "./ImageList/ImageList";
import Zoom from "./Zoom/Zoom";

export default {
  name: "Detail",
  components: {
    ImageList,
    Zoom,
  },
  data() {
    return {
      // 这个参数是Search组件跳转到Detail组件,通过params参数带过来的,但是名称不一样,传递过来的叫做goodsId(路由配置)
      skuId: "",
    };
  },
  // 在页面挂载之前初始化参数
  beforeMount() {
    this.skuId = this.$route.params.goodsId;
  },
  mounted() {
    // 发送请求
    this.getDetailInfo();
  },
  methods: {
    // 发送请求的方法
    getDetailInfo() {
      this.$store.dispatch("getDetailInfo", this.skuId);
    },
  },
  // 简化数据的获取
  computed: {
    ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
  },
};
```

### 其他交互逻辑

**放大镜图片的展示**
1. Detail中放大镜展示和底部轮播图片的展示使用的是同一套图
2. 需要将skuInfo中的skuImageList,需要将该数据通过标签属性的方式传递给子组件
   - 在传递的时候,需要使用计算属性将skuImageList计算出来,因为如果skuInof是通过getters得到的,没有值的时候是一个空对象,空对象.skuImageList可能是undefined会出现假报错,所以如果没有值赋值为空数组
   - Zoom组件在接收到数据的时候,有可能是一个空数组,空数组[index]索引会出现undefined,为了避免假报错同样需要使用计算属性计算出要展示的图片对象
   - 并且需要在data中定义一个index数据展示默认的图片
   - 在imagesList中不会出现假报错的情况,是因为使用的是`v-for`没有出现undefined.属性的或者索引的i情况

假报错处理总结:***追根溯源,异步任务导致可能会出现空数组和空对象的情况,出现该情况.属性或者索引,就会出现undefiend,unefined.属性或者索引就会报错***

注意:***当页面刷新就相当于页面重启,Vuex中state的数据都要重新发送请求初始化,Vuex中的getters也会被执行,这个数据没有回来就是undefined***
1. state是Vuex中存储数据的地方,但是这个state并不是永久存储
2. 当我们刷新页面或者重启项目(刷新可以理解为重启)
3. 那么Vuex中的所有数据,都要重新初始化,重新发送请求去获取
4. state里面的数据一开始是有的,只不过是我们定义的空对象或者空数组,不是请求会回来的数据
5. 但是state里面的初始化数据也会影响组件(直接获取得到空对象或者数组),以及Vuex中的getters中的数据(空对象.得到unfefiend)
6. 等待发送了请求,异步任务响应数据之后,state中才有真实的数据
7. 就是因为Vuex不能永久存储数据,才会用`localStorage`或者`sessionStorage`来存储数据

**实现点击小图切换大图的效果**
1. 点个点击小图的时候,动态绑定class,显示边框,原理和三级导航分类移入移出的原理一样
   - 现在data中定义一个数据,当这个数据等于index的时候绑定clsss
   - 添加点击事件,当事件被触发的时候,让data中的数据等于点击的index
2. 同时使用全局事件总线,将index传递过去,通知兄弟组件Zoom改变图片的index

**小图的Swiper轮播实现**
1. 轮播的结构和之前的不一样,不能使用之前的轮播组件
2. 使用`watch`配合`this.$nextTick()`的方式实现

**放大镜的操作**

鼠标位置:
1. event.clientX:相对于视口,视口是不变的
2. event.pageX:相对于页面的左上角
3. event.offsetX:相对于元素本身左上角

**点击销售属性切换选中状态**
1. ***每组销售属性的isChecked属性决定改销售属性是否被选中***
2. 给Detail所有的销售属性添加点击事件,将当前的和所有的都传递过去,可以通过排他思想将所有的isChecked属性设置为0表示不选中,只有被点击的才设置为1,表示选中
3. 还需要根据条件绑定class让被选中的显示

**输入商品的逻辑**
1. 在data中定义数据用于数量的初始化展示
2. 操作添加按钮和减少按钮对商品数量进行增加或者减少,当数量小于1的时候无法在减少
3. 用户输入使用change事件,如果用户输入的数量大于1那么data中的数量就等于用户输入的数量,如果小于1就等于1
   - 输入框的blur事件只要失去焦点就被触发,不会判断输入框的内容是否发生改变
   - 而change事件包含了blur事件,不过会对输入框的内容进行判断,如果内容没有改变则不会被触发
   - 注意:***因为input接收的是字符串,可以使用用惩罚将字符串转换为数字***

交互逻辑直接将代码写在了事件中,如果在事件中需要用到事件对象,则使用`$event`:
```html
<div class="controls">
  <!-- 如果直接在事件中使用事件对象,用$event -->
  <input autocomplete="off" class="itxt" v-model="skuNum" @change="$event.target.value >= 1 ?  skuNum = $event.target.value : skuNum = 1" />
  <a href="javascript:" class="plus" @click="skuNum++">+</a>
  <!-- 减少数量有一定的逻辑:大于1才能减,否则就让其等于1 -->
  <a href="javascript:" class="mins" @click="skuNum >1 ? skuNum-- : skuNum = 1">-</a>
</div>
```

Detail组件的主要静态内容:
```html
<template>
  <div class="detail">
    <!-- 商品分类导航 -->
    <TypeNav />

    <!-- 主要内容区域 -->
    <section class="con">
      <!-- 导航路径区域 -->
      <div class="conPoin">
        <span>{{ categoryView.category1Name }}</span>
        <span>{{ categoryView.category2Name }}</span>
        <span>{{ categoryView.category3Name }}</span>
      </div>
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <!--放大镜效果-->
          <Zoom :skuImageList="skuImageList" />
          <!-- 小图列表 -->
          <ImageList :skuImageList="skuImageList" />
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">{{ skuInfo.skuName }}</h3>
            <p class="news">{{ skuInfo.skuDesc }}</p>
            <div class="priceArea">
              <div class="priceArea1">
                <div class="title">
                  价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格
                </div>
                <div class="price">
                  <i>¥</i>
                  <em>{{ skuInfo.price }}</em>
                  <span>降价通知</span>
                </div>
                <div class="remark">
                  <i>累计评价</i>
                  <em>65545</em>
                </div>
              </div>
              <div class="priceArea2">
                <div class="title">
                  <i>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</i>
                </div>
                <div class="fixWidth">
                  <i class="red-bg">加价购</i>
                  <em class="t-gray"
                    >满999.00另加20.00元，或满1999.00另加30.00元，或满2999.00另加40.00元，即可在购物车换购热销商品</em
                  >
                </div>
              </div>
            </div>
            <div class="support">
              <div class="supportArea">
                <div class="title">
                  支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持
                </div>
                <div class="fixWidth">
                  以旧换新，闲置手机回收 4G套餐超值抢 礼品购
                </div>
              </div>
              <div class="supportArea">
                <div class="title">配 送 至</div>
                <div class="fixWidth">广东省 深圳市 宝安区</div>
              </div>
            </div>
          </div>

          <div class="choose">
            <div class="chooseArea">
              <div class="choosed"></div>
              <dl v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
                <dt class="title">{{ spuSaleAttr.saleAttrName }}</dt>
                <!-- 点击销售属性切换选中状态,利用排他思想,第一个参数是所有的销售属性值数组,第二个是当前的销售属性对象 -->
                <dd
                  changepirce="90"
                  :class="{ active: spuSaleAttrValue.isChecked === '1' }"
                  v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                  :key="spuSaleAttrValue.id"
                  @click="changeChecked(spuSaleAttr.spuSaleAttrValueList,spuSaleAttrValue)"
                >
                  {{ spuSaleAttrValue.saleAttrValueName }}
                </dd>
              </dl>
            </div>
            <div class="cartWrap">
              <div class="controls">
                <!-- 如果直接在事件中使用事件对象,用$event -->
                <input autocomplete="off" class="itxt" v-model="skuNum" @change="$event.target.value >= 1 ?  skuNum = $event.target.value : skuNum = 1" />
                <a href="javascript:" class="plus" @click="skuNum++">+</a>
                <!-- 减少数量有一定的逻辑:大于1才能减,否则就让其等于1 -->
                <a href="javascript:" class="mins" @click="skuNum >1 ? skuNum-- : skuNum = 1">-</a>
              </div>
              <div class="add"> 
                <a href="javascript:">加入购物车</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 内容详情页 -->
    <section class="product-detail">
      <aside class="aside">
        <div class="tabWraped">
          <h4 class="active">相关分类</h4>
          <h4>推荐品牌</h4>
        </div>
        <div class="tabContent">
          <div class="tab-pane active">
            <ul class="partList">
              <li>手机</li>
              <li>手机壳</li>
              <li>内存卡</li>
              <li>Iphone配件</li>
              <li>贴膜</li>
              <li>手机耳机</li>
              <li>移动电源</li>
              <li>平板电脑</li>
            </ul>
            <ul class="goodsList">
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part01.png" />
                  </div>
                  <div class="attr">Apple苹果iPhone 6s (A1699)</div>
                  <div class="price">
                    <em>¥</em>
                    <i>6088.00</i>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part02.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part03.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part02.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
              <li>
                <div class="list-wrap">
                  <div class="p-img">
                    <img src="./images/part03.png" />
                  </div>
                  <div class="attr">
                    <em>Apple苹果iPhone 6s (A1699)</em>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>6088.00</i>
                    </strong>
                  </div>
                  <div class="operate">
                    <a href="javascript:void(0);">加入购物车</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div class="tab-pane">
            <p>推荐品牌</p>
          </div>
        </div>
      </aside>
      <div class="detail">
        <div class="fitting">
          <h4 class="kt">选择搭配</h4>
          <div class="good-suits">
            <div class="master">
              <img src="./images/l-m01.png" />
              <p>￥5299</p>
              <i>+</i>
            </div>
            <ul class="suits">
              <li class="suitsItem">
                <img src="./images/dp01.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="39" />
                  <span>39</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp02.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="50" />
                  <span>50</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp03.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="59" />
                  <span>59</span>
                </label>
              </li>
              <li class="suitsItem">
                <img src="./images/dp04.png" />
                <p>Feless费勒斯VR</p>
                <label>
                  <input type="checkbox" value="99" />
                  <span>99</span>
                </label>
              </li>
            </ul>
            <div class="result">
              <div class="num">已选购0件商品</div>
              <div class="price-tit">套餐价</div>
              <div class="price">￥5299</div>
              <button class="addshopcar">加入购物车</button>
            </div>
          </div>
        </div>
        <div class="intro">
          <ul class="tab-wraped">
            <li class="active">
              <a href="###"> 商品介绍 </a>
            </li>
            <li>
              <a href="###"> 规格与包装 </a>
            </li>
            <li>
              <a href="###"> 售后保障 </a>
            </li>
            <li>
              <a href="###"> 商品评价 </a>
            </li>
            <li>
              <a href="###"> 手机社区 </a>
            </li>
          </ul>
          <div class="tab-content">
            <div id="one" class="tab-pane active">
              <ul class="goods-intro">
                <li>分辨率：1920*1080(FHD)</li>
                <li>后置摄像头：1200万像素</li>
                <li>前置摄像头：500万像素</li>
                <li>核 数：其他</li>
                <li>频 率：以官网信息为准</li>
                <li>品牌： Apple</li>
                <li>商品名称：APPLEiPhone 6s Plus</li>
                <li>商品编号：1861098</li>
                <li>商品毛重：0.51kg</li>
                <li>商品产地：中国大陆</li>
                <li>热点：指纹识别，Apple Pay，金属机身，拍照神器</li>
                <li>系统：苹果（IOS）</li>
                <li>像素：1000-1600万</li>
                <li>机身内存：64GB</li>
              </ul>
              <div class="intro-detail">
                <img src="./images/intro01.png" />
                <img src="./images/intro02.png" />
                <img src="./images/intro03.png" />
              </div>
            </div>
            <div id="two" class="tab-pane">
              <p>规格与包装</p>
            </div>
            <div id="three" class="tab-pane">
              <p>售后保障</p>
            </div>
            <div id="four" class="tab-pane">
              <p>商品评价</p>
            </div>
            <div id="five" class="tab-pane">
              <p>手机社区</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
```

Detail中的交互逻辑:
```js
import { mapGetters } from "vuex";
import ImageList from "./ImageList/ImageList";
import Zoom from "./Zoom/Zoom";

export default {
  name: "Detail",
  components: {
    ImageList,
    Zoom,
  },
  data() {
    return {
      skuId: "",
      // 添加购物车的数量初始化
      skuNum: 1
    };
  },
  beforeMount() {
    this.skuId = this.$route.params.skuId;
  },
  mounted() {
    this.getDetailInfo();
  },
  methods: {
    // 获取详情数据
    getDetailInfo() {
      this.$store.dispatch("getDetailInfo", this.skuId);
    },
    // 利用排他思想切换销售属性
    changeChecked(spuSaleAttrValueList,spuSaleAttrValue) {
      // 遍历让所有的isChecked为0
      spuSaleAttrValueList.forEach(item=>item.isChecked = '0')
      spuSaleAttrValue.isChecked = '1'
    }
  },
  computed: {
    ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList"]),
    // 计算属性计算出要展示的图片然后传递给放大镜和列表组件用来展示
    skuImageList() {
      // 如果数据没回来skuInfo就是空对象,为了避免空对象的.skuImageList得到undefined,所以||[]
      return this.skuInfo.skuImageList || [];
    },
  },
};
```

Zoom放大镜中的静态内容:
```html
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
```

Zoom放大镜中的交互逻辑:
```js
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
```

ImageList底部图片的静态内容:
```html
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
```

ImageList底部的交互逻辑(主要是Swiper轮播):
```js
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
```


## 购物车ShopCart

### 添加到购物车

**请求接口函数**
1. 该接口函数有两个作用,可以添加购物车,也可以修改购物车的数量
2. 注意:是post请求,而非get请求
```js
// 添加购物车
export const reqAddOrUpdateShopCart = (skuId, skuNum) => {
  return request({ url: `/cart/addToCart/${skuId}/${skuNum}`, method: "post" });
};
```

**async函数复习**
1. async函数式异步函数,一般内部都是有异步操作的
2. async函数的返回值,一定是Promise对象,不看return
3. 返回的Promise对象成功和失败的结果要看return
4. return的结果如果是非Promise对象,那么Promise的状态一定是成功的,成功的结果就是return的结果
5. return的结果如果是Promise对象,就要看return后面的Promise对象是成功的还是失败的
   - 如果return的Promise对象是陈功的,那么Promise对象就是成功的,成功的结果就是return的Promise的成功结果
   - 如果return的Promise对象是失败的,那么Promise对象就是失败的,失败的结果就是return的Promise的失败原因
6. 如果没有return结果而是抛出错误,promise也是失败的,原因就是抛出的错误原因

**购物车的vuex**:特殊的地方在于只发送请求而不存储数据
```js
const actions = {
  // 添加购物车不需要存储数据,只需要发送请求,所以只有actions,而且actions中的方法只能收到第二个参数,所以需要放在对象中
  async addShopCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateShopCart(skuId, skuNum);
    if (result.code === 200) {
      return "ok";
    } else {
      // 不能让该函数返回的Promise永远成功,所以手动返回一个失败状态的Promise,那么async函数返回的Promise实例状态就是失败的,失败的原因就是该Promise实例失败的原因
      return Promise.reject(new Error('failed'));
    }
  },
};
```

**点击Detail组件中的添加购物车按钮进行添加购物车的操作**
```js
/* 
  之前的跳转都是直接跳转,因为在跳转之前不需要发送请求,而是跳转过去之后发送请求获取数据
  而添加购物车不一样,当点击添加购物车之后,需要先将请求发给后台,后台需要将购物车数据存储到数据库,请求成功之后,会返回信息,根据这个信息在去跳转
  否则购物车添加失败,而我们还是跳转过去了,就会出现问题
*/
async addShopCart() {
  try {
    // dispatch本质就是调用函数,可以获取到返回值,actions中为async函数,返回值就是Promise,这里能接收到一个Promise实例,该Promise是成功还是失败就看actions中async方法的返回值
    // 这里用await就能得到成功的值(如果返回的基本数据类型则都是成功的,所以用值来判断),可以使用成功的值来判断,是否添加购物车成功
    // 但是这样就导致actions中的async返回的Promise永远都是成功的
    await this.$store.dispatch('addShopCart',{skuId:this.skuId,skuNum:this.skuNum})
    // 跳转到添加购物车成功页面,将skuId和skuNum携带过去
    this.$router.push(`/addcartsuccess?skuId=${this.skuId}&skuNum=${this.skuNum}`)
    // 将skuInfo因为是对象,复杂信息最好不要通过路由传参的方式,所以采用存储到本地
    sessionStorage.setItem('SKUINFO_KEY',JSON.stringify(this.skuInfo))
  } catch (error) { 
    // 如果是失败的,则抛出异常,使用try-catch进行处理,抛出的异常就是错误的原因
    alert(error.message)
  }
}
```

**购物车成功页面的数据展示**
1. 需要解决css样式的问题:将字体图标样式拷贝到public/css目录中,在之前的重置样式里面引入了字体图标样式`@import "./iconfont.css";`,同时将fonts(字体)文件拷贝到public
2. 使用存储在`sesssionStorage`中的skuInof信息,展示图片,先在data中定义数据,在`beforeMount`中获取,注意要用`JSON.parse()`
3. 展示传递过来的skuNum
4. 使用`<router-link>`点击查看商品详情,跳转到Detail组件,并且携带params参数传递skuId,这样商品详情就可以展示页面了(Detail组件挂载的时候会自动发送请求)
   - 需要携带的id是skuinof中的id属性,就是之前查看商品详情的skuId(goodsId)
5. 去购物车结算按钮,同样使用`router-link`跳转到购物车组件(ShopCart),购物车组件直接使用提供的,并且注册路由
   - 需要修改一下样式结构,将`cart-list-con4`的li删除
   - 在样式中调整其他`cart-list-conx`的宽度百分比分别为:15,35,10,17,10,13
   

添加购物车成功组件中的获取数据逻辑:
```js
export default {
  name: "AddCartSuccess",
  data(){
    return {
      skuId:'',
      skuNum:'',
      skuInfo:{}
    }
  },
  beforeMount(){
    this.skuId = this.$route.query.skuId
    this.skuNum = this.$route.query.skuNum
    this.skuInfo = JSON.parse(sessionStorage.getItem('SKUINFO_KEY'))
  }
};
```
需要展示的部分:
1. skuId可以实现点击查看详情通过parmas参数回到Detail组件(不传递该数据也可以,因为skuInfo中有skuId)
2. skuNum是直接展示商品数量
3. skuInfo可以展示图片和商品的标题和描述
4. 点击购物车结算去购物车页面
```html
<div class="right-gocart">
  <!-- 重新跳转到详情页面 -->
  <router-link :to="`/detail/${skuId}`" class="sui-btn btn-xlarge">查看商品详情</router-link>
  <router-link to="/shopcart">去购物车结算 > </router-link>
</div>
```

### 购物车页面的调整

删除第三项不需要的结构li,将每一项的ul宽度的百分比分别调整为:15,35,17,10,13

### 基本的数据展示和用户的临时标识

**获取购物车数据**

1. 编写获取购物车列表的请求接口函数
2. 在src/store/shopcart.js文件中编写Vuex获取购物车数据
3. 在ShopCart组件中的`mounted`中发送请求获取数据

请求接口函数:
```js
// 获取购物车列表:/api/cart/cartList
export const reqShopCartInfo = ()=>{
  return request({url:'/cart/cartList',method:'get'})
}
```

问题:***请求发送成功,但是获取到的数据为一个空数组,通过浏览器的network查看如下,通过Vue开发者工具查看能够得到数据,也是一个空数组***
```js
{"code":200,"message":"成功","data":[],"ok":true}
```

**用户的临时标识**

在用户没有登陆的时候,使用临时标识记录用户的身份
1. 在添加购物车的时候就需要带有一个标识,让后台知道是那个用户添加的购物车
2. 这样在查询购物车列表的时候,依然要带着这个标识过去,这样后台就知道是那个用户请求那个购物车数据
3. 我们获取不到数据就是因为添加购物车的时候没有标识,获取购物车列表的时候更加没有标识了,那么后台不知道要给谁给那个购物车列表数据

实现步骤:
1. 创建src/store/user.js文件,这个Vuex文件专门存储和用户相关的信息,引入暴露的工具方法,获取临时标识
2. 创建src/utils/userAbout.js文件,该文件是关于用户相关的一些工具类,暴露出一个获取userTempId的方法
   - 先从本地获取临时标识,如果没有使用uuid生成
   - 在这里面使用uuid生成临时标识字符串,uuid[在npm中搜索就有uuid的使用方法](https://www.npmjs.com/package/uuid)
   - 使用uuid生成了为了保证唯一性,存储到本地
3. 在src/utils/ajax.js文件中,引入store文件,从该文件中获取临时标识,如果有就添加到请求头中
   - 请求头的名称必须是`userTempId`这是后台规定的

可以通过Vuex工具查看生成的临时标识,并且浏览器刷新该标识也不会发生改变,唯一性保证用户唯一

工具文件:**使用uuid**
```js
import { v4 as uuidv4 } from 'uuid';
export const getUserTempId=()=>{
  // 先从本地获取userTempId(没登陆的用户标识)
  let userTempId = localStorage.getItem('USERTEMPID_KEY')
  // 从本地获取数据,如果获取不到返回的是null
  if(!userTempId){
    // 如果没有就生成一个,然后为了保证这个id的唯一性,需要存储到localStroage中
    userTempId = uuidv4()
    localStorage.setItem(USERTEMPID_KEY,userTempId)
  }
  // 最后将这个id返回去除
  return userTempId
}
```

关于用户的Vuex模块化文件:**调用工具类的方法获取临时标识**
```js
// 引用工具类返回userTempId
import {getUserTempId} from '@/utils/userAbout'
const state ={
  // 总的mian.js执行,总的Vuex文件执行,则这里执行就会去获取
  userTempId: getUserTempId()
}
const mutations = {}
const actions = {}
const getters = {}
export default {
  state,mutations,actions,getters
}
```

请求拦截器:**引入总的store,获取user模块中的临时标识,并添加到请求头中**
```js
// 引入总的store,这里不能用this,以为没有this啊
import store from "@/store"
// 请求拦截器
service.interceptors.request.use((config) => {
  if(store.state.user.userTempId){
    config.headers.userTempId = store.state.user.userTempId
  }
  nprogress.start() // 开启进度条
  return config
})
```

**展示直接能够展示的数据**
1. 数据的结构不是很好,需要借助getters和计算属性的双重计算避免假报错的情况
2. 展示商品描述,价格,数量,小计(通过价格和数量相乘计算得出)
3. 商品是否被选中的按钮,通过`isChecked`来判断

getters中的计算:
```js
const getters = {
  cartList(state) {
    // 如果数组数据没有得到则空数组的0索引为undefined,避免假报错
    return state.cartList[0] || {}
  }
};
```
计算属性中的计算:
```js
cartInfoList(){
  // 数据没回来cartlist是undefined,为了避免假报错再次计算获得需要展示的数据
  return this.cartList.cartInfoList || []
}
```

**展示需要经过计算的数据**
1. 已经选择的商品,使用`reduce()`
2. 总价,使用`reduce()`
3. 全选按钮是否被勾选,使用`every()`,这里使用计算属性的完整写法,因为该属性不光被读取,当修改的时候还要引起其他单选框的改变
   - 在绑定全选按钮的时候使用的是`v-model`这样的方式在修改的时候,配合`set`方法去修改,因为该属性被修改的时候会调用`set`方法,注意`v-model`作用在多选框上,如果没有指定数组收集,那么收集的是`checked`的布尔值,双向数据绑定,页面数据改变,直接影响了data中的数据
   - 在绑定其他多选框按钮使用的是`:checked`这样的方式在修改的时候要配合`click`事件,单项数据绑定,先影响data,data改变影响页面

注意:全选不适用`:ischekced`来动态指定是否选中,而是使用`v-model`这样默认的就是收集ischecked,并且能够在修改的时候触发计算属性的set方法
```html
<!-- 这里v-model,v-model没有使用数组,指定value,默认收集的就是ischecked,能够实现效果,并且需要双向数据绑定,当改变的时候触发计算属性的set方法 -->
<!-- 如果不用v-mode,就得通过click单独绑定事件来完成,这样借助计算属性的set方法就可以实现 -->
<input class="chooseAll" type="checkbox" v-model="isCheckAll" />
```

计算是否全选:使用计算属性的完整写法,并且用`every()`方法实现:
```js
// 计算全选:比较特殊,因为全选包括修改和获取,所以用计算属性的完整写法
isCheckAll:{
  get(){
    // 计算属性不要忘记返回值
    return this.cartInfoList.every(item=>{
      // every,如果每一个item的isCheck都为1,则返回true
      return item.isChecked === 1
    })
  }
},
```

### 购物车列表的交互逻辑

**每次交互都要发送请求**
1. 每次修改购物车列表的数据,都需要通知后台服务器,修改购物车列表的数据发生真正的改变
2. 因为购物车修改是修改存储在服务器上的数据,所以必须要先发送请求
3. 修改数据之后,,然后重新发送请求获取列表数据(得到新的数据重新展示)

**修改商品数量**
1. 修改数量,修改数量的接口就是添加购物车的接口,该接口的第二个参数代表变化的量
2. 点击+和-以及输入框绑定的是同一个事件,参数为当前要修改的cartInfo(可以获取到当前的商品数量),和变化的量(最终的量)以及是点击的那种按钮
3. 如果传递的是变化的量该怎么办?
4. 如果传递的是最终的量该怎么办?
5. 最终将任何值都转换为变化的量,然后发送请求修改购物车列表
6. 修改之后在重新发送请求重新请求购物车列表

使用之前添加购物车的接口函数,第二个参数如果是正数,就表示增加几个,如果是负数就表示减少几个,所以最终需要的是一个变化的量

注意:
1. ***在发送请求的时候要使用async函数,因为如果不使用,你发送请求了之后立即重新获取请求,会导致后台数据没有改变,请求的依旧是原来的数据***
2. ***所以在发送请求之后,跟Vuex中一样使用await等待成功信息返回后在执行后续获取新的购物车列表操作***

添加事件的结构:
```html
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
```

添加事件的回调函数:
```js
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
}
```

**修改购物车的选中状态单个**
1. 修改商品选择中状态的请求接口函数
2. 修改商品状态的actions,该Vuex不存储数据,而是根据成功失败的结果来进行后续操作

请求接口函数
```js
// 切换商品选中状态的请求接口函数:/api/cart/checkCart/{skuID}/{isChecked}  isChecked的0代表不选中,1代表选中
export const reqUpdateCartIschecked=(skuId,isChecked)=>{
  return request({url:`/cart/checkCart/${skuId}/${isChecked}`,method:"get"})
}
```

**修改购物车选中状态多个**

1. 就是全选按钮的操作,该操作没有具体的接口,借用单个选中和不选的actions配合`Promise.all`方法完成
2. 在计算isCheckAll的是时候了计算属性的完整写法,所以在`set()`方法中完成`dispatch`的操作

注意:***千万不要在set方法中将value值转换为0或者1,因为isChecked需要的是0或者1***

`Promise.all()`方法
1. 参数为一个Promise实例的数组
2. 返回一个Promise实例对象,如果都成功,返回一个状态为成功的promise实例,成功的值为,数组内部所有promise成功的value组成的数组,如果失败就返回状态为失败的promise实例,失败的原因就是失败的那个实例的原因

全选的计算属性set方法:
```js
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
```
vuex中利用`Promise.all`实现全选和全不选
```js
// 取消购物车的选中状态
async updateIsChecked({commit},{skuId,isChecked}){
  const result = await reqIsChecked(skuId,isChecked)
  if(result.code === 200) {
    return 'ok'
  }else {
    return Promise.reject(new Error('failed'))
  }
},
// 全选或者全不选,正常应该是有一个接口,这里没有全选和全部选的接口,所以采用promise.all来实现
updateIsCheckedAll({getters,commit,dispatch},isChecked) {
  const promises = []
  // 通过getters拿到数据,假报错因为不是正的错,这里拿到了之后,没有.而是forEach就算有假报错的可能也不会假报错
  getters.cartList.cartInfoList.forEach(item=>{
    if(item.isChecked === isChecked) return // 如果状态一样就不需要改变,我为1,想让请你们都为1,但是你们都是1了就不用改变了
    // 
    const promise = dispatch('updateIsChecked',{skuId:item.skuId,isChecked})
    promises.push(promise)
  })
  return Promise.all(promises)
} 
```

**删除单个的购物车新**
1. 请求接口函数
2. Vuex

请求接口函数:需要注意请求方式是delete
```js
// 删除商品信息:/api/cart/deleteCart/{skuId} 注意这次的请求方式为delete
export const reqDeleteCart=(skuId)=>{
  return request({url:`/cart/deleteCart/${skuId}`,method:'delete'})
}
```

**删除多个购物车信息**

跟全选和全部选的原理一样,使用`Promise.all()`

**补充:点击Header组件中的我的购物车按钮也可以实现跳转到购物车页面**

**完整的src/store/shopcart.js文件**
```js
import { reqAddOrUpdateShopCart,reqCartList,reqIsChecked,reqDeleteShopCart } from "@/api";

const state = {
  cartList:[]
};
const mutations = {
  RECEIVE_CARTLIST(state,cartList){
    state.cartList = cartList
  }
};
const actions = {
  // 添加购物车不需要存储数据,只需要发送请求,所以只有actions,而且actions中的方法只能收到第二个参数,所以需要放在对象中
  async addShopCart({ commit }, { skuId, skuNum }) {
    const result = await reqAddOrUpdateShopCart(skuId, skuNum);
    if (result.code === 200) {
      return "ok";
    } else {
      // 不能让该函数返回的Promise永远成功,所以手动返回一个失败状态的Promise,那么async函数返回的Promise实例状态就是失败的,失败的原因就是该Promise实例失败的原因
      return Promise.reject(new Error('failed'));
    }
  },
  // 获取购物车信息
  async getCartList({commit}) {
    const result = await reqCartList()
    if(result.code === 200) {
      commit('RECEIVE_CARTLIST',result.data)
    }
  },
  // 取消购物车的选中状态
  async updateIsChecked({commit},{skuId,isChecked}){
    const result = await reqIsChecked(skuId,isChecked)
    if(result.code === 200) {
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 全选或者全不选,正常应该是有一个接口,这里没有全选和全部选的接口,所以采用promise.all来实现
  updateIsCheckedAll({getters,commit,dispatch},isChecked) {
    const promises = []
    // 通过getters拿到数据,假报错因为不是正的错,这里拿到了之后,没有.而是forEach就算有假报错的可能也不会假报错
    getters.cartList.cartInfoList.forEach(item=>{
      if(item.isChecked === isChecked) return // 如果状态一样就不需要改变,我为1,想让请你们都为1,但是你们都是1了就不用改变了
      // 
      const promise = dispatch('updateIsChecked',{skuId:item.skuId,isChecked})
      promises.push(promise)
    })
    return Promise.all(promises)
  },
  // 删除购物车信息
  async deleteShopCart({commit},skuId){
    const result = await reqDeleteShopCart(skuId)
    if(result.code === 200) {
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 删除选中的购物车信息
  deleteShopCartChoice({getters,dispatch}){
    const promises = []
    getters.cartList.cartInfoList.forEach(item=>{
      if(!item.isChecked) return
      const promise = dispatch('deleteShopCart',item.skuId)
      promises.push(promise)
    })
    return Promise.all(promises)
  }
};


const getters = {
  cartList(state) { 
    // 如果数组数据没有得到则空数组的0索引为undefined,避免假报错
    return state.cartList[0] || {}
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};

```

**完整的ShopCart组件结构**
```html
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
```

**完整的ShopCart组件交互逻辑**
```js
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
```

## 登陆和注册

**登陆和注册的静态页面**

直接使用提供的静态组件
1. 之前在搭建页面架构的时候,已经注册了路由,就不需要配置路由了
2. 组件中的图片路径是assets,需要在该目录下创建images目录,将图片拷贝到这里,
3. assets目录存放多个组件共用的资源,所以可以将其他组件中用到相同图片使用该路径下的资源
4. 使用相对路径的时候,要注意位置:`../../assets/images/icons.png`
5. 可以使用`@`表示src目录,但是要添加`~@/assets/images/icons.png`
6. vscode左上角的搜索按钮可以搜索所有文件中的内容,快捷键为`shift+ctrl+f`
7. 使用`router-link`替换原来的超链接标签,实现登陆和注册的互相跳转

**注册的逻辑**
1. 请求接口函数注册的,和获取验证码的
2. 在data中定义数据,使用`v-model`收集注册信息
3. 填写手机号,才能获取验证码,获取到验证码存储到Vuex中,并且利用`v-model`的双向数据绑定实现自动填写
4. 简单的进行数据校验,如果校验通过发送请求进行注册
5. 注册成功给出提示然后跳转到登陆页面

**登陆的逻辑**
1. 登陆的请求接口函数
2. 编写user模块的Vuex,state中定义的token数据是先从localStorage中获取的,也就是如果你登陆过,mian.js中加载store.js文件,就能自动获取到了,就能实现自动登陆,不需要再次登陆(需要路由导航守卫进行配合使用),如果是第一次登陆在,发送请求成功之后,将数组存储到state中的token中,并且也存储在本地一份,这样第一次有了token数据(如果没有进行自动登陆,则页面一刷新就不是登陆的状态了)
3. 收集用户填写的信息,进行简单的校验,发送请求进行登陆
4. 注意:***登陆被包含在一个from表单中,点击登陆会跳转到该表单的地址,所以应该禁用表单提交的默认行为***
5. 在封装的aixos中,即scr/utils/ajax文件中,需要像添加临时标识一样,获取到token,如果有token就添加到请求头中,这样就能够以真实的用户身份在网站的访中畅通无阻了

自动登陆:***自动登陆的本质就是把token存储起来,以后只要重新登陆,就直接拿存储的token,需要将token保存在localStorage中,并且初始化的时候从localStroage中去获取***

**路由的导航守卫**

理解:***当路由进行跳转的时候,可以进行监测是否具备跳转到该路由组件的条件,满足条件就放行,不满足的处理***
1. 全局导航守卫:无论是从那个组件跳转到那个组件,只要有路由的跳转就会被拦截,进行监测
   - 前置守卫:配置的比较考前,匹配路由器前拦截,用的最多
   - 解析守卫:配置的位置中间,匹配路由中拦截
   - 后置守卫:配置的比较靠后,路由匹配完成拦截
2. 路由独享守卫:只能去拦截固定的跳转到某个组件的路由跳转,是配置在当前路由当中,时间比较靠前
   - 前置守卫:配置的比较考前,匹配路由器前拦截,用的最多
   - 解析守卫:配置的位置中间,匹配路由中拦截
   - 后置守卫:配置的比较靠后,路由匹配完成拦截
3. 组件内守卫:只能去拦截固定的跳转到某个组件的路由跳转(跟路由独享守卫一样),是在组件内部中进行配置的,也就是路由匹配已经完成了,时间比较靠后

**根据token获取用户信息,也叫做token校验,因为可以判定token是不是过期**
1. 在路由器文件src/router/index.js文件配置前置路由守卫,在该文件中引入store,需要获取token
2. 需要准备根据token获取用户信息的接口函数,该请求接口函数,不需要参数,只要是在请求头中带有token就能获取到
3. 写了请求接口函数只有,在user的Vuex模块中存储用户信息,注意:***该dispath不是在组件中派发,而是在有token而没有userInfo的情况下,在全局前置守卫中派发从而将用户的信息存储在Vuex中,因为这个请求是根据token来获取信息的,因为token有可能失效,所以存在获取失败的情况,也就是有后续操作***
4. 在全局前置守卫中需要引入store,因为需要获取到是否有token信息和userInfo的信息
   注意:***在判断是否有用户信息的时候,因为是空对象的话也会判断为真,所以具体到其name属性***
5. 在token过期的情况下,需要清理过期的token,这需要在Vuex的模块中写清理token的actions,不需要清理localStorage中的token,因为清理之后重新登陆,会自动将localStorage中的token覆盖掉,但是视频中也将存储在localStroage中token也清理掉了,我也清理掉把
6. 获取到用户的信息,将信息存储在Vuex中,就可以在Header组件中展示用户的姓名了,使用`v-if`和`v-else`如果有用户信息就展示用户信息,没有就展示登陆和注册
7. 如果没有token的情况,先直接`next()`不然在没有token的情况下页面什么都不会显示了
   

切记:***使用的是前置导航守卫,每一次路由的跳转都会进入该导航守卫进行判断***

**退出登陆**
1. 写请求接口函数
2. 写Vuex模块的actions,退出成功之后,要清除tokne和用户信息,以及本地存储的token
3. 退出登陆的按钮在Header组件中,所以在Header组件中点击退出登陆发送请求

**用户的临时标识userTempId和token的区别**
1. userTempId:未登录状态下的用户身份标识
2. token:登陆状态下的用户身份标识
3. 如果没有登陆,请求头当中带有临时标识,添加购物车的信息是和临时身份标识对应的信息
4. 如果登陆了,那么在请求头中添加临时标识和登陆后标识,那么后台会将临时标识对应的数据合并到token标识的用户里面,临时标识对应的数据就不见了
5. 如果两个都存在的话,后台会合并临时标识对应的信息到tokne对应的信息上,以token为主

举例子:***没有登陆添加购物车信息,则登陆后查看,里面有没有登陆的时候添加的内容,退出之后,购物车内容消失了(临时的合并到token的了)***

相关的请求接口函数文件:
```js
// 用户注册的请求接口函数:/api/user/passport/register
export const reqRegister=(userInfo)=>{
  return request({url:'/user/passport/register',data:userInfo,method:'post'})
}

// 获取验证码的请求接口函数/api/user/passport/sendCode/{phone}
export const reqCode=(phone)=>{
  return request({url:`/user/passport/sendCode/${phone}`,method:'get'})
}

// 登陆的请求接口函数:/api/user/passport/login
export const reqLogin=(userInfo)=>{
  return request({url:'/user/passport/login',method:'post',data:userInfo})
}

// 根据token获取用户信息的请求接口函数:/api/user/passport/auth/getUserInfo
export const reqUserInfo=()=>{
  return request({url:'/user/passport/auth/getUserInfo',method:'get'})
}

// 用户退出的请求接口函数:/api/user/passport/logout
export const reqLogout=()=>{
  return request({url:'/user/passport/logout',method:"get"})
}
```

用户模块:src/store/user.js文件
```js
// 引用工具类返回userTempId
import {getUserTempId} from '@/utils/userAbout'
import { reqRegister,reqCode, reqLogin, reqUserInfo , reqLogout} from '@/api'
const state ={
  // 总的mian.js执行,总的Vuex文件执行,则这里执行就会去获取
  userTempId: getUserTempId(),
  // 验证码
  code:'',
  // token:以前没有登陆过,则获取到不到为null,那么就需要登陆获取token(路由导航守卫配合)如果能够获取到就不需要再次登陆了,能够实现自动登陆的效果
  token:localStorage.getItem('TOKEN_KEY'),
  // 根据tokne获取用户信息
  userInfo:{}
}
const mutations = {
  RECEIVE_CODE(state,code){
    state.code = code
  },
  RECEIVE_TOKEN(state,token){
    state.token = token
  },
  RECEIVE_USERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  CLEAR_TOKEN(state){
    state.token = ''
  },
  CLEAR_USERINFO(state){
    state.token = ''
    state.userInfo = {}
  }
}
const actions = {
  // 用户注册
  async register({commit},userInfo){
    const result = await reqRegister(userInfo)
    if(result.code === 200){
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 获取验证码
  async getCode({commit},phone){
    const result = await reqCode(phone)
    if(result.code === 200){
      commit('RECEIVE_CODE',result.data)
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 用户登陆
  async login({commit},userInfo){
    const result = await reqLogin(userInfo)
    if(result.code === 200){
      // 第一次登陆,存储token,这个数据返回的不严谨,应该只有token
      commit('RECEIVE_TOKEN',result.data.token)
      // 将token存储到本地,这样store文件在main.js中被加载执行,就能自动获取到token了
      localStorage.setItem('TOKEN_KEY',result.data.token)
      return 'ok'
    }else {
      return 'failed'
    }
  },
  // 根据token获取到的用户信息,只要在请求头中携带了token,就能获取到
  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if(result.code === 200){
      commit('RECEIVE_USERINFO',result.data)
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 清理过期的token
  clearToken({commit}){
    commit('CLEAR_TOKEN')
    // 也清除掉本地存储的token
    localStorage.removeItem('TOKEN_KEY')
  },

  // 退出登陆
  async logout({commit}){
    const result = await reqLogout()
    if(result.code === 200){
      commit('CLEAR_USERINFO')
      localStorage.removeItem('TOKEN_KEY')
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  }
}
const getters = {}  
export default {
  state,mutations,actions,getters
}
```

封装axios文件:src/utils/ajax.js
```js
import axios from "axios"
import nprogress from "nprogress"  // 引入nprogress
import store from "@/store"
// 创建一个和axios工具具有相同功能的一个实例,相当于axios的一个复制品
const service = axios.create({
  baseURL: '/api', // 设置所有接口的公共路径
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use((config) => {
  // 每个请求头要携带临时标识,在用户没有登陆的情况下标识身份,比如能够获取购物车列表信息
  if(store.state.user.userTempId){
    config.headers.userTempId = store.state.user.userTempId
  }
  // 每个请求都看看有没有token,有token就在请求头携带token
  if(store.state.user.token) {
    config.headers.token = store.state.user.token
  }
  nprogress.start() // 开启进度条
  return config
})
// 响应拦截器
service.interceptors.response.use(
  response => {
    nprogress.done() // 关闭进度条
    // response.data就是响应的数据,响应的数据格式中还有一个data才是我们需要的数据
    return response.data
  },
  error => {
    nprogress.done()  // 关闭进度条
    // 统一处理错误
    alert('发送ajax请求失败'+error.message || '未知错误')
    // return Promise.reject(new Error('发送ajax请求失败')) 这种方式可以继续处理错误
    return new Promise(() => { }) // 返回pending状态的promise实例,这种方式中断了promise链条,无法继续处理
  }
)
// 将封装的axios暴露出去
export default service
```

路由器配置中的全局前置守卫:src/router/index.js
```js
// 引入并使用
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 引入store,因为要获取其中的token和userInfo
import store from '@/store'

import routes from './routes'
// 我们还是要调用这些方法的,所以将这些方法存储起来,后期使用
const originPush = VueRouter.prototype.push  // push方法就在VueRouter的原型对象上
const originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, onResolve, onReject) {
  /* 
    参数
      1. location:就是对象形式传递参数传递的对象
      2. resolve:成功的回调函数
      3. reject:失败的回调函数
    原理:
      1. VueRouter是路由器对象的构造函数
      2. this.$router.push调用的是路由器对象的方法,这个方法并不是路由器对象实例的方法,而是VueRouter原型对象上的方法
      3. this.$router是实例化对象,是VueRouter的实例化对象
    this问题:
      1. 如果全局调用originPush,this为window,但是在这里应该undefiend
      2. 所以使用call,谁调用这个方法this就是谁,是VueRouter的实例对象调用的,即this.$router(就是VueRouter的实例对象)
      3. 这里不能使用箭头函数,因为箭头函数没有自己的this,就去找到外面,依然是undefined
  */
  if (onReject === undefined && onReject === undefined) { // 如果没有传递就是undefined,所以可以直接判断,不需要===undefiend
    // originPush.call(this,location,()=>{},()=>{})
    originPush.call(this, location).catch(() => { })
  } else {
    originPush.call(this, location, onReject, onResolve)
  }
}
VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onReject === undefined && onReject === undefined) {
    console.log(this)
    originReplace.call(this, location, () => { }, () => { })
  } else {
    originReplace.call(this, location, onReject, onResolve)
  }
}

// 暴露路由器对象
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },
  // 路由模块化,引入暴露出来的路由配置信息
  routes
})
// 注册全局前置导航守卫,用来做token校验
router.beforeEach(async (to, from, next) => {
  /* 
    to:跳转到目标路由对象
    from:离开的路由对象
    next:是一个函数,next()代表无条件放行,next('/')代表强制跳转到某个位置,next(false)表示不放行,原地不动
  */
  const token = store.state.user.token
  const userInfo = store.state.user.userInfo.name
  // 如果token存在代表用户登陆
  if (token) {
    // 登陆了还去登陆,还要去登陆就没有意义,就去首页
   
    if (to.path === '/login') {
      next('/')
    } else {
      
      // 去其他页面可以随便去,但是要判断一下是否有用户信息,如果有信息就随便去,没有就发送请求获取信息
      if (userInfo) {
        next()
      } else {
        // 使用引入的store派发请求
        try {
          await store.dispatch('getUserInfo')
          // 获取用户信息成功之后无条件放行
          next()
        } catch (error) {
          // 如果获取用户信息失败,说明token失效(过期),先将过期的token清理,所以去登陆页面重新登陆
          store.dispatch('clearToken')
          next('/login')
        }
      }
    }
  } else {
    // 如果用户没有登陆,现在不进行任何操作,注意这里放行啊,不放行就什么都不显示了
    next()
  }
})
export default router
```

有了用户信息之后,就可以在Header组件中进行展示:用`v-if`和`v-else`进行展示
```html
<p v-if="$store.state.user.userInfo.name">
  <a href="javascript:;">{{$store.state.user.userInfo.nickName}}</a>
  <router-link to="/register" class="register">免费注册</router-link>
</p>
<p v-else>
  <span>请</span>
  <router-link to="/login">登录</router-link>
  <router-link to="/register" class="register">免费注册</router-link>
</p>
```

Login组件中登陆的逻辑部分:
```js
export default {
  name: "Login",
  data() {
    return {
      userInfo: {
        phone: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      const { phone, password } = this.userInfo    
      if (phone && password) {
        try {
          await this.$store.dispatch("login", this.userInfo);
          this.$message.success("登陆成功");
          this.$router.push("/home");
        } catch (error) {
          this.$message.error("登陆失败");
        }
      }
    },
  },
};
```

Register组件中注册的逻辑部分:
```js
export default {
  name: 'Register',
  data(){
    return {
      userInfo:{
        phone:'',
        code:'',
        password:'',
        repeatPassword:'',
        // 是否同意条款,默认同意
        agree:true
    }
    }
  },
  methods:{
    // 点击获取验证码
    async getCode(){
      // 为了能够让验证码有数据,然后赋值,所以使用try处理,需要Vuex中的actions中返回成功或者失败的promise来配合
      try {
        await this.$store.dispatch('getCode',this.userInfo.phone)
        this.userInfo.code = this.$store.state.user.code
      } catch (error) {
        this.$message.success('获取验证码失败')
      }
      
    },
    // 注册
    async register(){
      const {phone,code,password,repeatPassword} = this.userInfo
      if(phone && code && password && repeatPassword && password === repeatPassword){
        try {
          // 键值对相同,省略键名,该接口函数需要请求体参数
          await this.$store.dispatch('register',{phone,code,password})
          this.$message.success('注册成功')
          // 注册成功跳转到登陆页
          this.$router.push('/login')
        } catch (error) {
          this.$message.error('注册失败')
        }
      }
    }
  }
}
```

Header组件中退出的逻辑部分:
```js
// 退出登陆
async logout(){
  try {
    await this.$store.dispatch('logout')
    this.$message.success('退出成功')
    this.$router.push('/')
  } catch (error) {
    this.$message.error('退出失败')
  }
}
```

## 点击结算从购物车跳转到交易页面


1. 该页面需要发送两个请求,分别获取用户的收货地址(user模块)和订单的交易信息(新建trade模块)
2. 订单的交易信息有tradeNo属性,用来生成支付信息

## 支付

### es6模块化暴露和引入的本质

总结：
1. 无论什么暴露方式，最终往外暴露的都是一个对象，只不过暴露对象的形成方式不一样
2. 默认暴露保留的对象，这个对象里面是以default为属性名，以default后面的内容为值的对象
   - 引入的时候名称和自定义，并且有简写方式和完整方式
3. 分别暴露会将暴露的内容信息自动封装为一个对象
4. 统一保留暴露的就是自己整理的对象
5. 分别暴露和统一保留在暴露的时候区别,但是引入的时候完全相同,引入的时候必须名称和暴露的名称对应,但是可以使用as改名
6. 无论什么样的暴露方式,最终都可以使用`import * as xxx from './xxx.js'`的方式引入,会把暴露的内容整理成一个对象来处理,不过默认暴露对象里面的default属性才是真正暴露的内容

**默认暴露**

默认暴露的文件内容:
```js
// 默认暴露后面直接写要暴露的内容
export default {
  num:10,
  fn:()=>{}
}
```

简写的引入方式:
```js
// 默认暴露在引入的时候名字可以所以起名字
import module from './module'
console.log(module)
```

完整的引入方式:***以为完整方式比较复杂，所以才有简写方式***
```js
import {default as module} from './module'
console.log(module)
```

使用`* as`进行引入:
```js
import * as module from '@/module'
console.log(module)
```

注意：***这种方式得到一个构造函数为Module的对象，对象里以后一个default属性，该属性的对象就是暴露的内容,如下格式***
```js
Module {default: {…}, __esModule: true, Symbol(Symbol.toStringTag): 'Module'}
  default: {num: 10, fn: ƒ}
  __esModule: true
  Symbol(Symbol.toStringTag): "Module"
  [[Prototype]]: Object
```

**分别暴露**

分别暴露的内容：
```js
// 分别暴露的时候，保留的内容就跟写js的语法时候一样
export const num = 10
export const fn = ()=>{}
```

引入方式：
```js
// 在引入的时候，引入的名称必须和暴露的名称一样，但是可以使用as改名
import {num,fn as show} from '@/module'
console.log(num)
console.log(show)
```

使用`* as`进行引入:***和默认暴露的区别在于，得到的Module构造的对象，里面的属性就直接是暴露的内容，没有多一层default属性***
```js
// 在引入的时候，引入的名称必须和暴露的名称一样，但是可以使用as改名
import * as module from '@/module'
console.log(module)
```

**统一暴露**

统一暴露和分别暴露在暴露的时候有一些区别，但是在引入的时候完全相同

暴露的内容：
```js
const num = 10
const fn = ()=>{}
export {num,fn}
```

引入方式：
```js
// 在引入的时候，引入的名称必须和暴露的名称一样，但是可以使用as改名
import {num,fn} from '@/module'
console.log(num,fn)
```

使用`* as`进行引入:
```js
import * as module from '@/module'
console.log(module)
```


### Trade(订单交易页面)

**从点击Trade组件中提交订单开始,就不在使用vuex来存储数据了**

**静态组件**

1. 直接使用提供的订单和支付相关的组件,并且注册路由信息
2. 点击购物车的计算按钮跳转(使用`router-link`实现路由的跳转)到Trade组件(选择地址进行支付)
3. 需要两个请求:获取订单交易页信息(和我的订单列表要区分,以及购物车列表区分)的请求接口函数和获取用户地址信息的请求接口函数
4. 用户的收获地址信息就在Vuex的user模块编写, 订单交易信息需要新建trade模块(新建的模块不要忘记注册到总的Store中)
5. 在Trade组件中发送请求或者订单交易的信息和地址信息并且展示
   - 获取的地址信息直接就是一个数组`mapState`,同时也获取到交易信息,因为包含总价等信息
   - 获取的交易页信息的商品信息需要使用getters简化一下获取`mapGetters`
   - 在展示地址的时候需要动态的绑定calss和显示默认地址字样,这里的判断要写全,因为决定是否显示和绑定的isDefault的值是字符串类型
   - 计算属默认显示的地址信息用于底部的显示,并且计算出来可能是一个空对象,需要避免假报错
   - 点击地址可以切换默认地址,利用的是排他思想

**点击提交订单跳转到支付页面**

但是提交订单跟添加到购物车一样,需要提前发送请求,提交订单,创建订单,成功会返回一个订单编号,然后携带订单编号跳转到订单支付页面
1. 不能直接跳转,要添加点击事件
2. 请求接口函数,该请求接口需要的参数traderNo在tradeInfo中
3. 不使用cations发送请求，所以使用`import * as API from '@/api'`的方式在main.js中将请求接口函数文件导出为一个对象，在添加到Vue.protoype上，就可以直接使用了
4. 请求成功之后通过query参数将订单编号携带跳转到Pay组件(支付页面)

请求接口函数:
```js
// 提交订单的请求接口函数:/api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqSubmitOrder=(tradeNo,tradeInfo)=>{
  return request({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data:tradeInfo})
}
```

src/store/user.js的Vuex模块文件
```js
// 引用工具类返回userTempId
import {getUserTempId} from '@/utils/userAbout'
import { reqRegister,reqCode, reqLogin, reqUserInfo , reqLogout,reqUserAddressInfo} from '@/api'
const state ={
  // 总的mian.js执行,总的Vuex文件执行,则这里执行就会去获取
  userTempId: getUserTempId(),
  // 验证码
  code:'',
  // token:以前没有登陆过,则获取到不到为null,那么就需要登陆获取token(路由导航守卫配合)如果能够获取到就不需要再次登陆了,能够实现自动登陆的效果
  token:localStorage.getItem('TOKEN_KEY'),
  // 根据tokne获取用户信息
  userInfo:{},
  // 用户的地址信息
  userAddressList:[]
}
const mutations = {
  RECEIVE_CODE(state,code){
    state.code = code
  },
  RECEIVE_TOKEN(state,token){
    state.token = token
  },
  RECEIVE_USERINFO(state,userInfo){
    state.userInfo = userInfo
  },
  CLEAR_TOKEN(state){
    state.token = ''
  },
  CLEAR_USERINFO(state){
    state.token = ''
    state.userInfo = {}
  },
  RECEIVE_USERADDRESSLIST(state,userAddressList){
    state.userAddressList = userAddressList
  }
}
const actions = {
  // 用户注册
  async register({commit},userInfo){
    const result = await reqRegister(userInfo)
    if(result.code === 200){
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 获取验证码
  async getCode({commit},phone){
    const result = await reqCode(phone)
    if(result.code === 200){
      commit('RECEIVE_CODE',result.data)
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 用户登陆
  async login({commit},userInfo){
    const result = await reqLogin(userInfo)
    if(result.code === 200){
      // 第一次登陆,存储token,这个数据返回的不严谨,应该只有token
      commit('RECEIVE_TOKEN',result.data.token)
      // 将token存储到本地,这样store文件在main.js中被加载执行,就能自动获取到token了
      localStorage.setItem('TOKEN_KEY',result.data.token)
      return 'ok'
    }else {
      return 'failed'
    }
  },
  // 根据token获取到的用户信息
  async getUserInfo({commit}){
    const result = await reqUserInfo()
    if(result.code === 200){
      commit('RECEIVE_USERINFO',result.data)
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 清理过期的token
  clearToken({commit}){
    commit('CLEAR_TOKEN')
    // 也清除掉本地存储的token
    localStorage.removeItem('TOKEN_KEY')
  },

  // 退出登陆
  async logout({commit}){
    const result = await reqLogout()
    if(result.code === 200){
      commit('CLEAR_USERINFO')
      localStorage.removeItem('TOKEN_KEY')
      return 'ok'
    }else {
      return Promise.reject(new Error('failed'))
    }
  },
  // 获取用户的地址信息
  async getUserAddressList({commit}){
    const result = await reqUserAddressInfo()
    if(result.code === 200){
      commit('RECEIVE_USERADDRESSLIST',result.data)
    }
  }
}
const getters = {}  
export default {
  state,mutations,actions,getters
}
```

src/store/trade.js的Vuex模块文件
```js
import { reqTradeInfo } from "@/api"
const state = {
  tradeInfo:{}
}
const mutations = {
  RECEIVE_TRADEINFO(state,tradeInfo){
    state.tradeInfo = tradeInfo
  }
}
const actions = {
  async getTradeInfo({commit}){
    const result = await reqTradeInfo()
    if(result.code === 200){
      commit('RECEIVE_TRADEINFO',result.data)
    }
  }
}
const getters = {
  detailArrayList:state=>state.tradeInfo.detailArrayList || []
}

export default {
  state,mutations,actions,getters
}
```

Trade组件中的逻辑交互部分
```js
import { mapGetters, mapState } from "vuex";
export default {
  name: "Trade",
  data(){
    return {
      message:'',

    }
  },
  mounted() {
    this.getTradeInfo();
    this.getUserAddressList();
  },
  methods: {
    getTradeInfo() {
      this.$store.dispatch("getTradeInfo");
    },
    getUserAddressList() {
      this.$store.dispatch("getUserAddressList");
    },
    // 切换默认地址
    changeDefaultAddress(userAddress) {
      this.userAddressList.forEach((item) => {
        item.isDefault = "0";
      });
      userAddress.isDefault = "1";
    },
    // 提交订单
    async submitOrder() {
      const tradeNo = this.tradeInfo.tradeNo
      // 订单的信息请求体参数
      const tradeInfo = {
        consignee: this.defaultAddress.consignee,
        consigneeTel: this.defaultAddress.phoneNum,
        deliveryAddress: this.defaultAddress.fullAddress,
        paymentWay: "ONLINE", // 支付方式默认
        orderComment: this.message,  // 这里填写用户的留言
        orderDetailList: this.detailArrayList // 这个就是商品展示的列表信息
      };
      // 这里跟在vuex中发送请求时一样的道理，因为响应拦截器已经处理了错误的情况，这里只需要等待请求成功的vlaue就可以了
      const result = await this.$API.reqSubmitOrder(tradeNo,tradeInfo);
      if(result.code === 200){
        // 请求成功,跳转到Pay路由组件,并且将订单编号通过query参数传递过去
        this.$router.push('/pay?orderNum=' + result.data)
      }
    },
  },
  computed: {
    // 地址列表直接就是一个数组,也要获取到tranInfo,因为里面包含总价等信息
    ...mapState({
      userAddressList: (state) => state.user.userAddressList,
      tradeInfo: (state) => state.trade.tradeInfo,
    }),
    // 需要展示的商品列表使用getters简化一下
    ...mapGetters(["detailArrayList"]),
    // 计算出默认选中的地址,用于底部的展示
    defaultAddress() {
      return (
        this.userAddressList.find((item) => {
          return item.isDefault === "1";
        }) || {}
      );
    },
  },
};
```

main.js中统一整理接口的操作:
```js
import * as API from '@/api'
Vue.prototype.$API = API // 也可以在beforeCreate中进行这一步的操作
```

### 支付页面（Pay）

**静态页面**

主要就是展示一下订单编号和支付的金额
1. 跳转到支付页面之后,提交订单得到的订单编号已经通过query参数传递过来了,可以直接获取展示
2. 对于应该支付的金额,需要重新发送一个请求获取订单的支付信息(所以要在写请求接口函数)
3. 接口函数需要的id,就是通过query参数传递过来的订单编号
4. 因为没有使用Vuex,所以将要存储的数据直接定义在data中,发送请求还是在`mouted`中进行发送,定义发送请求的方法依然在methods中

**element-ui的按需引入**

一次性全部引入的方式
```js
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
```

在官网文档中有详细的说明
1. 安装element-ui:`npm i element-ui -S`
2. 安装需要引入的babel相关包:`npm install babel-plugin-component -D`
3. 配置.babelrc文件,该文件对应babel.config.js文件
4. 引入组件并且注册,在utils目录中创建element.js文件,该文件负责引入elementui的组件,并且在mian.js中引入一下(只需要引入一下,不需要暴露什么内容)
   - 组件的方式注册
   - 插件的方式注册
   - 挂载在Vue原型上进行注册

babel.config.js文件
```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 这部分内容是element-ui的按需引入配置
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
```

按需引入的文件:
```js
import Vue from 'vue'
import { Button,MessageBox,Message } from "element-ui"
// 像是注册组件一样注册
// Vue.component(Button.name,Button)
// 像是使用插件一样注册
Vue.use(Button)
// 以下这些组件在引入之后,需要挂载在原型上使用,就不能使用componet或者vue注册,但是需要引入进来
Vue.prototype.$msgbox = MessageBox; // 这个是alert和confirm和prompt的基础
Vue.prototype.$message = Message;
Vue.prototype.$alert = MessageBox.alert; // 如果需要使用alert,则必须引入messageBox,但是不需要用Vue.componet来注册
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
```


**点击立即支付按钮需要弹出用于支付的微信二维码**

该支付的弹出框是用elemnet-ui的messageBox来完成的
1. 生成微信二维码,在发送请求获取到的订单支付信息里面有用来生成支付二维码的信息codeUrl
   - 安装qrcode:`npm install --save qrcode`
   - 在github搜索该包的名字叫做:qrcode
   - 引入qrcode
   - 使用qrcode提供的方法,生成图片链接:`const imgUrl = await QRCode.toDataURL(this.orderInfo.codeUrl)`
2. 弹出提示框,并使用img标签展示二维码
3. 展示二维码之后要立即开启定时器轮询发送请求检查是否支付
   - 需要写一个请求接口函数
   - 定时器要保证唯一性,所以需要判断
   - 如果成功要存储成功的标志
   - 进行提示
   - 清除定时器要清除干净
   - 自动跳转到支付成功页面
   - 需要关闭弹出层,因为这个弹出层是全局的,不关闭跳转到支付成功页面也会显示,使用`this.msgBox.close()`

**点击我已支付和支付遇到问题**

我已经支付
1. 判断是否真正支付了,没有支付给出提示
2. 支付了会自动跳转,这里不需要额外操作

支付遇到问题
1. 关闭弹出框
2. 关闭定时器


请求接口函数:
```js
// 是否支付成功的请求接口函数:/api/payment/weixin/queryPayStatus/{orderId}
export const reqPaySuccess=(orderId)=>{
  return request({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})
}
```

Pay组件的交互逻辑:***主要是支付的逻辑***
```js
import QRCode from "qrcode";
export default {
  name: "Pay",
  data() {
    return {
      // 传递过来的订单编号
      orderNo: "",
      // 订单的支付信息
      orderInfo: {},
      // 支付成功的标识
      payStatus:0
    };
  },
  beforeMount() {
    // 得到传递过来的订单编号
    this.orderNo = this.$route.query.orderNum;
  },
  async mounted() {
    this.getOrderInfo();
  },
  methods: {
    async getOrderInfo() {
      const result = await this.$API.reqOrderInfo(this.orderNo);
      if (result.code === 200) {
        this.orderInfo = result.data;
      }
    },
    // 立即支付
    async pay() {
      // 生成微信二维码,通过orderInfo中的codeUrl借助一个插件生成图片
      try {
        const imgUrl = await QRCode.toDataURL(this.orderInfo.codeUrl);
        // 弹出messageBox,这里/>要有一个空格,不然不知道为啥不显示图片
        this.$alert("<img src=" + imgUrl + " />", "请扫码支付", {
          dangerouslyUseHTMLString: true, // 第一个参数当作html片段处理
          showClose: false, // 不显示右上角的关闭按钮
          showCancelButton: true, // 取消按钮显示
          showConfirmButton: true, // 确认按钮显示
          cancelButtonText: "支付遇到问题", // 取消支付按钮文本
          confirmButtonText: "我已经支付完成", // 确定按钮文本内容
          center: true, // 剧中布局
          // beforeClose配置项
          beforeClose:(action, instance, done)=>{ // 注意这里要用箭头函数,因为this.timer,定时器的this是window,如果不用箭头函数就是window,则关闭不掉定时器
            // 如果actions为confirm表示点击的为确定按钮,点击的为cancel点击的是取消按钮
            if(action === 'confirm'){
              if(!this.payStatus){
                // 只需要考虑没有支付的情况,什么也不做,等待支付,支付成功轮询会检查到实现自动跳转
                this.$message.info('请继续支付,支付会自动跳转')
              }
              // 开启这段代码可以实现不支付直接能够跳转到支付成功页面
              /* clearInterval(this.timer)
              this.timer = null
              done()
              this.$router.push('/paysuccess') */
            }else if(action  === 'cancel'){
              this.$message.info('取消支付')
              clearInterval(this.timer)
              this.timer = null
              // 关闭弹出
              done()
            }
          }
        }).then(()=>{}).catch(()=>{}) // 这里可以只指定一个catch

        /* 
          this.$alert最后返回的是一个promise实例,可以用then(这里并不是原生的PROMISE的then方法)和catch指定点击确定和点击取消的操作,但是都会直接关闭弹出层,这个不符合需求
          所以使用beforeClose
        */

        // 开启轮询之前保证定时器只有一个,没有才开启
        if (!this.timer) {
          // 开启轮询检查是否支付成功
          this.timer = setInterval(async () => {
            const result = await this.$API.reqPaySuccess(this.orderNo);
            if (result.code === 200) {
              // 表示支付成功
              this.payStatus = result.data
              // 关闭定时器:clearInter只是清除了定时器,不让定时器管理模块当中定时器工作,需要将编号也清除
              clearInterval(this.timer)
              this.timer = null
              // 关闭弹出层
              this.$msgbox.close()
              // 跳转到支付成功页面
              this.$router.push('paysuccess')
            }
          }, 2000);
        }
      } catch (error) {
        this.$message.error("获取支付二维码失败");
      }
    },
  },
};
```

### 订单页面(Center)

**订单页面的静态展示**

1. 支付成功之后,跳转到支付成功页面,这个页面里点击查看订单按钮跳转到我的订单页面
2. Header组件中点击我的订单,也可以跳转到订单页面

将订单页面拆分成一个二级路由组件,二级路由的配置,需要使用`router-link`实现路由的跳转
1. 并且给当先显示的添加一个样式(使用使用route.path来进行判断)
2. 也可以在样式中直接定义一个类名为`router-link-active`的类,在类中指定样式,因为被选中的`router-link`会自动添加该类名
3. 或者给每一个添加`active-class`

第一种方式给选中的路由指定样式:
```html
<dd>
  <router-link to="/center/mycenter" :class="{active:$route.path === '/center/mycenter'}">我的订单</router-link>
</dd>
<dd>
  <router-link to="/center/groupcenter" :class="{active:$route.path === '/center/groupcenter'}">团购订单</router-link>
</dd>
```

二级路由的配置,有两种配置方式:
1. 一种配置在一级路由中,直接配置redirect并且路径要写全
2. 二种配置方式在二级路由中进行配置,path配置为空,redirect不写全,直接写要显示的路由名称
```js
{
  path:'/center',
  component:Center,
  meta:{title:'个人中心'},
  // 重定向路由第一种配置方式,路径要写全
  // redirect:'/center/mycenter',
  children:[
    {
      path:'mycenter',
      component:MyCenter,
      meta:{title:'我的个人中心'},
    },
    {
      path:'groupcenter',
      component:GroupCenter,
      meta:{title:'团队个人中心'},
    },
    // 第二种配置方式,直接在子路由中配置,path为空,路径不能写全
    {
      path:'',
      redirect:'mycenter'
    }
  ]
},
```

**订单页面发送请求获取数据并且展示**

1. 请求接口函数
2. 在MyCenter组件中发送请求,将数据存储在data中
3. 使用计算属性简化数据的获取
4. 数据展示完成之后,需要合并表格,合并之后还要使用`v-if`进行判断,只有当index===0的时候才展示,不然会出现很多行内容
5. 分页使用之前自定义的分页组件,传递分页组件需要的数据,然后给组件标签绑定自定义事件,在methods指定自定义事件的回调函数(切换页面)

请求接口函数:
```js
// 获取我的订单列表:/api/order/auth/{page}/{limit}
export const reqOrderList=(page,limit)=>{
  return request({url:`/order/auth/${page}/${limit}`,method:'get'})
}
```

分页组件的使用部分:
```html
<div class="choose-order">
  <Pagination :currentPageNo="page" :pageSize="limit" :total="orderList.total" :ontinueNo="5" @changeNumberSearch="changeNumberSearch"></Pagination>
</div>
```

MyCenter组件的逻辑部分:
```js
export default {
  name: "MyCenter",
  data(){
    return {
      // 订单列表
      orderList:{},
      // 定义两个查询需要的参数,当前页和每页显示多少条
      page:1,
      limit:3,
    }
  },
  mounted(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){ // page = 1; this.page = page
      const result = await this.$API.reqOrderList(this.page,this.limit)
      if(result.code === 200){
        this.orderList = result.data
      }
    },
    // 分页切换页码的事件,可以不定义该事件回调,直接使用上面的获取订单列表的函数代替
    changeNumberSearch(page){
      this.page = page
      this.getOrderList()
    }
  },
  computed:{
    // 计算出要遍历的数据,这个是每一条订单,订单里面包含多个商品数据
    records(){
      return this.orderList.records
    }
  }
};
```

注意:**提交订单(生成订单信息包括金额)和添加到购物车都要先发送请求**

## 使用导航守卫解决组件访问问题

### token校验的完善

如果没有登陆,访问和交易相关,支付相关,用户中心相关的页面,则跳转到登陆页面,而登陆成功之后自动跳转到之前想去而没有去成的页面
全局守卫:如果多个页面都需要进行同一种监测,则使用全局守卫

现在只需要完成之前token校验的全局前置守卫补充没有登陆(没有token的操作)
为了实现能够在登陆后去往之前想去的页面,还需要在Header组件中对登陆进行处理

src/router/index.js的完整文件:补充了token校验没有登陆的部分内容:
```js
// 引入并使用
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
// 引入store,因为要获取其中的token和userInfo
import store from '@/store'

import routes from './routes'
// 我们还是要调用这些方法的,所以将这些方法存储起来,后期使用
const originPush = VueRouter.prototype.push  // push方法就在VueRouter的原型对象上
const originReplace = VueRouter.prototype.replace
VueRouter.prototype.push = function (location, onResolve, onReject) {
  /* 
    参数
      1. location:就是对象形式传递参数传递的对象
      2. resolve:成功的回调函数
      3. reject:失败的回调函数
    原理:
      1. VueRouter是路由器对象的构造函数
      2. this.$router.push调用的是路由器对象的方法,这个方法并不是路由器对象实例的方法,而是VueRouter原型对象上的方法
      3. this.$router是实例化对象,是VueRouter的实例化对象
    this问题:
      1. 如果全局调用originPush,this为window,但是在这里应该undefiend
      2. 所以使用call,谁调用这个方法this就是谁,是VueRouter的实例对象调用的,即this.$router(就是VueRouter的实例对象)
      3. 这里不能使用箭头函数,因为箭头函数没有自己的this,就去找到外面,依然是undefined
  */
  if (onReject === undefined && onReject === undefined) { // 如果没有传递就是undefined,所以可以直接判断,不需要===undefiend
    // originPush.call(this,location,()=>{},()=>{})
    originPush.call(this, location).catch(() => { })
  } else {
    originPush.call(this, location, onReject, onResolve)
  }
}
VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onReject === undefined && onReject === undefined) {
    console.log(this)
    originReplace.call(this, location, () => { }, () => { })
  } else {
    originReplace.call(this, location, onReject, onResolve)
  }
}

// 暴露路由器对象
const router = new VueRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  },
  // 路由模块化,引入暴露出来的路由配置信息
  routes
})
// 注册全局前置导航守卫,用来做token校验
router.beforeEach(async (to, from, next) => {
  /* 
    to:跳转到目标路由对象
    from:离开的路由对象
    next:是一个函数,next()代表无条件放行,next('/')代表强制跳转到某个位置,next(false)表示不放行,原地不动
  */
  const token = store.state.user.token
  const userInfo = store.state.user.userInfo.name
  // 如果token存在代表用户登陆
  if (token) {
    // 登陆了还去登陆,还要去登陆就没有意义,就去首页
   
    if (to.path === '/login') {
      next('/')
    } else {
      
      // 去其他页面可以随便去,但是要判断一下是否有用户信息,如果有信息就随便去,没有就发送请求获取信息
      if (userInfo) {
        next()
      } else {
        // 使用引入的store派发请求
        try {
          await store.dispatch('getUserInfo')
          // 获取用户信息成功之后无条件放行
          next()
        } catch (error) {
          // 如果获取用户信息失败,说明token失效(过期),先将过期的token清理,所以去登陆页面重新登陆
          store.dispatch('clearToken')
          next('/login')
        }
      }
    }
  } else {
    // 如果用户没有登陆,现在不进行任何操作,注意这里放行啊next(),不放行就什么都不显示了
    const target = to.path
    // 如果是去的这些页面则让他去登陆,并且去登陆的时候要去页面的参数
    if(target.indexOf('/pay') !== -1  || target.indexOf('/trade') !== -1 || target.indexOf('/center') !== -1 ){
      // 不直接去登陆页,将之前要去的地方带过去
      next('/login?redirect=' + target)
    }else {
      // 如果去的不是这些页面就放行
      next() 
    }
  }
})
export default router
```

Header组件中登陆的部分:先查看是否携带了redirect参数如果带了就跳转到该位置,如果没有才跳转到Home组件
```js
methods: {
  async login() {
    const { phone, password } = this.userInfo    
    if (phone && password) {
      try {
        await this.$store.dispatch("login", this.userInfo);
        this.$message.success("登陆成功"); 
        // 登陆成功之后不单纯的跳转到home,而是看看有没有redirect,而不是直接跳转到首页
        const targetPath = this.$route.query.redirect || '/'
        this.$router.push(targetPath)        
      } catch (error) {
        this.$message.error("登陆失败");
      }
    }
  },
},
```

### 只有没有登陆才能去登陆页面

使用路由独享守卫在路由配置中,配置方法`beforeEnter()`
注意:让后在浏览器中直接键入/login路径,则不会跳转,但是无法证明是该条守卫生效,因为在全局前置守卫中进行了配置,如果已经登陆了还去登陆页面,就去首页,也就是说这里的显示和全局前置路由守卫的限制冲突了,可以将全局前置路由守卫的next('/')该为next()放行,来测试路由独享守卫是否拦截
```js
{
  path:'/login',
  component:Login,
  meta:{isHidden:true},
  meta:{title:'登陆'},
  beforeEnter: (to, from, next) => {
    // 引入store获取token
    const token = store.state.user.token
    // 如果已经登陆了还来登陆,就去首页,否则让你去
    if(token) {
      next('/')
    }else {
      next()
    }
  }
},  
```

### 对点击添加购物车跳转到添加购物车成功页面进行显示

点击添加购物车会携带skuNum和skuInfo(该数据被存储到了localStorage中,因为是一个对象数据,通过路由传参携带不方便)
现在要求是只有携带了skuNum并且在localStroage中有skuInfo才能去添加购物车页面

如果跳转的是一个单独的页面(单独对某个页面进行监测)需要使用独享守卫和组件内守卫

独享守卫需要在路由的配置信息中进行配置,现在是要跳转到购物车成功页面,在该路由配置中进行配置

路由独享守卫的路由配置:
```js
{
  path:'/addcartsuccess',
  component:AddCartSuccess,
  meta:{title:'添加购物车成功'},
  // 去成功页面必须携带skuNum和本存储的本地信息才能去, 注意这里要用to,因为是跳转到该页面携带的参数
  beforeEnter:(to,from,next)=>{
    const skuNum = to.query.skuNum
    const skuInfo = sessionStorage.getItem('SKUINFO_KEY')
    console.log(skuNum)
    if(skuNum && skuInfo) {
      next()
    }else {
      next(false)
    }
  } 
},
```

### 只有从购物车页面才能跳转到交易页面

**使用路由独享守卫完成**

在Trade组件的路由配置中进行配置
```js
{
  path:'/trade',
  component:Trade,
  meta:{title:'订单页面'},
  // 只有从购物车页面才能跳转到订单页面,全局限制的是不登陆不能去,这里必须是从购物车页面才能去
  // 该功能也可以使用组件内守卫来完整
  beforeEnter:(to,from,next)=>{
    if(from.path === '/shopcart') {
      next()
    }else {
      next(false)
    }
  }
},
```

**使用组件内守卫完成**

```js
// 因为是对Trade进行限制,所以在Trade中配置前置组件内守卫
beforeRouteEnter(to,from,next) {
  if(from.path === '/shopcart') {
    next()
  }else {
    next(false)
  }
},
```

如果要在组件内守卫中使用this

组件内守卫可以理解为钩子函数的一种类型,在Trade组件中添加如下代码,如果需要使用this,那么就要使用`next()`方法,该方法参数为一个回调函数,回调函数的参数vm就代表this
注意:**在路由组件中,使用了next()函数之后,里面的路由拦截失效了,所以最好不用,要用就用路由独享守卫**
```js
/* 
  组件内守卫,它的执行时机是在created之前,也就是说组件还没创建呢,因为如果这个守卫内部需要使用this不能直接使用,
  如果需要使用this,就在里面使用一个next方法,该方法的参数是一个回调函数,没参数为vm,代表this
*/
beforeRouteEnter(to,from,next){
  next(vm=>{
    alert(vm.message) // 使用this,会报错,所以使用vm就可以
    if(from.path !== '/shopcart'){
    next(false)
    }else {
      next()
    }
  })
},
```

### 只有从trade页面才能跳转到pay页面

```js
{
  path:'/pay',
  component:Pay,
  meta:{title:'支付页面'},
  // 只有从trade页面才能跳转到支付页面
  beforeEnter(to,from,next) {
    if(from.path === '/trade') {
      next()
    }else {
      next(false)
    }
  }
},
```

### 其他

实现的原理都一样,可以使用组件内守卫完成,也可以路由独享守卫来完成

只有从交易页面(创建订单)才能跳转到支付页面(在支付页面中添加组件内守卫)
在Pay组件中添加如下代码:**主要就是看你从哪儿来的**
```js
beforeRouteEnter(to,from,next){
  if(from.path === '/trade'){
    next()
  }else {
    next(false)
  }
},
```

只有从支付页面才能跳转到支付成功页面(在成功页面内添加组件内守卫)
在PaySuccess组件中添加如下代码:
```js
export default {
  name: 'PaySuccess',
  beforeRouteEnter(to,from,next){
    if(from.path === '/pay'){
      next()
    }else {
      alert('不能直接访问')
      next(false)
    }
  }
}
```



## 完善其他问题

### 图片懒加载

动态数据还没有请求回来的时候,图片资源指定默认显示,实现步骤:
1. 安装vue-lazyload插件(是官方插件):`npm i vue-lazyload`
2. main.js中引入该包
3. main.js中引入需要展示的loading图片
4. main.js中使用:`Vue.use(安装的包,{图片})`
5. 将展示图片的位置,img标签的src属性更改为`v-lazy`

main.js中使用图片懒惰加载的代码:
```js
// 图片懒加载
import VueLazyLoad from 'vue-lazyload'
import loading from '@/assets/images/loading.gif'
Vue.use(VueLazyLoad,{loading})
```

在需要使用图片懒加载的位置将img标签的src属性替换为`v-lazy`
```html
<router-link :to="`/detail/${goods.id}`">
  <img v-lazy="goods.defaultImg"/>
</router-link>
```

### 路由懒加载

`import Home from '@/pages/Home'`这种打包方式是同步执行,将所有的路由组件都一次性打包在一个大的文件当中,这样打包之后,打包的文件体积比较大,当浏览器在访问这个文件加载的时候,效率不高,所以我们想办法将所有的路由组件,分别打包成一个小的文件
浏览器在访问那个组件的时候,再去加载那个文件,而不是一次性都加载

`import`函数可以让文件单独打包,并且动态加载
```js
/* 
1. import('模块路径'): webpack会对被引入的模块单独打包
2. 路由函数只在第一次请求时才执行, 也就是第一次请求访问对应路由路径时才会请求后台加载对应的js打包文件
*/
const Home = () => import('@/pages/Home')
{
  path: '/home',
  name: 'home',
  // 这里可以是一个函数,页可以是引入的组件
  component: Home
},
```

`import`函数在路由信息配置中的简写方式
```js
{
  path: '/home',
  name: 'home',
  component: () => import('@/pages/Home')
},
```

注意:***可以在浏览器控制台的netword选项中勾选js,查看打包的情况***

### 登陆和注册的校验(vee-validate的基本使用)

vee-validate专门用来做表单验证的Vue插件,现在版本已经是4了,但是老师用的是2,我还是先用2比较好
1. 安装vee-validate的包:`npm i vee-validate@2`
2. 创建src/utils/veeValidate.js文件,该文件使用vee-validate插件,并且定义规则
3. 在main.js中引入该文件执行一次,让该文件生效:`import '@/utils/veeValidate'`
4. 在需要验证的表单添加验证规则


**具体实现步骤1**

在veeValidate文件中引入插件就可以使用了
```js
import Vue from 'vue'
import VeeValidate from "vee-validate"
// 使用基本的vee-validate,现在其实就可以使用了
Vue.use(VeeValidate)
```

在Register组件中对表单的收集字段添加验证规则
1. 在原有的基础上添加name属性,必须指定name属性指定验证字段的名称
2. 使用v-validate指定验证规则:`v-validate="{ required: true, regex: /^1\d{10}$/ }"`
3. 如果有错误返回true,则该class生效:`:class="{invalid:errors.has('phone')}"`
4. 错误提示使用errors中的方法来进行显示,而不是之前的固定提示`{{errors.first('phone')}}`
```html
<div class="content">
  <label>手机号:</label>
  <input
    type="text"
    placeholder="请输入你的手机号"
    v-model="userInfo.phone"
    name="phone"
    v-validate="{ required: true, regex: /^1\d{10}$/ }"
    :class="{invalid:errors.has('phone')}"
  />
  <span class="error-msg">{{errors.first('phone')}}</span>
</div>
```

**具体实现步骤2**

现在出现一个问题就是,错误的提示是中文的,所以要本地化中文提示

更改之后的src/utils/veeValidate.js文件如下:
```js
import Vue from 'vue'
import VeeValidate from "vee-validate"
// 实现中文提示,引入中文message
import zh_CN from 'vee-validate/dist/locale/zh_CN'
Vue.use(VeeValidate)

// 错误信息提示本地化
VeeValidate.Validator.localize('zh_CN', {
  messages: {
    ...zh_CN.messages,
    // 这里修改了内置规则的message,让密码和确认密码必须相同
    is: (field) => `${field}必须和密码相同`  
  },
  attributes: { // 给叫i眼的field属性名映射中文名称和name属性的名称对应
    phone:'手机号码',
    code:'验证码',
    password:'密码',
    repeatPassword:'确认密码',
    agree:'协议'
  }
})
// 插件没有勾选必须统一勾选按钮的规则,这里是自定义规则
VeeValidate.Validator.extend('agree',{
  validate: value=>{
    return value
  },
  getMessage: field => field + '必须同意'
})
```

对其他表单的验证:
注意:***在验证确认密码的时候,is后面填写的是收集的v-model中的数据内容,而不是name属性指定的***
```html
<div class="content">
  <label>验证码:</label>
  <input
    type="text"
    placeholder="请输入验证码"
    v-model="userInfo.code"
    name="code"
    v-validate="{ required: true, regex: /^\d{6}$/ }"
    :class="{ invalid: errors.has('code') }"
  />
  <button style="height: 40px" @click="getCode">点击获取验证码</button>
  <span class="error-msg">{{ errors.first("code") }}</span>
</div>
<div class="content">
  <label>登录密码:</label>
  <input
    type="text"
    placeholder="请输入你的登录密码"
    v-model="userInfo.password"
    name="password"
    v-validate="{ required: true, regex: /^[0-9 a-z A-Z]{6,20}$/ }"
    :class="{ invalid: errors.has('password') }"
  />
  <span class="error-msg">{{ errors.first("password") }}</span>
</div>
<!-- 确认密码使用了自定义的一个验证规则,注意这里收集的是v-model中的内容,is后面是v-mode里面的密码,而不是name -->
<div class="content">
  <label>确认密码:</label>
  <input
    type="text"
    placeholder="请输入确认密码"
    v-model="userInfo.repeatPassword"
    name="repeatPassword"
    v-validate="{ required: true, is: userInfo.password }"
    :class="{ invalid: errors.has('repeatPassword') }"
  />
  <span class="error-msg">{{ errors.first("repeatPassword") }}</span>
</div>
<!-- 协议这里的v-validate中的agress是规则定义的,而其他的agres是我定义的name属性 -->
<div class="controls">
  <input
    name="agree"
    type="checkbox"
    v-model="userInfo.agree"
    v-validate="{ agree:true }"
    :class="{ invalid: errors.has('agree') }"
  />
  <span>同意协议并注册《尚品汇用户协议》</span>
  <span class="error-msg">{{ errors.first("agree") }}</span>
</div>
```

**具体步骤3:整体校验**

在Register组件中,如果点击注册按钮,先对表单进行整体验证,防止用户没有输入内容直接点击确认按钮
```js
  // 注册
async register() {
  // 如果验证通过,就返回true,否则返回false
  const success = await this.$validator.validateAll()
  if(success){
    const { phone, code, password, repeatPassword } = this.userInfo;
    try {
      // 键值对相同,省略键名,该接口函数需要请求体参数
      await this.$store.dispatch("register", { phone, code, password });
      this.$message.success("注册成功");
      // 注册成功跳转到登陆页
      this.$router.push("/login");
    } catch (error) {
      this.$message.error("注册失败");
    }
  }  
},
```

## 上线问题

### 打包

直接执行命令:`npm run build`
生成的dist目录就是网站的根目录,网站上线只需要该目录

在dist/js目录中,有map文件,当代码压缩后代码都经过了压缩加密,运行的时候报错,就不知道是哪里报错了,map文件可以将压缩文件和未压缩文件进行映射
上线的话map文件文件是不需要的(不需要提示,并且map文件体积大),可以手动删除,也可以进行配置,让其在打包的时候不生成map文件

在vue.config.js配置文件中进行配置
```js
module.exports = {
  productionSourceMap:false, // 打包禁止生成map文件
  lintOnSave: false, // 禁用eslint语法检查
  devServer: {
    proxy: {
      '/api': {
        target: 'http://39.98.123.211',
        // pathRewrite: { '^/api': '' },
      },
    },
  },
}
```

### 云服务器

使用阿里云从最新活动中购买,买最便宜的

设置服务器密码:控制台->云服务器->ecs->实例与镜像->实例->更多->密码与密钥

开放端口号:***这个好理解,比如mysql要用到3306端口,还有redis的6379以及80端口,否则无法被访问***
控制台->云服务器->ecs->网络与安全->安全组->配置规则->入口方向->快速添加(能够添加已经给你准备好的端口号)如果没有准备好就需要手动添加

**上传步骤**
使用xshell链接云服务器,因为链接的时候用到了22端口号,所以别忘记开放
1. 进入家目录创建目录lx
2. 在lx目录中创建www目录
3. 在www目录中创建shop-client目录(mkdir创建目录命令)

使用xftp上传打包生成的dist目录

安装nginx服务配置nginx实现web服务器和代理转发
1. nginx帮助我们做代理的web服务器,怎么访问ip就能中找到dis文件访问
2. nginx帮助我们去做代理转发,因为生产环境没有dev-server

正向代理和反向代理的区别:
3. 正向代理:帮助客户端实现,用户很明确知道数据来源(数据目的地网站)
4. 反向代理:帮助服务器实现功能,用户根本不知道数据来源(我们之前配置的代理也是反向代理)

nginx的使用:
1. 在centos中安装nginx:`yum install nginx`
2. 卸载使用`yum remove nginx`
3. 在etc目录下有一个nginx目录,该目录本来就有,如果没有安装该目录只有少数文件,在改目录下执行安装安装命令
4. 安装之后多出了nginx.config文件,需要在该文件中进行配置
5. 配置之后需要启动或者重启nginx
   - service nginx start
   - service nginx restart
   - service nginx stop

主要配置的内容:server中
```js
// 就是之前创建的目录,指向拷贝的dist目录
root  /root/lx/www/shop-client/dist;
// 访问服务器地址就能找到index
location / {
  root /root/lx/www/shop-client/dist;
  index index.html;
  try_files $uri $uri/ /index.html;
}
// 配置反向代理,数据从这个服务器获取,就跟在项目中配置代理一样的道理
location /api {
  proxy_pass http://39.98.123.211
}
```

## 组件通信高级

**代码准备**

直接使用提供的组件和路由配置就可以了配置到项目中

路由配置:
```js
{
  path: '/communication',
  component: () => import('@/pages/Communication/Communication'),
  children: [
    {
      path: 'event',
      component: () => import('@/pages/Communication/EventTest/EventTest'),
      meta: {
        isHideFooter: true
      },
    },
    {
      path: 'model',
      component: () => import('@/pages/Communication/ModelTest/ModelTest'),
      meta: {
        isHideFooter: true
      },
    },
    {
      path: 'sync',
      component: () => import('@/pages/Communication/SyncTest/SyncTest'),
      meta: {
        isHideFooter: true
      },
    },
    {
      path: 'attrs-listeners',
      component: () => import('@/pages/Communication/AttrsListenersTest/AttrsListenersTest'),
      meta: {
        isHideFooter: true
      },
    },
    {
      path: 'children-parent',
      component: () => import('@/pages/Communication/ChildrenParentTest/ChildrenParentTest'),
      meta: {
        isHideFooter: true
      },
    },
    {
      path: 'scope-slot',
      component: () => import('@/pages/Communication/ScopeSlotTest/ScopeSlotTest'),
      meta: {
        isHideFooter: true
      },
    }
  ],
},
```

### props

props子组件声明接收属性的三种写法:
1. 数组写法:`props:['todo']`
2. 对象写法,只能限定接收属性的具体类型:`props:{todo:Array}`
3. 具体的对象写法,可以详细的限制接收属性的类型`propt:{todos:{type:Array,default:[],reqired:true}}`

用于父子之间传递函数和非函数数据
1. 非函数:就是父组件给子组件数据
2. 传递函数:那么就是父组件中定义函数,那么子组件调用函数给父组传递数据(本质是子组件给父组件传递数据)

路由配置中的props:***可以将路由传参映射为组件的属性,在组件内部可以使用props进行接收***
1. 布尔值:为true,把路径params参数映射为要显示的组件内属性
2. 对象:只能映射额外的静态数据,随意你想定义什么数据都可以
3. 函数:参数为route,可以自己写逻辑,返回一个对象,对象里面可以包含query参数和params参数,称为要显示的组件内数据

如果不使用props映射,在在使用数据的时候需要使用以下语法:`this.$route.params.xxx`或者`this.$route.query.xxx`

### 全局事件总线

所有组件之前都可以使用全局事件总线进行通信,全局事件的本质是一个对象(将vm对象挂载在Vue的原型上)
1. 所以的组件都可以看到它
2. 可以使用`$emit`和`$on`方法

添加全局事件总线的步骤
1. 安装全局事件总线,一般在`beforeMount`中安装全局总线
2. 在接收数据的组件当中,获取总线给总线绑定自定义事件`this.$bus.$on()`,一般是在mounte中,第一个参数是事件名,第二个参数是一个回调函数,如果该回调函数直接写要使用箭头函数,如果该回调函数定义在methods中就直接调用
3. 在发送数据的组件当中,获取总线触发总线身上绑定的自定义事件`this.$bus.emit()`,第一个参数就是事件名,第二个参数就是参数咯

### Vuex

将数据存储在了state中之后,就可以从state中获取数据(获取数据方便),因为是一个包,会增大体积,所以使用场景看项目的大小,项目复杂使用Vuex,如果项目简单,可以不使用

几个核心的概念:
1. state:存储数据
2. mutations:存储数据
3. actions:异步任务派发请求
4. getters:简化数据的获取,接收state参数
5. modules:模块化开发,可以将state进行模块化分类,如果需要对其进行类似模块化的操作,需要使用命名空间


### 消息的订阅与发布(pubsub)

所有场合均能使用:类似全局事件总线,在Vue中因为有全局事件总线,所以一般不使用,在react中很重要

### 自定义事件

用于子组件向父组件传递数据

**自定义事件和原生事件的区别**

原生dom事件:
1. 事件类型:固定的几个事件类型,比如click,change
2. 回调函数:自己去定义的
3. 触发:浏览器自定调用
4. event事件对象:就是浏览器调用回调函数的时候,自动传递的参数

自定义事件:
1. 事件类型:无数个,自己随意定义事件
2. 回调函数:自己去定义的
3. 谁调用:自己去调用,通过`this.$emit()`
4. 默认传递的是什么:默认传递的是自己传递的参数,如果传递就有,没有传递就没有

**自定义事件的深入理解**

先来总结:
1. 自定义事件只能在组件标签上添加才有意义,在组件标签上添加的任何事件都是自定义事件
2. 区分自定义事件还是原生事件,主要就看这事件添加在什么元素身上,如果添加到组件身上则一定是自定义事件
3. 原生事件添加到组件标签变成自定事件
   - 使用`native`修饰符可以使其变为原生事件
   - 当成自定义事件使用就需要在子组件使用`$emit`激活
   - 变成自定义事件则第一个参数不在是事件对象

在组件标签和原生html标签身上添加原生的dom事件

父组件代码和事件回调:
```html
<!-- 在html标签上添加原生事件:就是原生事件咯,第一个参数默认就是事件对象,原生dom就这样,跟vue没有干系 -->
<button @click="test1($event)">我是一个按钮</button>
<!-- 在组件标签上添加原生事件:则该事件就是自定义事件,只不过该自定义事件和dom事件的名称相同,如果需要将该事件变为原生dom事件,需要使用修饰符.native -->
<!-- 并且这个事件使用事件委派的方式添加给了组件标签内部的根元素,点击根元素的内部任何元素都会触发该事件 -->
<Event1 @click.native="test2($event)"></Event1>
```
事件回调通过event输出目标元素的innerHtml
```js
test1(event){
  console.log(event.target.innerHTML)
},
test2(event){
  console.log(event.target.innerHTML)
}
```

子组件的html内容:事件被绑定到了根元素也就是div身上,所以点击任何子标签都会触发,innerHTML就会输出不同的内容
```html
<div style="background: #ccc; height: 80px;">
  <h2>Event1组件</h2>
  <span>其它内容</span>
</div>
```

在组件标签和原生html标签身上添加自定义事件

父组件的html和事件回调
```html
<!-- 给原生html元素添加自定义事件:没有意义,因为原生dom没有该事件 -->
<button @xxx="test3($event)">我是一个按钮</button>
<!-- 下面的代码绑定了两个自定义事件 -->
<!-- 给组件标签添加自定义事件: 默认的第一个参数就不在是事件对象了,而是子组件传递过来的参数-->
<!-- 给组件标签添加的原生事件:也编程了自定义事件,第一个参数不在是evnet事件对象,而是子组件在激活的时候传递的参数 -->
<Event2 @xxx="test4($event)" @click="test5($event)"></Event2>
```

回调函数:自定义事件的第一个参数不在是event事件对象,所以不能用innerHTML进行测试
```js
test3(event){
  console.log(event.target.innerHTML)
},
// 自定义事件,第一个参数不在是事件对象,而是传递过来的参数
test4(event){
  console.log(event)
},
test5(event){
  console.log(event)
}
```

子组件的html结构:分别激活了一个自定义事件和一个和原生dom事件同名的自定义事件
```html
<!-- 激活自定义事件,只不过该自定事件和原生dom事件同名 -->
<button @click="$emit('click',200)">分发自定义click事件</button><br>
<!-- 激活自定事件 -->
<button @click="$emit('xxx',10)">分发自定义xxx事件</button><br>
```

### v-model的深入了解

总结:***`v-model`使用在组件标签上,是props组件通信,同时能够实现父子组件之前的数据同步(你改我也改)***

别忘了:***`v-model`除了用在组件标签上,就是用在表单类元素上***

**v-model的原理**

单项数据绑定和input事件
1. 单项数据绑定读取data中的数据
2. input事件将改变后的数据赋值给data中的数据

```html
<!-- v-model的原理: 单项数据绑定读取到data中的数据,input事件里将输入框的数据重新赋值给message,事件名必须是input-->
<input type="text" :value="message" @input="message = $event.target.value">
<span>{{message}}</span>
```

**在组件标签上使用v-model的原理**

父组件代码
```html
<!-- 1. 在组件标签上使用单项数据绑定,就是props组件通信,那么在CustomInput组件内部可以使用props接收这个数据,接收的属性就是value -->
<!-- 2. 使用事件,这个事件用在组件标签上就是自定义事件,$event就是传递过来的参数,重新赋值给data中的message,也就是子组件数据改变影响了父组件 -->
<CustomInput :value="message" @input="message = $event"></CustomInput>
```

子组件代码:这里的`:value="value"`使用单项数据绑定从props接收的数据,因为父组件中必须是input事件,所以这里必须触发input事件
```html
<!-- 这里的input事件是dom原生事件,第一个参数默认就是event,所以将输入的数据传递给父组件 -->
<!-- 这样就能够实现组件之间共享数据,父组件中改变数据,子组件也会改变,子组件中改变数据,父组件也会改变 -->
<input type="text" :value="value" @input="$emit('input',$event.target.value)">
```

**直接使用v-model**

父组件中直接使用`v-model`,那么就省去了在父组件中使用`@input`事件,子组件中代码不变,依旧是使用`emit()`激活并且传递子组件中的数据
并且因为v-mode收集的是value属性,所以在子组件中要用value去接收
```js
<CustomInput v-model="message"></CustomInput>
```

**element-ui中的input就使用了这种原理**

1. 将组件中的数据传递给`el-input`标签,在内部进行了展示,当父组件中数据发生改变,组件中的内容发生改变
2. 而直接删除数据框的数据,因为在内部`@input="$emit('input',$event.target.value)"`使用了这种代码,所以父组件中的数据也会更改

```js
<el-input v-model="message"></el-input>
```

### sync(原理根v-model是一样的)

两者作用在组件标签上,都可以实现父组组件之间的数据同步
1. aync达到数据同步,组件内部(子组件)一定不是表单元素(因为使用的不是input事件,所以没有办法做到输入框改变父组件同步)
2. v-model达到数据同步,组件内(子组件)部一般是表单元素,因为input事件可以激活自定义的input事件


父组件中的代码部分:在data中定义了money数据
```html
<h2>不使用sync修改符</h2>
<!-- sync原理:将money数据传递给子组件,这里的事件名称一定要是这个格式,接收子组件传递过来的参数,赋值给data中的money -->
<Child :money="money" @update:money="money = $event"></Child>
<h2>使用sync修改符</h2>
<!-- 这里直接使用.sync修饰符,然后能够实现同样的效果 -->
<Child :money.sync="money"></Child>
<h2>使用v-model修改符</h2>
<Child2 v-model="money"></Child2>
```

子组件Child的代码:使用的是sync,所以在这里props接收的是传递来的属性
```html
<div style="background: #ccc; height: 50px;">
  <span>小明每次花100元</span>
  <!-- 子组件接收到参数之后,触发update:money事件 -->
  <button @click="$emit('update:money',money- 100)">花钱</button>
  爸爸还剩 {{money}} 元
</div>
```

子组件Child2代码:使用的`v-model`,在接收数据的时候使用props
```html
<div style="background: #ccc; height: 50px;">
  <span>小明每次花100元</span>
  <!-- 使用v-model实现,激活的是input事件 -->
  <button @click="$emit('input',value-100)">花钱</button>
  爸爸还剩 {{value}} 元
</div>
```

### $attrs和$listeners

**原理**

本质就是父组件中给子组件传递的属性组成的对象及定义事件方法组成的对象
1. $attrs收集父组件传递给子组件所有属性组成的对象(并不会收集class和style),如果在子组件中使用props接收了某个属性,则该属性不会被收集到$attrs中
2. $listeners收集父组件传递给子组件所有的自定义事件组成的对象
3. 可以通过`v-on`一次性将父组件收集到的事件监听添加给子组件
4. 可以通过`v-bind`一次性将父组件收集到的属性添加给子组件

父组件传递数据:
```html
<hint-button xxx="123" :yyy="message" @click="test"></hint-button>
```

子组件使用$attrs和$listeners接收
```js
export default {
  name:'HintButton',
  props:['xxx'],
  mounted(){
    // 如果使用props接收了xxx,则$attrs中就不包含xxx了
    console.log(this.$attrs)
    console.log(this.$listeners)
  }
}
```

**使用场景,主要是二次封装组件**

element-ui中的按钮是有title属性的,现在假设element-ui提供的button按钮是没有title属性的,我们自己封装一个带有title属性的按钮

封装的组件:
```html
<template>
  <div>
    <a href="javascript:;" :title="title">
      <el-button v-on="$listeners" v-bind="$attrs"></el-button>
    </a>
  </div>
</template>

<script>
export default {
  name:'HintButton',
  props:['title'],
}
</script>
```

在父组件中使用该组件:
```html
<div>
  <h2>自定义带Hover提示的按钮</h2>
  <HintButton type="danger" size="mini" icon="el-icon-delete" title="delete" @click="test"></HintButton>
</div>
```

### $refs.$children和$refs.$parent

关于$refs的三个新的api
1. `$refs.组件名.属性`可以直接操作子组件的数据(子组件需要添加ref属性)
1. `$refs.$children`可以在父组件中直接操作子组件的数据(跟子组件是否添加ref属性无关)
   - 注意:***这个方式虽然可以获取到子组件对象组成的数组,但是谁在前谁在后不一定,也就是通过索引获取会出现问题,所以官方建议不要使用$children和$parent***
2. `$refs.$parent`可以在子组件中直接操作父组件的数据
   - 注意:***这个方式虽然可以获取到父组件,但是如果该组件是一个共用的组件,被多个组件使用,那么就有多个父组件,就会出现问题***

**父组件操作子组件的数据**

父组件操作子组件的数据html部分:
```html
<div>
  <h2>BABA有存款: {{money}}</h2>
  <button @click="borrowMoneyFromXm(100)">找小明借钱100</button><br>
  <button @click="borrowMoneyFromXh(50)">找小红借钱150</button><br>
  <button @click="borrowMoneyAll(200)">找所有孩子借钱200</button><br>
  
  <br>
  <Son ref="son" />

  <br>
  <Daughter ref="daughter" />
</div>
```

操作子组件部分的逻辑代码:主要是methods部分,通过$refs操作子组件的数据
```js
import Son from './Son'
import Daughter from './Daughter'

export default {
  name: 'ChildrenParentTest',
  data () {
    return {
      money: 1000
    }
  },

  methods: {
    // 找小明借钱,自己的加100,小明的减100
    borrowMoneyFromXm(money){
      this.money += money
      // 给小明的子组件添加一个ref,通过ref直接操作其中的数据,子组件中也有一个money数据
      this.$refs.son.money -= money   
    },
    // 找小红借钱,自己的加50,小红的减少50,跟上一个管小明借钱一样的原理,同样是ref操作,给子组件添加ref
    borrowMoneyFromXh(money){
      this.money += money
      this.$refs.daughter.money -= money
    },
    // 找所有的孩子借钱,每个孩子减少200,自己增加200的双倍
    borrowMoneyAll(money){
      this.money += money * 2
      // 直接通过$children能够获取到该组件所有的子组件组成的数组,该方法跟子组件是否添加ref无关
      this.$children.forEach(item=>item.money -= 200)
    }
  },

  components: {
    Son,
    Daughter
  }
}
```

**子组件操作父组件的数据**

这里的案例是有两个,分别是女儿操作父组件的数据,和儿子操作父组件的数据,原理相同,代码一样

子组件操作父组件的html结构:
```html
<div style="background: #ccc; height: 50px;">
  <h3>女儿小红: 有存款: {{money}}</h3>
  <button @click="giveMoney(100)">给BABA钱: 100</button>
</div>
```

子组件中操作父组件数据的逻辑:主要是通过`$refs.$parent`来操作父组件中的数据
```js
export default {
  name: 'Daughter',
  data () {
    return {
      money: 20000
    }
  },
  methods: {
    // 给父组件铅,自己的减少而,父组件的增加
    giveMoney(money){
      this.money -= money
      // 如果该组件是一个共用组件,则获取到父组件就是多个,所以不推荐使用
      this.$parent.money += money
    }
  }
}
```

### 混合(混入)

几种封装的情况:
1. html和js以及css相同,封装组件
2. 单个组件的js代码重复,封装函数
3. 不同组件的js代码重复,封装混合(比如多个组件methods里面的很多函数都是重复的,就可以定义单独的模块去把这些相同的代码定义到外部)

使用混入的步骤:
1. 定义混入(暴露出一个对象,在Vue的配置项中能写什么该对象中就能写什么)
2. 引入暴露的混入对象
3. 使用`mixins`注册引入的混入对象


比如在上一个案例中,女儿和儿子主动借钱给爸爸的方法都是一样的,可以将该部分提取出来定义一个混入
```js
methods: {
  // 给父组件铅,自己的减少而,父组件的增加
  giveMoney(money){
    this.money -= money
    // 如果该组件是一个共用组件,则获取到父组件就是多个,所以不推荐使用
    this.$parent.money += money
  }
}
```

创建myMixin.js文件,在该文件中定义混入
```js
// 定义混入
export default {
  mounted() {
    console.log('mixin')
  },
  methods: {
    giveMoney(money){
      this.money -= money
      this.$parent.money += money
    }
  }
}
```

在儿子组件中使用混入:引入混入文件,使用`mixins`注册混入,就跟注册组件的方式一样
1. 原版的mounted不受影响
2. methods中的方法会合并到methods中,也不对原有的有影响
```js
import myMixin from './myMixin'
export default {
  name: 'Son',
  mixins: [myMixin],
  data () {
    return {
      money: 30000
    }
  },
  // 混入的mounted先执行,不影响原来的
  mounted(){
    console.log('son')
  },
  methods: {
    // 混入的会合并到methods里面,不影响原来的
    show(){
      console.log('show')
    }
  }
}
```

### 插槽

**默认插槽和具名插槽**

1. 使用`<slot></slot>`标签在子组件中指定插槽,相当于一个占位符,里面可以有默认的结构
2. 在父组件中使用子组件的时候,通过标签体的`<template></template>`替换`<slot></slot>`标签
3. 具名查早就是在`<slot name="container"></slot>`中指定名字,在使用的时候`<template solt="container"></template>`表示该结构只替换指定的插槽
4. 一个组件当中的插槽可有有很多个,默认插槽一般只有一个,其余的都是具名插槽

子组件中定义插槽:如果有默认显示的内容,就在`<slot></slot>`中指定默认的内容,如果没有就空着等待父组件替换
```html
<div>
  <!-- 在子组件中标题是固定的,但是其他内容是不固定的 -->
  <h2>标题是固定的</h2>
  <!-- 不固定的内容,使用slot占位,父组件传递数据将slot进行替换 -->
  <slot><div>我是默认的插槽内容</div></slot>
  <!-- 有两个占位符,那么所有的内容也会插在这里一份 -->
  <slot></slot>
  <!-- 具名插槽,在使用的时候指定名字,也可以有默认值 -->
  <slot name="container">我是具名插槽的默认值</slot>
</div>
```

在父组件中使用插槽:
```html
<Child>
  <template>
    <a href="javascript:;">超链接标签</a>
  </template>
</Child>
<Child>
  <template>
    <button>我是一个按钮</button>
  </template>
</Child>
<Child>
  <!-- 具名插槽,专门往具名插槽里面插入,不会插入其他的插槽 -->
  <template slot="container">
    <p>段落标签</p>
  </template>
</Child>
```

**作用域插槽**

作用域插槽完成的事情:
1. 数据是在父组件当中的
2. 数据通过父组件传递给子组件,在子组件中通过`v-for`进行遍历
3. 子组件在展示数据的过程中,并不展示数据,会重新将`v-for`的每一项传递给父组件,父组件替换插槽的占位结构(***数据的结构是由父组件决定的***)


注意事项:
1. 子组件在插槽上使用标签属性,不是props组件通信,而是作用域插槽通信
2. 子组件回传给父组件什么数据,父组件才会接收到什么数据,接收到的格式是一个对象,包含回传的数据
3. 子组件通过`v-for`来遍历的,每遍历一次就会将数据回传一次,父组件就替换一次子组件中的`<slot><slot>`标签

子组件中中的结构,主要遍历父组件传递的数据,和指定作用域插槽
```html
<template>
  <ul>
    <!-- 父组件传递给子组件的是一个整体的data数据 -->
    <li v-for="(todo, index) in data" :key="index">
      <!-- 作用域插槽,将遍历的每一项那个对象,在回传给父组件,这里的胡子语法就相当于默认显示的内容,但是最终显示成什么样,得看父组件如何处理 -->
      <!--  这里的:todo是作用域插槽通信,v-for每次遍历就通信一次,父组件中就替换一次slot,也就是在li标签中添加了父组件中template中的结构 -->
      <slot :todo="todo" :index="index">{{todo.text}}</slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: {
    data: Array
  }
}
</script>
```

父组件中的结构,主要是接收子组件回传的数据,决定子组件中数据展示的结构
```html
<template>
  <div>
    <h2>效果一: 显示TODO列表时, 已完成的TODO为绿色</h2>
    <!-- 将数据传递给子组件 -->
    <List :data="todos">
      <!-- 子组件通过作用域插槽通信传递过来的对象,被封装为一个对象,包含传递过来的对象和索引 -->
      <template slot-scope="scopeProps">
        <p :style="{color: scopeProps.todo.isComplete ? 'green' : 'blue'}">{{scopeProps.todo.text}}</p>
      </template>
    </List>
    <hr>

    <h2>效果二: 显示TODO列表时, 带序号, TODO的颜色为蓝绿搭配</h2>
    <List :data="todos">
      <!-- 子组件传递了什么数据才能接收到什么数据 -->
      <template slot-scope="{todo,index}">
        <p style="color:#fff" :style="{backgroundColor: todo.id % 2 === 0 ? 'blue' : 'green'}">{{index}} +++ {{todo.text}}</p>
      </template>
    </List>
  </div>
</template>
```

父组件的逻辑部分:主要是数据的定义,数据是在父组件中的
```js
<script type="text/ecmascript-6">
  import List from './List'
  import Child from './Child.vue'
  export default {
    name: 'ScopeSlotTest',
    data () {
      return {
        todos: [
          {id: 1, text: 'AAA', isComplete: false},
          {id: 2, text: 'BBB', isComplete: true},
          {id: 3, text: 'CCC', isComplete: false},
          {id: 4, text: 'DDD', isComplete: false},
        ]
      }
    },

    components: {
      List,Child
    }
  }
</script>
```