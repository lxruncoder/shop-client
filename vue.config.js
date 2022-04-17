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
        target: 'http://39.98.123.211',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
