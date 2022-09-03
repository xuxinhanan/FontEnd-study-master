### SyncHook 钩子

`SyncHook` 触发后会按照注册的顺序逐个调用回调，且不关心这些回调的返回值，逻辑上大致如：

~~~js
function syncCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i]();
  }
}
~~~

例如：

```js
const { SyncHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncHook(),
    };
  }
  sleep() {
    //   触发回调
    this.hooks.sleep.call();
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", () => {
  console.log("callback A");
});
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});
person.hooks.sleep.tap("test", () => {
  console.log("callback C");
});

person.sleep();
// 输出结果：
// callback A
// callback B
// callback C
```

示例中，`Somebody` 初始化时声明了一个 `sleep` 钩子，并在后续调用 `sleep.tap` 函数连续注册三次回调，在调用 `person.sleep()` 语句触发 `sleep.call` 之后，tapable 会按照注册的先后按序执行三个回调。

![图片](https://mmbiz.qpic.cn/mmbiz_png/3xDuJ3eiciblnwic7drYFibCvDOqetnkT2y03RR2xoVRQ6uqvPaKlywLustbNQa1jzTVhPQ7Zcyb2SVjgQOZbyfARQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)





#### 异步风格

上述示例中，触发回调时用到了钩子的 `call` 函数，我们也可以选择异步风格的 `callAsync` ，选用 `call` 或 `callAsync` 并不会影响回调的执行逻辑：**按注册顺序依次执行 + 忽略回调执行结果**，两者唯一的区别是 `callAsync` 需要传入 `callback` 函数，用于处理回调队列可能抛出的异常：

```js
// call 风格
try {
  this.hooks.sleep.call();
} catch (e) {
    // 错误处理逻辑
}
// callAsync 风格
this.hooks.sleep.callAsync((err) => {
  if (err) {
    // 错误处理逻辑
  }
});
```

由于调用方式不会影响钩子本身的规则，所以对钩子的使用者来说无需关注提供者到底用的是 `call` 还是 `callAsync`，上面的例子只需要做简单的修改就可以适配 `callAsync` 场景：

```js
const { SyncHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncHook(),
    };
  }
  sleep() {
    //   触发回调
    this.hooks.sleep.callAsync((err) => {
      if (err) {
        console.log(`interrupt with "${err.message}"`);
      }
    });
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", (cb) => {
  console.log("callback A");
  throw new Error("我就是要报错");
});
// 第一个回调出错后，后续回调不会执行
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});

person.sleep();

// 输出结果：
// callback A
// interrupt with "我就是要报错"
```

###  