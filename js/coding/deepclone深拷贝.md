[63. 手写`_.cloneDeep()`](https://bigfrontend.dev/zh/problem/create-cloneDeep)

`Object.assign()` 可以用来浅拷贝，而[_.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) 在深度拷贝中非常有用。下面实现自己的`_.cloneDeep()`。简单起见，只需要支持：

1.  基础数据类型及其wrapper object。
2.  简单Object（仅需处理可枚举属性）
3.  数组Array

```js
function cloneDeep(data, map = new Map()) {
  // 边界情况
  if (data === null || typeof data !== "object") {
    return data;
  }
  // 使用 map 解决循环引用带来的无限递归
  if (map.has(data)) {
    return map.get(data);
  }
  //
  const clone = Array.isArray(data) ? [] : {};
  map.set(data, clone);
  // 获得所有属性包括 Symbol 属性
  const keys = [...Object.getOwnPropertySymbols(data), ...Object.keys(data)];

  for (const key of keys) {
    clone[key] = cloneDeep(data[key], map);
  }
  
  return clone;
}
```

