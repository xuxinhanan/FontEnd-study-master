### 1.柯里化

实现一个 curry()，接受一个function然后返回一个柯里化过后的function。

~~~js
function curry(fn) {
  return function curryInner(...args) {
    // ES6之后有了扩展运算符，可以不需要通过arguments来捕获可变数量的参数
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curryInner(...args, ...next);
  }
}
~~~

### 2.支持placeholder的柯里化

~~~js
const  join = (a, b, c) => {
   return `${a}_${b}_${c}`
}

const curriedJoin = curry(join)
const _ = curry.placeholder

curriedJoin(1, 2, 3) // '1_2_3'

curriedJoin(_, 2)(1, 3) // '1_2_3'

curriedJoin(_, _, _)(1)(_, 3)(2) // '1_2_3'
~~~



~~~js
function curry(func) {
  return function curried(...args) {
    // 是否接收完毕参数，并且参数不包含占位符
    const complete = args.length >= func.length && !args.slice(0, func.length).includes(curry.placeholder)
    if (complete) return func.apply(this, args)
    // 否则
    return function(...newArgs) {
      // 用 newArgs 中的值替换 args 中的占位符
      const res = args.map(arg => arg === curry.placeholder && newArgs.length ? newArgs.shift() : arg)
      return curried(...res, ...newArgs)
    }
  }
}

curry.placeholder = Symbol()
~~~







### 2.扁平化

1.普通递归：

~~~js
function flat(arr) {
  let result = [];
  arr.forEach((item) => {
    if (!Array.isArray(item)) {
      result.push(item);
    } else {
      // 没有...会报错，因为要将结果展开
      result.push(...flat(item));
    }
  });
  return result;
}
~~~

2.利用reduce函数迭代：

~~~js
function flat(arr) {
  return arr.reduce((acc, curr) => {
    return [...acc, ...(Array.isArray(curr) ? flat(curr) : [curr])];
  }, []);
}
~~~



### 3.节流

规定在一个单位时间内，只能触发一次函数。如果这个单位时间内触发多次函数，只有一次生效。

这是throttle之前的调用：

─A─B─C─ ─D─ ─ ─ ─ ─ ─ E─ ─F─G

按照3个单位进行throttle过后：

─A─ ─ ─C─ ─ ─D ─ ─ ─ E─ ─ ─G

注意到：

- A因为不在任何的冷却时间，所以立即被执行
- B被跳过了，因为B和C都在A的冷却时间里

~~~js
function throttle(func, interval) {
  let cd = true;
  return (...args) => {
    if (cd) {
      let context = this;
      cd = false;
      setTimeout(() => {
        func.apply(context, args);
        cd = true;
      }, interval);
    }
  }
}
~~~







### 4.防抖

在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。

如搜索框，监听到键盘事件就会发送网络请求显示相应内容，但有时不希望频繁发出网络请求，期待内容输入完整后再发出网络请求来提升性能。

在debounce之前如下的调用：

─A─B─C─ ─D─ ─ ─ ─ ─ ─E─ ─F─G

经过3单位的debounce之后变为了：

─ ─ ─ ─ ─ ─ ─ ─ D ─ ─ ─ ─ ─ ─ ─ ─ ─ G

~~~js
function debounce(func, wait) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, ...args), wait);
  }
}
~~~



### 5.深拷贝

