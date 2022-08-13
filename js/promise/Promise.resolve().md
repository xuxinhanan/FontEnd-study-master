> :heavy_exclamation_mark:  `Promise.resolve(value)` 用结果 `value` 创建一个 resolved 的 promise。





~~~js
Promise.resolve(value) {
  const isValuePromise = value instanceof Promise;

  if (isValuePromise) {
    return value;
  }

  return new MyPromise((resolve) => {
    resolve(value);
  });
}
~~~

