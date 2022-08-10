### [61. 实现`Function.prototype.call`](https://bigfrontend.dev/zh/problem/create-call-method)

根据最新的 ECMAScript spec，`thisArg` 不会被类型转换，在 Strict Mode下也不会被更改为window。

这里实现 **非strict mode** 的情况。

~~~js
Function.prototype.mycall = function(context, ...args) {
  context = Object(context || window);
  const func = Symbol();
  context[func] = this;
  const result = context[func](...args);
  delete context[func];
  return result;
}
~~~

注：

1. Symbol 值作为对象属性名不能用点运算符，因为会转为字符串
2. Symbol 值只能通过 Symbol 函数生成，Symbol 函数前不能使用 new 命令实例化
