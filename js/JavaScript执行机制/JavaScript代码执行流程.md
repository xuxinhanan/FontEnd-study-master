> 所谓的变量提升，是指在 JavaScript 代码执行过程中，JavaScript 引擎把变量的声明部分和函数的声明部分提升到代码开头的“行为”。



实际上变量和函数声明在代码里的位置是不会改变的，**而是在编译阶段被 JavaScript 引擎放入内存中。**

------------

## JavaScript 代码的执行流程



一段 JavaScript 代码在执行之前需要被 JavaScript 引擎编译，编译完成之后，才会进入执行阶段。大致流程参考下图：

![img](https://static001.geekbang.org/resource/image/64/1e/649c6e3b5509ffd40e13ce9c91b3d91e.png?wh=1142*203)



### 1. 编译阶段

把 JavaScript 的执行流程细化，如下图所示：

![img](https://static001.geekbang.org/resource/image/06/13/0655d18ec347a95dfbf843969a921a13.png?wh=1142*634)

从上图可以看出，输入一段代码，经过编译后，会生成两部分内容：**执行上下文（Execution context）和可执行代码。**

**:white_check_mark: 执行上下文是 JavaScript 执行一段代码时的运行环境，**比如调用一个函数，就会进入这个函数的执行上下文，确定该函数在执行期间用到的诸如 this、变量、对象以及函数等。



### 2. 执行阶段

JavaScript 引擎开始执行“可执行代码”，按照顺序一行一行地执行。

----------



## 代码中出现相同的变量或者函数怎么办？

现在你已经知道了，在执行一段 JavaScript 代码之前，会编译代码，并将代码中的函数和变量保存到执行上下文的变量环境中，那么如果代码中出现了重名的函数或者变量，JavaScript 引擎会如何处理？我们先看下面这样一段代码：

~~~js
function showName() {
    console.log('极客邦');
}
showName();
function showName() {
    console.log('极客时间');
}
showName(); 
~~~

我们来分析下其完整执行流程：

+ 首先是编译阶段。遇到了第一个 showName 函数，会将该函数体存放到变量环境中。接下来是第二个 showName 函数，继续存放至变量环境中，但是变量环境中已经存在一个 showName 函数了，此时，第二个 showName 函数会将第一个 showName 函数覆盖掉。这样变量环境中就只存在第二个 showName 函数了。
+ 接下来是执行阶段。先执行第一个 showName 函数，但由于是从变量环境中查找 showName 函数，而变量环境中只保存了第二个 showName 函数，所以最终调用的是第二个函数，打印的内容是“极客时间”。第二次执行 showName 函数也是走同样的流程，所以输出的结果也是“极客时间”。



综上所述，一段代码如果定义了两个相同名字的函数，那么最终生效的是最后一个函数。

