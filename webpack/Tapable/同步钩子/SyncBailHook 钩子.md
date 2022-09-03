#### 基本逻辑

`bail` 单词有熔断的意思，而 `bail` 类型钩子的特点是在回调队列中，若任一回调返回了非 `undefined` 的值，则中断后续处理，直接返回该值，用一段伪代码来表示：

```js
function bailCall() {
  const callbacks = [fn1, fn2, fn3];
  for (let i in callbacks) {
    const cb = callbacks[i];
    const result = cb(lastResult);
    if (result !== undefined) {
      // 熔断
      return result;
    }
  }
  return undefined;
}
```

#### 示例

`SyncBailHook` 的调用顺序与规则都跟 `SyncHook` 相似，主要区别一是 `SyncBailHook` 增加了熔断逻辑，例如：

```js
const { SyncBailHook } = require("tapable");

class Somebody {
  constructor() {
    this.hooks = {
      sleep: new SyncBailHook(),
    };
  }
  sleep() {
    return this.hooks.sleep.call();
  }
}

const person = new Somebody();

// 注册回调
person.hooks.sleep.tap("test", () => {
  console.log("callback A");
  // 熔断点
  // 返回非 undefined 的任意值都会中断回调队列
  return '返回值：tecvan'
});
person.hooks.sleep.tap("test", () => {
  console.log("callback B");
});

console.log(person.sleep());

// 运行结果：
// callback A
// 返回值：tecvan
```

其次，相比于 `SyncHook` ，`SyncBailHook` 运行结束后，会将熔断值返回给call函数，例如上例第20行， `callback A` 返回的返回值：`tecvan` 会成为 `this.hooks.sleep.call` 的调用结果。

#### Webpack 场景解析

`SyncBailHook` **通常用在发布者需要关心订阅回调运行结果的场景**，举个例子：`compiler.hooks.shouldEmit`，对应的 `call` 语句：

```js
class Compiler {
  run(callback) {
    //   ...

    const onCompiled = (err, compilation) => {
      if (this.hooks.shouldEmit.call(compilation) === false) {
        // ...
      }
    };
  }
}
```

**此处 webpack 会根据 `shouldEmit` 钩子的运行结果确定是否执行后续的操作。**

