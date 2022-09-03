# 什么是插件

从形态上看，插件通常是一个带有 apply 函数的类：

```js
class SomePlugin {
    apply(compiler) {
      // ...
    }
}
```

`apply` 函数运行时会得到参数 `compiler` ，以此为起点可以调用 `hook` 对象注册各种钩子回调。

例如`compiler.hooks.thisCompilation.tap`： 

+ 这里面 `thisCompilation` 是钩子名称，为 tapable 仓库提供的钩子对象

+ `tap` 用于注册回调，插件开发者可以使用这种模式在钩子回调中，插入特定代码。

  

webpack 各种内置对象都带有 `hooks` 属性，比如 `compilation` 对象：

~~~js
class SomePlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('SomePlugin', (compilation) => {
            compilation.hooks.optimizeChunkAssets.tapAsync('SomePlugin', ()=>{});
        })
    }
}
~~~

------------



# Webpack 插件架构

前端社区里很多有名的框架都各自有一套插件架构，例如 axios、quill、vscode、webpack、vue、rollup 等等。插件架构灵活性高，扩展性强，但是通常需要非常强的架构能力，需要至少解决三个方面的问题：

- **「接口」**：需要提供一套逻辑接入方法，让开发者能够将逻辑在特定时机插入特定位置
- **「输入」**：如何将上下文信息高效传导给插件
- **「输出」**：插件内部通过何种方式影响整套运行体系

--------------

针对这些问题，webpack 为开发者提供了基于 tapable 钩子的插件方案：

1. **编译过程的特定节点以钩子形式，通知插件此刻正在发生什么事情；**
2. **通过 tapable 提供的回调机制，以参数方式传递上下文信息；**
3. **在上下文参数对象中附带了很多存在 side effect 的交互接口，插件可以通过这些接口改变**

这一切实现都离不开 tapable，例如：

```js
class Compiler {
  // 在构造函数中，先初始化钩子对象
  constructor() {
    this.hooks = {
      thisCompilation: new SyncHook(["compilation", "params"]),
    };
  }

  compile() {
    // 特定时机触发特定钩子
    const compilation = new Compilation();
    this.hooks.thisCompilation.call(compilation);
  }
}
```

`Compiler` 类型内部定义了 `thisCompilation` 钩子，并在 `compilation` 创建完毕后发布事件消息，插件开发者就可以基于这个钩子获取到最新创建出的 `compilation` 对象：

```js
class SomePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("SomePlugin", (compilation, params) => {
        // 上下文信息： compilation、params
    });
  }
}
```

钩子回调传递的 `compilation/params` 参数就是 webpack 希望传递给插件的上下文信息，也是插件能拿到的输入。**不同钩子会传递不同的上下文对象，这一点在钩子被创建的时候就定下来了**，比如：

```js
class Compiler {
    constructor() {
        this.hooks = {
            /** @type {SyncBailHook<Compilation>} */
            shouldEmit: new SyncBailHook(["compilation"]),
            /** @type {AsyncSeriesHook<Stats>} */
            done: new AsyncSeriesHook(["stats"]),
            /** @type {AsyncSeriesHook<>} */
            additionalPass: new AsyncSeriesHook([]),
            /** @type {AsyncSeriesHook<Compiler>} */
            beforeRun: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compiler>} */
            run: new AsyncSeriesHook(["compiler"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            emit: new AsyncSeriesHook(["compilation"]),
            /** @type {AsyncSeriesHook<string, Buffer>} */
            assetEmitted: new AsyncSeriesHook(["file", "content"]),
            /** @type {AsyncSeriesHook<Compilation>} */
            afterEmit: new AsyncSeriesHook(["compilation"]),
        };
    }
}
```

- `shouldEmit` 会被传入 `compilation` 参数
- `done` 会被传入 `stats` 参数
- `addtionalPass` 没有参数
- ...

常见的参数对象有 `compilation/module/stats/compiler/file/chunks` 等，在钩子回调中可以通过改变这些对象的状态，影响 webpack 的编译逻辑。

---------
