Babel 的作用：

+ **「语法转换」**，如将 ES6 转换成 ES5
+ **「补齐 API」**，通过 polyfill 的方式补齐目标环境缺少的语法如 async/await



创建 Babel 配置文件

在根目录下新建 babel.config.js 文件，它是 Babel 执行时默认在搜寻的 Babel 配置文件。

也可以将配置参数写在 package.json 文件里。

或者写在构建工具如webpack的 babel-loader 配置项里。

核心配置只有两项：plugin 和 presets 数组。

~~~js
// babel.config.js
module.exports = {
  "presets": ['@vue/cli-plugin-babel/preset'],
  "plugins": []
}
~~~



预设

preset 预设就是一组 plugins 插件的集合，即插件包。



