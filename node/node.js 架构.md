为了打造一整套 Node.js 平台，需要以下几个组件：

### 1.**Libuv**

同一种 I/O 操作会因为资源的类型不同而产生差异， libuv 库把这种差异抽象掉。

此外，Libuv 还实现了 reactor 模式，因此它提供了一套 API，让开发者能够建立事件循环、管理事件队列、运行异步 I/O 操作等。

### 2.**一套绑定机制**

用来封装 Libuv 及其他底层功能，令其可以与 JavaScript 对接。

### 3.V8引擎

V8引擎是**将JS代码解析成机器码交给计算机运行**。

### 4.核心JavaScript API

一个核心的 JavaScript 库，用以实现高层的 Node.js API。



![image-20220712001734377](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220712001734377.png)





