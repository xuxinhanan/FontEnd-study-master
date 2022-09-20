![image-20220709222119989](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220709222119989.png)





---------

npm 的依赖分为正常依赖和开发时依赖。

如 nodemon 即为开发时依赖，作用是热更新。

----------



## npm scripts

npm scripts是指在package.json文件中使用 scripts 字段定义的脚本命令，例如：

~~~json
{
  'scripts': {
    'start': 'node ./bin/ww'
  }
}
~~~

此时可以直接执行以下命令：

~~~js
npm run start
~~~



## npx

> **npx是NPM自带的一个包执行器。npx要解决的主要问题是调用项目内部安装的模块。**



就像NPM极大地提升了安装和管理包依赖的体验，在NPM的基础之上，npx让NPM包中的命令行工具和其他可执行文件在使用上变得更加简单。如：

本地安装 Mocha 依赖包：

~~~js
npm install mocha
~~~

使用如下方式执行 Mocha 命令：

~~~cmd
./node_modules/.bin/mocha --version
7.0.1
~~~

此时可以使用npx代替上述方式：

~~~cmd
npx mocha --version
7.0.1
~~~





## yarn

除了NPM外，还可以使用一款叫作YARN的替代工具。YARN是Facebook等公司开发的用于替换NPM的包管理工具。那么YARN有哪些优势足以替代NPM呢？

+ 速度超快：YARN缓存了每个曾经下载过的包，所以再次使用这些包时无须重复下载。同时，利用并行下载使资源利用率最大化，因此安装速度更快。
+ 超级安全：在执行代码之前，YARN会通过算法校验每个安装包的完整性。
+ 超级可靠：使用详细、简洁的锁文件（yarn.lock）格式和明确的安装依赖包的算法，YARN能够保证在不同系统上无差异地工作。

















