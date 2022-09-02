[6. 手写debounce()](https://bigfrontend.dev/zh/problem/implement-basic-debounce)



在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。

如搜索框，监听到键盘事件就会发送网络请求显示相应内容，但有时不希望频繁发出网络请求，期待内容输入完整后再发出网络请求来提升性能。

在debounce之前如下的调用：

─A─B─C─ ─D─ ─ ─ ─ ─ ─E─ ─F─G

经过3单位的debounce之后变为了：

─ ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ ─ ─ G

```js
function debounce(func, wait) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, ...args), wait);
  }
}
```