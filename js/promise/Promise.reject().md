> :heavy_exclamation_mark:  `Promise.reject(error)` 用 `error` 创建一个 rejected 的 promise。



~~~js
Promise.reject(value) {
  return new Promise((_, reject) => {
    reject(value);
  });
}
~~~

