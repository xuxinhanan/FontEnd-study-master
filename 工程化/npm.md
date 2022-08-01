~~~cmd
# 初始化 Node 项目，生成 package.json 文件
npm init

# 安装本地依赖包
npm install

# 安装全局依赖包
npm install -g

# 更新本地依赖包
npm update

# 更新全局依赖包
npm update -g

# 卸载本地依赖包
npm uninstall

# 执行 scripts 配置的命令
npm run
~~~

## npm

NPM安装包是从国外服务器上下载的，受网络因素影响较大，可能会出现异常。因此，国内的淘宝团队同步NPM实现了NPM的国内源。我们可以在使用NPM安装包时配置淘宝的国内源。同时为了方便使用，淘宝团队不仅提供了上述镜像源，还开发了一个更易用的工具CNPM，不仅自动使用国内源，而且还支持gzip压缩。命令如下：

~~~cmd
npm install -g cnpm --registry=https://registry.npm.taobao.org
~~~



## yarn

除了NPM外，还可以使用一款叫作YARN的替代工具。YARN是Facebook等公司开发的用于替换NPM的包管理工具。那么YARN有哪些优势足以替代NPM呢？

+ 速度超快：YARN缓存了每个曾经下载过的包，所以再次使用这些包时无须重复下载。同时，利用并行下载使资源利用率最大化，因此安装速度更快。
+ 超级安全：在执行代码之前，YARN会通过算法校验每个安装包的完整性。
+ 超级可靠：使用详细、简洁的锁文件（yarn.lock）格式和明确的安装依赖包的算法，YARN能够保证在不同系统上无差异地工作。



![image-20220709222119989](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220709222119989.png)



## npx

npx是NPM自带的一个包执行器。npx要解决的主要问题是调用项目内部安装的模块。就像NPM极大地提升了安装和管理包依赖的体验，在NPM的基础之上，npx让NPM包中的命令行工具和其他可执行文件在使用上变得更加简单。如：

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



## npm scripts

npm scripts是指在package.json文件中使用scripts字段定义的脚本命令，例如：

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



npm scripts有pre和post两个钩子，如start脚本命令的钩子是prestart和poststart。当执行npm run start时，会自动按照下面的顺序执行：

~~~cmd
npm run prestart && npm run start && npm run poststart
~~~

因此，可以在这两个钩子中完成一些前置工作和后续工作，如：

~~~js
{
  'script': {
    'prestart': 'npm run build',
    'start': 'node ./bin/ww'
    'poststart': 'echo node server started'
  }
}
~~~

































