  Rollup 号称下一代打包方案，具有以下特点：

+ **仅支持 ES Next 模块**
+ **内置支持 tree shaking 功能**

------------------

通过打包的结果来认识 Rollup ：

~~~js
// hello.js
export const sayHi = name => `hi ${name}`

export const sayHello = name => `hello ${name}`
~~~

使用 hello 模块：

~~~js
import { sayHello } from './hello.js'

console.log(sayHello('lucas'))
~~~

打包结果如下：

~~~js
'use strict'

const sayHello = name => `hello ${name}`;
console.log(sayHello('lucas'))
~~~

可以看到 Rollup 直接将代码顺序引入文件中，直接消灭了模块的冗余部分，天然实现 tree shaking 功能。

并且与 webpack 相比，打包出来的代码非常干净。 webpack 打包会生成比较多的冗余代码。

另一方面 webpack 支持代码分割，在复杂应用中可以将库和业务代码分离开来。而编写库的时候很少用到这样的功能。

并且 webpack 还拥有相对更加强大的社区支持以及对 CommonJS 规范的模块的支持。

综上，我们可以得出结论：**建库用 Rollup，其他场景用 webpack。**