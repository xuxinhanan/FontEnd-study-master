[4. 手写throttle()](https://bigfrontend.dev/zh/problem/implement-basic-throttle)

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

这是throttle之前的调用：

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

按照3个单位进行throttle过后：

─A─ ─ ─C─ ─ ─D ─ ─ ─ E─ ─ ─G

注意到：

-   A因为不在任何的冷却时间，所以立即被执行
-   B被跳过了，因为B和C都在A的冷却时间里

```js
function throttle(func, delay = 500) {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      waiting = true;
      // func 在这里执行而不在定时器里，因为初始没有冷却时间
      func.apply(this, args);
      setTimeout(() => {
        waiting = false;
      }, delay)
    }
  }
}
```