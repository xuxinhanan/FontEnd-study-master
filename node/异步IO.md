## 进程和线程有何关系和区别？

进程是资源分配的最小单位，而线程是程序执行的最小单位（资源调度的最小单位）。

## 单线程



Node的运行时环境基于V8引擎。V8引擎是Chrome浏览器中的JavaScript代码解析引擎，其最大的特点是单线程，因此Node也是单线程。

那么，**什么是单线程？简单来说就是一个进程中只有一个线程**，程序顺序执行，前面的程序执行完成后才会执行后面的程序。

Node的单线程指的是主线程是“单线程”。主线程按照代码顺序一步步执行程序代码，如果遇到同步代码阻塞，主线程被占用，则后续的程序代码执行就会被卡住。

因为单线程具有这些特性，所以Node程序不能有耗时很长的同步处理程序阻塞程序的后续执行，对于耗时过长的程序，应该采用异步执行的方式。



## 什么是I/O？

**Input / Output （输入 / 输出）简称 I / O**。在基本的计算机操作中，这是**数据最慢的一类操作**。

应用程序的输入信息来自于人的操作，例如鼠标点击。这类操作不太占 CPU 资源，但是需要考虑设备发出请求与请求完成之间的延迟时间。



## 阻塞式 I/O

在传统的阻塞式 I/O 编程中，与 I/O 请求相对应的函数调用操作，会阻塞执行该操作的线程，直到操作完成为止。例如下面这项从 socket 读取数据的操作，会令线程阻塞：

~~~js
// 阻塞线程，直到数据可以使用为止
data = socket.read();

// 数据可以使用了
console.log(data)
~~~

因此，采用阻塞式的 I/O 所实现的 Web 服务器没办法在同一条线程中处理多个连接请求。

为了解决这个问题，传统的做法是，每遇到一次请求，就开一条线程，这样就可以处理并发请求了。



![image-20220711222016533](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220711222016533.png)

但是这种方式的问题是，每次处理阻塞式请求，线程都会闲置下来，等待系统把相关连接所请求的数据准备好，才会去处理这些数据。

而线程所占的系统资源并不少，并且系统必须通过上下文切换（ context switch ）来管理这些线程。这就导致了内存和 CPU 资源的浪费。





## 非阻塞式的 I/O

除了阻塞式的 I/O，大多数操作系统还支持另外一种资源访问机制，也就是非阻塞式 I/O。

在这种模式下，系统调用总是立即返回，而不必等待相关数据读取或写入。在执行调用的那一刻，函数若是无法给出结果，则返回一个预先定义好的常量，以表示当前并没有数据可以返回。

处理这样的非阻塞 I/O时，最基本的一种模式是在循环结构中主动查询每份资源，看该资源目前能不能返回某个实际的数据。这种模式通常实现为 —— **轮询**：

~~~js
resource = [socketA, socketB, fileA];

// 开始轮询
while (!resources.isEmpty()) {
  for (resource of resources) {
    // 尝试读取
    data = resource.read();
    if (data === NO_DATA_AVAILABLE) { // 无法给出结果时，非阻塞 I/O 模式会返回一个预先定义好的常量
      continue; // 跳过
    }
    if (data === RESOURCE_CLOSED) { // 资源已关闭
      resources.remove(i); // 把它从列表中移除
    } else {  // 收到了数据
     	consumeData(data); // 处理该数据
    }
  }
}
~~~

这种技巧可以在同一条线程里处理许多分不同的资源。但效率不高，因为在绝大多数情况下， 它所迭代的资源，还没把数据准备好。



## I/O多路复用

除了低效的轮询方法外，目前大多数操作系统都提供了一种原生机制 —— **同步事件多路分离器**，它能把多个 I/O 操作合并到一起，然后在一个线程中处理，从而实现高效地处理并发式的非阻塞资源。

具体来说，这种模式会监听多个资源，当其中某个资源的读取操作或写入操作执行完毕时，会返回一个事件。

这样做的好处是，同步事件多路分离器总是同步的，它会一直卡在这里，直到有新事件需要处理为止（换句话说就是多路分离器这个函数返回了，那么我们就能确定有新事件可以处理了）。下面这段伪代码演示了这套流程：

~~~js
watchedList.add(socketA, FOR_READ); // 把资源添加到一个数据结构里
watchedList.add(fileB, FOR_READ);

/**
* 用上面那份数据结构来配置一个多路分离器，它会一直阻塞，等待数据准备好后，返回一个事件。
*/
while (events = demultiplexer.watch(watchedList)) { 
  // 事件循环
  for (event of events) {
    data = event.resource.read(); // 读取数据
    if (data === RESOURCE_CLOSED) {
      // 资源关闭则从监听名单中移除
      demultiplexer.unwatch(event.resource); 
    } else {
      consumeData(data); // 处理数据
    }
  }
}
~~~

如下图所示，现在只需一条线程就能处理许多项资源了。

![2](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220711230536793.png)





## 

