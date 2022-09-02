[60. 实现自己的`new`](https://bigfrontend.dev/zh/problem/create-your-own-new-operator)



```js
function myNew(constructorFunc, ...args) {
  // 创建一个新的对象，继承构造函数的原型
  const obj = Object.create(constructorFunc.prototype);
  // 用指定的参数调用构造函数，并以 obj 作为上下文
  const result = constructorFunc.apply(obj, args);
  // const result = Reflect.apply(constructorFunc, obj, args); 
  
  // 注意构造函数的返回值类型处理
  if (result && typeof result === "object") {
    return result;
  } else {
    return obj;
  }
}
```

