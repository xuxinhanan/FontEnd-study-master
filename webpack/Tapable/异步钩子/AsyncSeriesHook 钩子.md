#### 基本逻辑

`AsyncSeriesHook` 的特点：

- 支持异步回调，可以在回调函数中写 `callback` 或 `promise` 风格的异步操作
- 回调队列依次执行，前一个执行结束后才会开始执行下一个
- 与 `SyncHook` 一样，不关心回调的执行结果

用一段伪代码来表示：

```js
function asyncSeriesCall(callback) {
  const callbacks = [fn1, fn2, fn3];
  //   执行回调 1
  fn1((err1) => {
    if (err1) {
      callback(err1);
    } else {
      //   执行回调 2
      fn2((err2) => {
        if (err2) {
          callback(err2);
        } else {
          //   执行回调 3
          fn3((err3) => {
            if (err3) {
              callback(err2);
            }
          });
        }
      });
    }
  });
}
```

#### 示例

先来看个 `callback` 风格的示例：

```js
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();

// 注册回调
hook.tapAsync("test", (cb) => {
  console.log("callback A");
  setTimeout(() => {
    console.log("callback A 异步操作结束");
    // 回调结束时，调用 cb 通知 tapable 当前回调已结束
    cb();
  }, 100);
});

hook.tapAsync("test", () => {
  console.log("callback B");
});

hook.callAsync();
// 运行结果：
// callback A
// callback A 异步操作结束
// callback B
```

从代码输出结果可以看出，A 回调内部的 `setTimeout` 执行完毕调用 `cb` 函数，tapable 才认为当前回调执行完毕，开始执行 B 回调。

除了 `callback` 风格外，也可以使用 `promise` 风格调用 `tap/call` 函数，改造上例：

```js
const { AsyncSeriesHook } = require("tapable");

const hook = new AsyncSeriesHook();

// 注册回调
hook.tapPromise("test", () => {
  console.log("callback A");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("callback A 异步操作结束");
      resolve();
    }, 100);
  });
});

hook.tapPromise("test", () => {
  console.log("callback B");
  return Promise.resolve();
});

hook.promise();
// 运行结果：
// callback A
// callback A 异步操作结束
// callback B
```

有三个改动点：

- 将 `tapAsync` 更改为 `tapPromise`
- `Tap` 回调需要返回 `promise` 对象，如上例第 8 行
- `callAsync` 调用更改为 `promise`

#### Webpack 场景分析

`AsyncSeriesHook` 钩子在 webpack 中总共出现了34次，相对来说都是一些比较容易理解的时机，比如在构建完毕后触发 `compiler.hooks.done` 钩子，用于通知单次构建已经结束：

```js
class Compiler {
  run(callback) {
    if (err) return finalCallback(err);

    this.emitAssets(compilation, (err) => {
      if (err) return finalCallback(err);

      if (compilation.hooks.needAdditionalPass.call()) {
        // ...
        this.hooks.done.callAsync(stats, (err) => {
          if (err) return finalCallback(err);

          this.hooks.additionalPass.callAsync((err) => {
            if (err) return finalCallback(err);
            this.compile(onCompiled);
          });
        });
        return;
      }

      this.emitRecords((err) => {
        if (err) return finalCallback(err);

        // ...
        this.hooks.done.callAsync(stats, (err) => {
          if (err) return finalCallback(err);
          return finalCallback(null, stats);
        });
      });
    });
  }
}
```

###  