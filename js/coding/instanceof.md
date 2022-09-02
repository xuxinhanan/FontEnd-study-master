[90. 实现`instanceof`](https://bigfrontend.dev/zh/problem/write-your-own-instanceof)

```js
function myInstanceOf(left, right) {
  // 边界情况
  if (!left || typeof left !== "object") return false;
  // 如果左边的原型与右边的原型匹配，则返回true
  if (Object.getPrototypeOf(left) === right.prototype) return true;
  else {
    // 否则顺着原型链继续查
    return myInstanceOf(Object.getPrototypeOf(left), right);
  }
}
```