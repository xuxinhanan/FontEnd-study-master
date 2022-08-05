> promise实际上**并没有完全摆脱回调，它只是改变了传递回调的位置。**我们并不是把回调传递给foo()，而是从foo() 中得到一个 promise，然后把回调传给这个 promise。

## Promise 的核心

~~~js
executor = function(resolve, reject) {
  ...
}

p = new Promise(executor);
~~~

executor() 是用户定义的执行器函数。事实上在调用 executor() 之前就创建好一个新的 promise 对象的实例，并得到两个**「置值器」**[^1] resolve() 、reject() 函数。

executor() 函数并不通过退出时所返回的值来对 Promise 产生影响 —— 该值将被忽略。executor() 中的用户代码利用 置值器 来向 **promise 对象“所代理的那个数据 / 值” 置值**[^2]。

一个 promise 所代理的值 **“value”** 可能有两种置值情况（并且一旦置值完毕将**不可变更**，称为“终态”）：

+ 如果 promise 被 resolve，则 promise 的值为有效值 (value)
+ 如果 promise 被主动 reject 或 resolve 失败，则该值用于记录原因 (reason)

且无论是 value 还是 reason 都可以是 JavaScript 的任意数据类型。

---------------

此外，promise 还有一个记录置值情况的属性 **“status”** ：

+ **pending** ：未置值

+ **fulfilled**：置值完成（reslove 被调用时）

+ **rejected**： 

  + 置 reject 值完成（reject 被调用时）

  + 或置 resolve 值时发生异常



----------------

## Then

在当前 promise 的数据就绪时，JavaScript 就将根据就绪状态立即触发由 p.then() 方法所关联的 onFulfilled / onRejected 之一，并以该函数：

+ 退出时的返回值，或
+ 中止执行时的状态

作为「值」来调用 promise2 的置值器。

-----------------

Promise.prototype.then() 这个原型方法，主要完成两件事：

+ 创建新的 promise2 对象
+ 将 onFulfilled、onRejected 关联给 promise1 的 resolve 置值器，确保 promise1 的数据就绪时调用 onFulfilled、onRejected。



## Then 链（链式调用）中的置值逻辑

1. 无论 onFulfilled与 onRejected 返回的是什么值，都将作为**「成功值 (value) 」**调用 promise2 的 resolve 置值器为 promise2 置值。

2. 而在 Then 链中“产生” **「错误值 (reason) 」**的方法有两种：
   + then 的 onFulfilled 方法抛出异常
   + 通过 Promise.reject() 来显式地返回 reject 值



## Then 链中值的冒泡

存在这样一种特殊情况：promise2 没有任何一个 onFulfilled、onRejected 响应函数。

这种情况下：**如果没有有效的响应函数，仍将产生新的 promise2，并且它的 resolve 将以promise1[^3]的值为值。**

于是出现了“错误冒泡”的现象：

在任意长的 Then 链中，如果链的前端出现了 **“reject 值”**，无论经过多少级 .then（且因为只有 onFulfilled 响应而为被处理），最终该 reject 值都能持续向后传递并被 “链尾的 .catch()” 响应到。



-----------





























[^1]: 所有 promise 对象都是立即生成的，重要的是 —— 这些 promise 对象“所代理的那个数据”什么时候“就绪”，而这个数据就靠置值器来设置。
[^2]: 这个过程看起来像是“让用户代码回调 JavaScript 引擎”，即把控制权交给用户。
[^3]: Then 链中上一个 promise。

