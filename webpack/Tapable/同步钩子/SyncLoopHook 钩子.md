#### 基本逻辑

`loop` 型钩子的特点是**循环执行直到所有回调都返回 `undefined` ，不过这里循环的维度是单个回调函数，**例如有回调队列 `[fn1, fn2, fn3]` ，`loop` 钩子先执行 `fn1` ，如果此时 `fn1` 返回了非 `undefined` 值，则继续执行 `fn1` 直到返回 `undefined` 后才向前推进执行 `fn2` 。伪代码：

```js
function loopCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i in callbacks) {
    const cb = callbacks[i];
    // 重复执行
    while (cb() !== undefined) {}
  }
}
```

#### 示例

由于 `loop` 钩子循环执行的特性，使用时务必十分注意，避免陷入死循环。示例：

```js
const { SyncLoopHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncLoopHook(),
    };
  }
  sleep() {
    return this.hooks.sleep.call();
  }
}

const person = new Somebody();
let times = 0;

// 注册回调
person.hooks.sleep.tap("test", (arg) => {
  ++times;
  console.log(`第 ${times} 次执行回调A`);
  if (times < 4) {
    return times;
  }
});

person.hooks.sleep.tap("test", (arg) => {
  console.log(`执行回调B`);
});

person.sleep();
// 运行结果
// 第 1 次执行回调A
// 第 2 次执行回调A
// 第 3 次执行回调A
// 第 4 次执行回调A
// 执行回调B
```

可以看到示例中一直在执行回调 A，直到满足判定条件 `times >= 4` ，A 返回 `undefined` 后，才开始执行回调B。

虽然 Tapable 提供了 `SyncLoopHook` 钩子，但 webpack 源码中并没有使用到，所以读者理解用法就行，不用深究。