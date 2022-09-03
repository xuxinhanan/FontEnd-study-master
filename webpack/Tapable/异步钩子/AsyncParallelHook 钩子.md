与 `AsyncSeriesHook` 类似，`AsyncParallelHook` 也支持异步风格的回调，不过 `AsyncParallelHook` 是以并行方式，同时执行回调队列里面的所有回调，逻辑上近似于：

```js
function asyncParallelCall(callback) {
  const callbacks = [fn1, fn2];
  // 内部维护了一个计数器
  var _counter = 2;

  var _done = function() {
    _callback();
  };
  if (_counter <= 0) return;
  // 按序执行回调
  var _fn0 = callbacks[0];
  _fn0(function(_err0) {
    if (_err0) {
      if (_counter > 0) {
        // 出错时，忽略后续回调，直接退出
        _callback(_err0);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });
  if (_counter <= 0) return;
  // 不需要等待前面回调结束，直接开始执行下一个回调
  var _fn1 = callbacks[1];
  _fn1(function(_err1) {
    if (_err1) {
      if (_counter > 0) {
        _callback(_err1);
        _counter = 0;
      }
    } else {
      if (--_counter === 0) _done();
    }
  });
}
```

`AsyncParallelHook` 钩子的特点：

- 支持异步风格
- 并行执行回调队列，不需要做任何等待
- 与 SyncHook 一样，不关心回调的执行结果

###  