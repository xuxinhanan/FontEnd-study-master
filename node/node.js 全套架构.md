为了打造一整套 Node.js 平台，需要以下几个组件：

### 1.**Libuv**

每个操作系统都有自己的事件分离器接口，例如， Linux 是 epoll，macOS 是 kqueue，windows 是 IOCP。

此外，就算操作系统一样，同一种 I/O 操作也会因为资源的类型不同而产生差异。例如，在 UNIX 操作系统上面，常规文件系统之中的文件，不支持非阻塞的操作，因此，为了模拟非阻塞的行为，还需要在事件循环之外单独用一条线程来操作。

由于这些种种差异的存在，事件分离器需要构建在更高的层面上，把这种差异抽象掉。为此 Node.js 核心团队创建了 libuv 库来兼容所有主流操作系统。

此外，Libuv 还实现了 reactor 模式，因此它提供了一套 API，让开发者能够建立事件循环、管理事件队列、运行异步 I/O 操作等。

### 2.**一套绑定机制**

用来封装 Libuv 及其他底层功能，令其可以与 JavaScript 对接。

### 3.V8引擎

V8引擎是 Chrome 浏览器中的 JavaScript 代码解析引擎，其最大的特点是单线程，这也就是 Node.js 单线程的原因。



### 4.核心JavaScript API

一个核心的 JavaScript 库，用以实现高层的 Node.js API。



![image-20220712001734377](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220712001734377.png)





