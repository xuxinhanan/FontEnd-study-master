### 什么是DOM？

DOM 和 HTML 内容几乎是一样的，但是和 HTML 不同的是，DOM 是保存在内存中树状结构，可以通过 JavaScript 来查询或修改其内容。

Chrome 控制台中，输入“document”后回车，就能看到一个完整的 DOM 树结构，如下图所示：

![img](https://static001.geekbang.org/resource/image/47/73/47f57c3eee749dd838939bfe5dd64573.png?wh=1044*890)



+ 从页面的视角来看，DOM 是生成页面的基础数据结构
+ 从 JavaScript 脚本视角来看，DOM 提供给 JavaScript 脚本操作的接口，通过这套接口，JavaScript 可以对 DOM 结构进行访问，从而改变文档的结构、样式和内容