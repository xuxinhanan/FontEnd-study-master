webpack 的插件体系是一种基于 Tapable 实现的强耦合架构，**它在特定时机触发钩子时会附带上足够的上下文信息**，**插件定义的钩子回调中，能与这些上下文背后的数据结构、接口交互产生 side effect**，**进而影响到编译状态和后续流程。**



## 基本用法

Tapable 使用时通常需要经历如下步骤：

- 创建钩子实例
- 调用订阅接口注册回调（ **如tap**、tapAsync、tapPromise ）
- 调用发布接口触发回调（ **如call**、callAsync、promise ）

举个例子：

```js
const { SyncHook } = require("tapable");

// 1. 创建钩子实例
const sleep = new SyncHook();

// 2. 调用订阅接口注册回调
sleep.tap("test", () => {
  console.log("callback A");
});

// 3. 调用发布接口触发回调
sleep.call();

// 运行结果：
// callback A
```



