`Object.assign()` 可以用来前拷贝，而[_.cloneDeep](https://lodash.com/docs/4.17.15#cloneDeep) 在深度拷贝中非常有用。下面实现自己的`_.cloneDeep()`。

~~~js
function cloneDeep(data, map = new Map()) {
  // 基本类型直接返回
  if (obj === null || typeof obj !== "object") {
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
    const value = data[key];
    clone[key] = cloneDeep(value, map);
  }
	
  return clone;
}
~~~

简单起见，只需要支持：

1. 基础数据类型及其wrapper object。
2. 简单Object（仅需处理可枚举属性）
3. 数组Array

### 6.new

~~~js
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
~~~

注：静态方法 `Reflect.apply()` 与 ES5 中[`Function.prototype.apply()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)方法类似。使用 `Reflect.apply` 方法会使代码更加简洁易懂。

补充：Reflect 对象创建目的？

- 将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty，放到 Reflect 对象上。
- 修改某些 Object 方法的返回结果，让其变得更合理。
- 让 Object 操作都变成函数行为。
- Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

### 7.Object.create

作用：创建一个新对象，将提供的对象作为新对象的原型。

~~~js
function myCreate(proto) {
  if (typeof proto !== 'object' || proto === null) throw new Error('');
  const obj = {};
  obj.__proto__ = proto;
  return obj;
}
~~~

这里不对传第二个参数的情况进行实现。

`propertiesObject`：可选。需要传入一个对象，该对象的属性类型参照[`Object.defineProperties()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties)的第二个参数。如果该参数被指定且不为 [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，该传入对象的自有可枚举属性 (即其自身定义的属性，而不是其原型链上的枚举属性)， 将为新创建的对象添加指定的属性值和对应的属性描述符。

### 8.instanceof

作用：检查右边的原型是否出现在左边（待检测目标）的原型链上。

~~~js
function myInstanceOf(left, right) {
  // 边界情况
  if (!left || typeof left !== "object") return false;
  if (!target.prototype) throw Error;
	// 如果左边的原型与右边的原型匹配，则返回true
  if (Object.getPrototypeOf(left) === right.prototype) {
    return true;
  } else {
    // 否则顺着原型链继续查
    return myInstanceOf(Object.getPrototypeOf(left), right);
  }
}
~~~



### 9.Object.is

`Object.is()`和`===`基于一致，除了以下情况：

~~~js
Object.is(0, -0) // false
0 === -0 // true

Object.is(NaN, NaN) // true
NaN === NaN // false
~~~

~~~js
function is(a, b) {
  // 对上面两种差异单独处理
  if (Number.isNaN(a) && Number.isNaN(b)) {
    return true;
  }
  
  if (a === 0 && b === 0) {
    // 1 / -0 is -Infinity and -Infinity === -Infinity
    return 1 / a === 1 / b;
  }
	// 其余情况与 "===" 完全一致
  return a === b;
}
~~~



### 10.Object.assign

`Object.assign() `方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

~~~js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target); // { a: 1, b: 4, c: 5 }

console.log(returnedTarget); // { a: 1, b: 4, c: 5 }
~~~



~~~js
function myAssign(target, ...sources) {
  if (target === undefined || target === null) { // 边界条件
    throw 'err'
  }

  target = Object(target);

  sources.forEach(source => {
    if (source === undefined || source === null) {
      return;
    }
    Object.defineProperties(
      target,
      Object.getOwnPropertyDescriptors(source)
    );
    // 对symbol 的处理
    Object.getOwnPropertySymbols(source).forEach((symbol) => {
      target[symbol] = source[symbol];
    })
  })

  return target;
}
~~~

注：

1. `Object.defineProperties()` 方法直接在一个对象上定义新的属性或修改现有属性。
2. `Object.getOwnPropertyDescriptors()` 方法用来获取一个对象的所有自身属性的描述符。
3. Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 等返回。
4. `Object.getOwnPropertySymbols()`返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。



### 11.Function.prototype.call

根据[最新的 ECMAScript spec](https://tc39.es/ecma262/#sec-function.prototype.call)，`thisArg` 不会被类型转换，在 [Strict Mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)下也不会被更改为window。

这里实现**非strict mode**的情况。

~~~js
Function.prototype.mycall = function (context, ...args) {
  // 边界情况：null 不存在或者为原始值，需要用Object 来处理
  context = Object(context || window);
  // 创建一个唯一属性
  const func = Symbol();
  // 赋值为调用mycall方法的函数
  context[func] = this;
  const result = context[func](...args);
  delete context[symbol];
  return result;
};
~~~

注：

1. Symbol 值作为对象属性名不能用点运算符，因为会转为字符串
2. Symbol 值只能通过 Symbol 函数生成，Symbol 函数前不能使用 new 命令实例化





### 12.Function.prototype.apply

~~~js
Function.prototype.myapply = function (context, args) { // 与call的差异仅在传参方式
  context = Object(context || window);
  const func = Symbol();
  context[func] = this;
  const result = context[func](...args);
  delete context[symbol];
  return result;
};
~~~



### 13.Function.prototype.mybind

实际上是一个工具（包装）函数，将函数调用与上下文绑定在一起。

~~~js
Function.prototype.mybind = function (context, ...args) {
  const func = Symbol();
  context[func] = this;

  return function () {
    const result = context[func](...args);
    delete context[func];
    return result;
  };
};
~~~



### 14.Promise

~~~js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(executor) {
  this.result = null;
  this.error = null;
  this.state = PENDING;
  this.onFulfilledCallbacks = [];
  this.onRejectedCallbacks = [];

  const resolve = (value) => {
    if (this.state === PENDING) {
      this.result = value;
      this.state = FULFILLED;
      queueMicrotask(() => {
        this.onFulfilledCallbacks.forEach((fn) => {
          fn(this.result);
        });
      });
    }
  };
  const reject = (error) => {
    if (this.state === PENDING) {
      this.error = error;
      this.state = REJECTED;
      queueMicrotask(() => {
        this.onRejectedCallbacks.forEach((fn) => {
          fn(this.error);
        });
      });
    }
  };
  try {
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  onFulfilled =
    typeof onFulfilled === "function" ? onFulfilled : (result) => result;
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : (err) => {
          throw err;
        };

  return new MyPromise((resolve, reject) => {
    if (this.state === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        try {
          let res = onFulfilled(this.result);
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
      this.onRejectedCallbacks.push(() => {
        try {
          let reason = onFulfilled(this.result);
          resolve(reason);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.state === FULFILLED) {
      try {
        let res = onFulfilled(this.result);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    }
    if (this.state === REJECTED) {
      try {
        let res = onRejected(this.err);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    }
  });
};

MyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
};

MyPromise.prototype.finally = function (onFinally) {
  this.then(
    (onFinally) => {
      onFinally();
    },
    (onFinally) => {
      onFinally();
    }
  );
};

MyPromise.resolve = function (value) {
  return new MyPromise((resolve) => {
    resolve(value);
  });
};

MyPromise.reject = function (value) {
  return new MyPromise((reject) => {
    reject(value);
  });
};
~~~



### 16.Promise.all

用途：假设我们希望并行执行多个 promise，并等待所有 promise 都准备就绪。

`Promise.all(iterable)` 方法返回一个 `Promise` 实例，此实例在 `iterable` 参数内所有的 `promise` 都`resolved`或参数中不包含 `promise` 时`resolve`；如果参数中 `promise` 有一个`rejected`，此实例`reject`，失败的原因是第一个失败 `promise` 的结果。

~~~js
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then((values) => {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
~~~



~~~js
function all(promises) {
  return new Promise((resolve, reject) => {
    const result = [];

    if (promises.length === 0) {
      resolve(result);
      return;
    }

    let countPending = promises.length;

    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        // 保证返回的prmoise顺序正确
        result[index] = value;
        countPending--;
        if (countPending === 0) {
          resolve(result);
        }
      }, reject);
    });
  });
}
~~~



### 17.Promise.allSettled

当对结果不太关注，只关心所有的 `promise` 是否被 `settle` 时，可用 `promise.allSettled()`。

~~~js
// 结果是这种形式
[
  {status: 'fulfilled', value: ...},
  {status: 'fulfilled', value: ...},
  {status: 'rejected', reason: ...}
]
~~~



~~~js
function allSettled(promises) {
  return new Promise((resolve) => {
    const result = [];
    let waitFor = promises.length;
    // 边界case
    if (waitFor === 0) {
      resolve(result);
    }
    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then((value) => result[index] = { status: "fulfilled", value })
        .catch((reason) => result[index] = { status: "rejected", reason })
        .finally(() => {
        	// 不管 resolved 还是 rejected
          waitFor--;
          if (waitFor === 0) {
            resolve(result);
          }
        });
    });
  });
}
~~~



### 18.Promise.race

race：竞赛。只等待其中一个 `settled` 的 `promise` 并获取其结果。

~~~js
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
~~~

~~~js
function race(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((promise) => {
      // 给promises中的每一个promise添加能使返回的promise settled的回调，然后看谁先完成
      promise.then(resolve, reject);
    });
  });
}
~~~



### 19.实现一个sum()方法

实现一个 `sum()`，使得如下判断成立。

~~~js
const sum1 = sum(1)
sum1(2) == 3 // true
sum1(3) == 4 // true
sum(1)(2)(3) == 6 // true
sum(5)(-1)(2) == 6 // true
~~~

我们知道`sum(1)(2)`可以通过从一个函数返回一个函数实现：

~~~js
function sum(num) {
  return function(num2) {
    return num+num2;
  }
}
~~~

但我们需要可以完成`sum(1)(2)...(n)`，如何解决呢？

如果对递归熟悉，那么很容易想到通过递归即可完成。

```js
function sum(num1) {
  return function(num2) {
    return num2 ? sum(num1 + num2) : num1;
  }
}
```

这样完成了吗？上面最终只会返回一个函数，比如：

```js
sum(1)(2) // 返回 function
sum(1)(2)() // 返回 3
```

如何实现函数与原始值比较返回 Boolean 结果呢？

根据 JavaScript 的类型转换我们知道，JavaScript 会调用toPrimitive、 valueOf 和 toString 方法来完成类型转换。所以为了完成题目要求，我们需要重写其中之一方法，使其返回 num即可。

~~~js
function sum(num) {
  const func = function(num2) { 
    return num2 ? sum(num+num2) : num;
  }
  
  func.valueOf = () => num; 
  // func.toString = () => num;
  // func[Symbol.toPrimitive] = () => num;
  return func; 
}
~~~

如果想要支持传多个参数怎么办呢？例如`sum(1)(2)(3, 4)`

```js
function sum(num) {
  return function(...args) {
    return args ? num1 + args.reduce((cal, curr) => cal += curr, 0) : num1; // reduce累加
  }

  func.valueOf = () => num; 
  return func; 
}
```







20.什么是Composition?实现pipe()
