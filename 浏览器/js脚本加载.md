## 资源的加载、解析名词解释

+ **「加载」**：即加载服务器传过来的数据
+ **「解析」**：即渲染线程解析 HTML、CSS ，主线程解析执行JavaScript 



## 普通脚本

~~~html
<script src="foo.js"></script>
~~~



浏览器会做如下处理：

- **「 同步加载 」**，停止解析 HTML
- 请求 `foo.js`
- 解析执行 `foo.js` 中的脚本
- 继续解析 HTML



## 异步脚本

### defer

标注为 `defer` 的 JavaScript 脚本文件不会停止 HTML 文档解析，而是等到解析结束才执行

~~~js
<script src="foo.js" defer></script>
<script src="bar.js" defer></script>
~~~

- 不阻止解析 document，并行下载 `foo.js`、`bar.js`
- 即使下载完 `foo.js`  仍继续解析 document
- 按照页面中出现的顺序，在其他同步脚本执行后，`DOMContentLoaded` 事件[^1][^2]前执行 `foo.js` 

### async

- 标注为 `async` 的脚本，下载完马上执行，但是不能保证加载顺序。

~~~js
<script src="foo.js" async></script>
<script src="bar.js" async></script>
~~~

- 不阻止解析 document，并行下载 `foo.js` 和 `bar.js`

- 当脚本下载完成后立即执行

- 执行顺序不确定，执行阶段不确定，可能在 `DOMContentLoaded` 事件前或者后

  



## 加载事项

- `<link>`：加载外部 CSS 样式文件 。异步加载，继续解析 HTML。
- `<img src='url' />`：加载图片，异步加载，继续解析 HTML；但是需要等待 CSS 解析完才解码，所以 CSS 阻塞图片呈现。
- 平时我们把 `<link>` 标签放在`<body>`头部而 `<script>` 放 `<body>` 尾部，是因为 CSS 阻塞 JavaScript 的执行







## Doctype作用?严格模式与混杂模式如何区分？它们有何意义?

+ Doctype声明于文档最前面，告诉浏览器以何种方式来渲染页面，这里有两种模式，严格模式和混杂模式。
+ **严格模式** 的排版和JS 运作模式是 以该浏览器支持的最高标准运行。
+ **混杂模式**，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面。



在`IExplore`中，若`HTML文档`缺失`<!doctype html>`声明则会触发IE盒模型。

-------------------









[^1]: DOMContentLoaded 事件在 DOM 树构建完成后立即触发，而不用等待图片、JavaScript文件、CSS文件或其他资源加载完成。
[^2]: DOMContentLoaded 标识着程序从同步脚本执行转化为事件驱动阶段。

