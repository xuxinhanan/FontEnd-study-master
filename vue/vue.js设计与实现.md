# 框架设计

## 权衡的艺术

### 命令式和声明式

从范式来看，视图层框架通常分为命令式和声明式。

JQuery 就是典型的命令式框架。命令式框架的一大特点就是关注过程。

~~~js
$('#app') // 获取 div
	.text('hello world') // 设置文本内容
	.on('click', () => { alert('ok') }) // 绑定点击事件
~~~

声明式框架更关注结果。来看 vue.js 的实现方式：

~~~vue
<div @click="() => alert('ok')">hello world</div>
~~~

这段模板就是实现如上功能的方式。容易猜到 vue.js 本身是封装了命令式代码才实现面向用户的声明式的。

### 性能与可维护性

声明式代码的性能不优于命令式代码的性能。

如果我们把直接修改的性能消耗定义为 A，把 **"找出差异的性能消耗"** 定义为B，那么有：

命令式代码的更新性能消耗 = A

命令式代码的更新性能消耗 = B + A

可以看到，声明式代码会比命令式代码多出找出差异的性能消耗。

既然性能层面，命令式代码更好。那么为什么 vue.js 选择声明式的设计方案呢？

原因就在于声明式代码的可维护性更强。



### 虚拟DOM的性能

从前面我们知道，**声明式代码的更新性能消耗 = 找出差异的性能消耗 + 直接修改的性能消耗**，因此如果我们能够最小化找出差异的性能消耗，就可以让声明式代码的性能无限接近命令式代码。而虚拟DOM，就是为了最小化找出差异这一步而出现的。

在早年使用 jQuery 或者直接使用 JavaScript 编写页面的时候，使用 innerHTML 来操作页面非常常见。我们来看看使用 innerHTML 操作页面和虚拟 DOM 相比性能如何？

对于 innerHTML 来说，为了创建页面，我们需要构造一段 HTML 字符串，然后赋值给 DOM 元素的 innerHTML 属性：

~~~js
const html = `
<div><span></span></div>
`

div.innerHTML = html
~~~

然而这句话远没有看起来那么简单。为了渲染出页面，首先要把字符串解析成 DOM 树，这是一个 DOM 层面的计算。我们知道，涉及 DOM 的运算要远比 JavaScript 层面的计算性能差。

可以用一个公式来表达 innerHTML 创建页面的性能：HTML 字符串拼接的计算量 + innerHTML 的 DOM 计算。

接下来看看虚拟 DOM 在创建页面时的性能。虚拟 DOM 创建页面的过程分为两步：第一步是创建 JavaScript 对象，这个对象可以理解为真实 DOM 的表述；第二步是递归地遍历虚拟 DOM 树并创建真实 DOM。

同样可以用一个公式来表达：创建 JavaScript 对象的计算量 + 创建真实 DOM 的计算量。

|                    | 虚拟 DOM                      | innerHTML         |
| ------------------ | ----------------------------- | ----------------- |
| 纯 JavaScript 运算 | 创建 JavaScript 对象（VNode） | 渲染 HTML字符串   |
| DOM 运算           | 新建所有 DOM 元素             | 新建所有 DOM 元素 |

可以看到，创建页面时，两者差距其实不大。

接下来继续看更新页面时的性能。

使用 innerHTML 更新页面的过程是重新构建 HTML 字符串，再重新设置 DOM 元素的 innerHTML 属性，这其实是在说，哪怕只更改了一个文字，也要重新设置 innerHTML 属性。而重新设置 innerHTML 属性就等价于销毁所有旧的 DOM 元素，再全量创建新的 DOM 元素。

|                    | 虚拟 DOM                        | innerHTML                          |
| ------------------ | ------------------------------- | ---------------------------------- |
| 纯 JavaScript 运算 | 创建新的 JavaScript 对象 + diff | 渲染 HTML 字符串                   |
| DOM 运算           | 必要的 DOM 更新                 | 销毁所有旧 DOM<br />新建所有新 DOM |
| 性能因素           | 与数据变化量相关                | 与模板大小相关                     |

可以发现，当更新页面时，虚拟 DOM 的优势就体现出来了。



| innerHTML (模板) | 虚拟 DOM   | 原生 JavaScript |
| ---------------- | ---------- | --------------- |
| 心智负担中等     | 心智负担小 | 心智负担大      |
| 性能差           | 性能不错   | 性能高          |
|                  | 可维护性强 | 可维护性差      |



### 运行时和编译时

当设计一个框架时，我们有三种选择：纯运行时的、运行时 + 编译时的或纯编译时的。

先来看看纯运行时的框架。假设我们设计了一个框架，它提供一个 Render 函数，用户可以为该函数提供一个树形结构的数据对象，然后 Render 函数会根据该对象递归地将数据渲染成 DOM 元素。

~~~js
// render 函数
function Render(obj, root) {
  const el = document.createElement(obj.tag)
  if (typeof obj.children === 'string') {
    const text = document.createTextNode(obj.children)
    el.appendChild(text)
  } else if (obj.children) {
    obj.children.forEach((child) => Render(child, el))
  }
  
  root.appendChild(el)
}
~~~

有了这个函数，用户就可以这样使用它：

~~~js
// 树形结构的数据对象
const obj = {
  tag: 'div',
  children: [
    { tag: 'span', children: 'hello world' }
  ]
}
// 渲染到 body 下
Render(obj, document.body)
~~~

但是手写树形结构的数据对象太麻烦，而且不直观。能不能用类似 HTML 标签的方式描述树型结构的数据对象呢？

为此，可以引入编译的手段，把 HTML 标签编译成树形结构的数据对象。

于是，运行时 + 编译时框架提供了一个 Compiler 函数完成编译功能。现在用户就可以这样使用了：

~~~jsx
const html = `
<div>
	<span>hello world</span>
</div>
`
const obj = Compiler(html)
Render(obj, document.body)
~~~

准确地说，上面的代码其实是运行时编译，意思是代码运行的时候才开始编译，而这会产生一定的性能开销，因此我们也可以再构建的时候就执行 Compiler 程序将用户提供的内容编译好，等到运行时就无须编译了，这对性能是非常友好的。

而纯编译时的框架，则是一步到位直接将 HTML 字符串编译成命令式代码。这样我们只需要一个 Compiler 函数就可以了，连 Render 函数也不需要。

~~~html
<div>
	<span> hello world </span>
</div>
~~~

~~~js
// 直接编译成：
const div = document.createElement('div')
const span = document.createElement('span')
span.innerText = 'hello world'
div.appendChild(span)
document.body.appendChild(div)
~~~



总结

纯运行时的框架，由于没有编译的过程，因此我们没办法分析用户提供的内容，但是如果加入编译步骤，可能就大不一样了，我们可以分析用户提供的内容，看看哪些内容未来可能会改变，哪些内容永远不会改变，这样我们就可以在编译的时候提取这些信息，然后将其传递给 Render 函数， Render 函数得到这些信息后，就可以做进一步的优化了。

而纯编译时的框架，由于不需要任何运行时，而是直接编译成可执行的 JavaScript 代码，因此性能可能会更好，但这种做法有损灵活性，即用户提供的内容必须编译后才能用。





## 良好的 TypeScript 类型支持

> 使用 TS 编写编写框架和框架对 TS 类型支持友好是两件完全不同的事情。

有时候为了让框架提供更加友好的类型支持，甚至要花费比实现框架功能本身更多的时间和精力。





## 设计思路

### 组件的本质

**组件就是一组 DOM 元素的封装，这组 DOM 元素就是组件要渲染的内容。**

可以定义一个函数来代表组件，而函数的返回值就代表组件要渲染的内容：

~~~js
const MyComponent = function() {
  // 返回值是组件要渲染的内容，即虚拟DOM
  return {
    tag: 'div',
    props: {
      onClick: () => alert('hello')
    },
    children: 'click me'
  }
}
~~~

搞清楚组件的本质就可以用虚拟 DOM 来描述组件了。只需让虚拟 DOM 对象的 tag 属性来存储组件函数：

~~~js
const vnode = {
  tag: MyComponent
}
~~~





### 渲染器

**把虚拟 DOM 渲染为真实 DOM。**

简易版渲染器的实现：

~~~js
function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    // vnode 描述的是标签元素
    mountElement(vnode, container);
  } else if (typeof vnode.tag === 'function') {
    // vnode 描述的是组件
    mountComponent(vnode, container);
  }
}

function mountElement(vnode, container) {
  // 使用 vnode.tag 作为标签名称创建 DOM 元素
  const el = document.createElement(vnode.tag);
  // 遍历 vnode.props，将属性、事件添加到 DOM 元素中
  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      // 如果 key 以字符串 on 开头，说明它是事件
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ---> click
        vnode.props[key] // 事件处理函数
      )
    }
  }
	
  // 处理 children
  if (typeof vnode.children === 'string') {
    // 如果 children 是字符串，说明它是元素的文本子节点
    el.appendChild(document.createTextNode(vnode.children));
  } else if (Array.isArray(vnode.children)) {
    // 递归地调用 renderer 函数渲染子节点，使用当前元素 el 作为挂载点
    vnode.children.forEach(child => renderer(chil, el));
  }
	
  // 最后将元素添加到挂载点上
  container.appendChild(el);
}

function mountComponent(vnode, container) {
  // 调用组件函数，获取组件要渲染的内容（虚拟DOM）
  const subTree = vnode.tag();
  // 递归地调用 renderer 渲染 subTree
  renderer(subTree, container);
}
~~~



### 编译器

编译器的作用是将模板编译为渲染函数。

一个组件要渲染的内容就是通过渲染函数来描述的，vue.js 通过渲染函数的返回值拿到虚拟 DOM ，然后就可以通过渲染器把虚拟 DOM 渲染为真实 DOM 了。



### 渲染页面的流程

对于一个组件来说，通过编译器把组件的模板编译为渲染函数，渲染函数返回组件要渲染的内容即虚拟DOM，然后渲染器再把渲染函数返回的虚拟 DOM 渲染为真实 DOM，这就是 vue.js 渲染页面的流程。























# 响应式系统

响应式系统实现的根本原理：**对数据的”读取“和”设置“操作进行拦截，从而在副作用函数和响应式数据之间建立联系。当”读取“操作发生时，我们将当前执行的依赖（副作用函数）存储到一块空间中；当”设置“操作发生时，再将依赖（副作用函数）从这块空间中取出并执行。**



为了完善响应式系统，vue 解决了以下问题：

## 完善响应式系统

### 1.设计存储空间的数据结构

使用 WeakMap 配合 Map 构建依赖的存储空间，使得响应式数据与副作用函数之间建立明确的联系。

![存储空间，WeakMap](C:\Users\64554\Desktop\存储空间，WeakMap.png)

为什么用 weakmap 呢？

如果使用 map 作为存储空间，那么对于响应式对象来说，当用户侧的代码对该对象没有任何引用的时候，它依然不会被垃圾回收器给回收。原因是它仍然作为 map 的 key 被引用着。最终可能导致内存溢出。而使用 weakmap 则可以避免这种情况。



### 2.分支切换导致冗余依赖的问题

一句话总结：由于分支切换导致的冗余依赖的问题，于是在 watcher 中增加 deps 数组来管理 watcher，每次收集依赖时将依赖存储在 deps 数组中，当再次通过 watcher 执行副作用函数时，清除

对于代码中存在的条件判断的情况（如三元表达式`obj.ok ? obj.text : not`），当判断条件 obj.ok 的值发生变化时，代码执行的分支就会跟着变化。这就是所谓的分支切换。



**为了解决这个问题，需要在每次依赖重新执行之前，清除上一次建立的响应式联系，而当依赖重新执行后，会再次建立新的响应联系，新的响应联系中不存在"冗余的依赖"问题。**



而为了将一个依赖从所有与之关联的依赖集合中移除，就需要明确知道哪些依赖集合中包含了它。**为此，我们需要在 effect 内部定义新的 effectFn，并为其添加 effectFn.deps 数组，用来存储所有包含当前副作用函数的依赖集合：**

~~~js
// 当前真在执行的依赖，用于属性 getter 时的依赖收集
let activeEffect
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
  }
  // 用来存储所有于当前依赖相关联的依赖集合
  effectFn.deps = []
  // 执行副作用函数
  effectFn()
}
~~~

于是拦截响应式对象的”读取“操作时，就可以顺便收集 effectFn.deps 集合：

~~~js
function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // 完成 effectFn.deps 集合的收集
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}
~~~

有了这个联系之后，我们就可以在每次依赖执行时，根据 effectFn.deps 获取所有的依赖集合，进而将副作用函数从依赖集合中移除：

~~~js
let activeEffect
function effect(fn) {
  const effectFn = () => {
    // 完成清除工作
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  // 最后需要重置 effectFn.deps 数组
  effectFn.deps.length = 0
}
~~~



**注：effect 函数作为提供注册副作用函数的机制，与 vue 源码里的 watcher 类一致。**

### 3.嵌套副作用函数的问题

什么场景下会出现嵌套的 effect 呢？嵌套的 effect 常发生在组件嵌套中。比如：

~~~js
// 在一个 effect 中执行 Foo 组件的渲染函数
effect(() => {
  Foo.render()
})

// 当发生组件嵌套时：
const Bar = {
  render() { }
}
const Foo = {
  render() {
    return <Bar />
  }
}
  
// 于是就会发生：
effect(() => {
  Foo.render()
  // 嵌套
  effect(() => {
    Bar.render()
  })
})
~~~

为了实现 effect 的嵌套，我们需要一个副作用函数栈来存储不同的副作用函数。当一个副作用函数执行完毕后，将其从栈中弹出。当读取响应式数据的时候，被读取的响应式数据只会与当前栈顶的副作用函数建立响应联系，从而解决问题。

~~~js
let activeEffect
const effectStack = []

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.deps = []
  effectFn()
}
~~~

这样依赖，响应式数据只会收集直接读取其值的副作用函数作为依赖，从而避免错乱。







### 4.副作用函数无限调用自身导致栈溢出

~~~js
// 下列操作会无限调用自身导致栈溢出
effect(() => obj.foo++)

// 原因是自增操作包含了"读取"和"设置"操作
// obj.foo++ -> obj.foo = obj.foo + 1
~~~

这样会导致该副作用函数正在执行，并且还没有执行完毕就要开始下一次执行了（由“设置”操作引发）。于是导致无限调用自身。为了解决这个问题，只需在重新执行依赖时，**添加守卫条件即可**。

~~~js
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => effectFn())
}
~~~





### 5.响应式系统的调度器

**:white_check_mark: 一句话总结：响应式系统的调度器是指响应式数据变化触发依赖重新执行时，程序外部可以决定依赖的执行时机、次数和方式等。**

**:white_check_mark: 它的实现原理是：设计一个选项参数，然后在内部判断如果存在调度参数，那么就将依赖传递给调度器，并由调度器去决定该依赖如何执行。**

--------------

所谓的可调度性，指的是当 trigger 动作触发依赖重新执行时，有能力决定副作用函数执行的时机、次数以及方式。

为此，我们可以为 effect 函数设计一个**“选项参数”** options，允许用户指定调度器：

~~~js
effect(
	() => {
    console.log(obj.foo)
  },
  {
    scheduler(fn) {
      // ...
    }
  }
)
~~~

接下来，我们在     

~~~js
function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => {
    // 优先判断该副作用函数是否存在调度器
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })
}
~~~

如上所示，我们优先判断该副作用函数是否存在调度器，如果存在，那么直接调用调度器函数，并把当前副作用函数作为参数传递过去，由用户自己控制如何执行。

有了调度器的设计，我们就可以完成异步一次性更新所有 DOM 的修改操作的功能了。

~~~js
const jobQueue = new Set()
const p = Promise.resolve()

let isFlushing = false
function flushJob() {
  if (isFlushing) return
  // 将 isFlushing 置为 true，于是在当前事件循环内，无论后续调用多少次更新函数，都只会执行一次
  isFlushing = true
  p.then(() => {
    jobQueue.forEach(job => job())
  }).finally(() => {
    isFlushing = false
  })
}

effect(() => {
  // ...
}, {
  scheduler(fn) {
    jobQueue.add(fn)
    // 异步更新操作
    flushJob()
  }
})
~~~





## computed

**:white_check_mark: 一句话总结：computed 的实现原理就是实例化 watcher 的时候传入 lazy 选项，那么 watcher 就不会去执行副作用函数，而是当读取 computed 值的时候再去执行副作用函数（懒执行）。并且通过闭包 dirty 来实现缓存，只有当 dirty 为 true 的时候才重新计算（缓存）。**

### 1.懒执行

我们先来看可以懒执行的 effect：

~~~js
effect(
	() => {
    console.log(obj.foo)
  },
  // options
  {
    lazy: true
  }
)
~~~



~~~js
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  effectFn.options = options
  effectFn.deps = []
  // 只有非 lazy 的时候才执行副作用函数
  if (!options.lazy) {
    effectFn()
  }
  // 否则将副作用函数作为返回值返回
  return effectFn
}
~~~

可以看到，当添加了 `lazy: true` 选项时，我们调用 effect 来注册副作用函数时，可以拿到对应的副作用函数，这样我们就能手动执行该副作用函数了。

并且，我们可以把通过 effect 注册的副作用函数看作是一个 getter，那么经过懒执行后就会把它返回出去：

~~~js
function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.options = options
  effectFn.deps = []
  if (!options.lazy) {
    effectFn()
  }
  return effectFn
}
~~~

现在我们可以实现懒执行的副作用函数了：

~~~js
function computed(getter) {
  // 把 getter 函数看作是一个副作用函数并且创建一个 lazy 的 effect
  const effectFn = effect(getter, {
    lazy: true
  })
  
  const obj = {
    // 当读取 value 时才执行 effectFn
    get value() {
      return effectFn()
    }
  }
  
  return obj
}
~~~

可以看到 computed 函数的执行会返回一个对象，该对象的 value 属性是一个访问器属性，只有当读取 value 的值时，才会执行 effectFn 并将其结果作为返回值返回。



### 2.缓存

目前我们的计算属性只实现了懒执行，接下来继续实现缓存功能。

~~~js
function computed(getter) {
  // value 用来缓存上一次计算的值
  let value
  // dirty 标志，用来标识是否需要重新计算值，为 true 则意味着"脏"，需要计算
  let dirty = true
  
  const effectFn = effect(getter, {
    lazy: true
  })
  
  const obj = {
    get value() {
      // 只有"脏"的时候才重新计算值，否则直接使用缓存值
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      return value
    }
  }
  return obj
}
~~~

最后我们只需要在计算属性依赖的响应式数据改变时，将 dirty 置为 true 即可。

~~~js
function computed(getter) {
  let value
  let dirty = true
  
  const effectFn = effect(getter, {
    lazy: true,
    // 当响应式数据改变触发 effect 重新执行时，就会将 dirty 置为 true
    scheduler() {
      dirty = true
    }
  })
  
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      return value
    }
  }
  return obj
}
~~~





## watch

**:white_check_mark: 一句话总结：watch 本质上就是观测一个响应式数据，当数据发生变化时，通知并执行相应的回调。**

**:white_check_mark: 它的实现依赖响应式系统的调度器，将回调放在调度器里执行，并且在调度器里记录新值和旧值传给回调。**

它有两个参数：

:one: **立即执行 immediate**——`watch` 默认是懒执行的：仅当数据源变化时，才会执行回调。但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。(它的实现原理就是调度器判断有 lazy 参数，那么默认不执行副作用函数)

:two: **控制回调的执行时机 flush**——如sync：当响应式数据发送变化后，触发了 `watcher.update()`，只是把这个 `watcher` 推送到一个队列中，在 `nextTick` 后才会真正执行 `watcher` 的回调函数。而一旦我们设置了 `sync`，就可以同步执行 `watcher` 的回调函数。（它的实现原理就是副作用函数通过调度器来执行，而调度器判断存在 sync ，那么立即执行回调即可)



------------



~~~js
watch(obj, () => {
  console.log('数据变了')
})

obj.foo++
~~~

watch 的实现本质上就是利用了 effect 以及 options.scheduler 选项。

在一个副作用函数（渲染 watcher）中访问响应式数据 obj.foo，副作用函数与响应式数据之间就会建立起联系，当响应式数据变化时，会触发副作用函数的重新执行。

但存在 scheduler 选项时例外，此时响应式数据变化时，会触发 scheduler 调度函数的执行，而非直接触发副作用函数的执行。

~~~js
function watch(source, cb) {
  effect(
  	// 递归地触发读取操作
    () => traverse(source),
    {
      scheduler() {
        // 当数据变化时，调用回调 cb
        cb()
      }
    }
  )
}

function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) return
  // 添加到 set 里避免无限循环
  seen.add(value)
  // 暂不考虑数组等其他结构
  for (const k in value) {
    traverse(value[k], seen)
  }
  return value
}
~~~

此外，watch 函数除了可以观测响应式数据，还可以接收一个 getter 函数，并且在回调函数中得到变化前后的值：

~~~js
watch(
	// getter 函数
  () => obj.foo,
  (newValue, oldValue) => {
    console.log(newValue, oldValue) // 2, 1
  }
)
obj.foo++
~~~

实现这个功能需要充分利用 lazy 选项：

~~~js
function watch(source, cb) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  
  let oldValue, newValue
  // 使用 effect 注册副作用函数时，开启 lazy 选项，并把返回值存储到 effectFn 中以便后续手动调用
  const effectFn = effect(
  	() => getter(),
    {
      lazy: true,
      scheduler() {
        // 在 sheduler 中重新执行副作用函数，得到的值是新值
        newValue = effectFn()
        cb(newValue, oldValue)
        // 更新旧值
        oldValue = newValue
      }
    }
  )
  // 手动调用副作用函数，拿到的值就是旧值
  oldValue = effectFn()
}
~~~

从上面的实现中，我们发现 watch 的本质其实就是对 effect 的二次封装。

### 1.立即执行回调

接下来继续看 watch 的一个特性：可以在创建 watch 时立即执行回调函数。

~~~js
watch(obj, () => {
  console.log('变化了')
}, {
  // 回调函数会在 watch 创建时立即执行一次
  immediate: true
})
~~~

因为回调函数的立即执行与后续执行本质上没有任何差别，所有我们只需把 scheduler 调度函数封装成一个通用函数，再加一个判断即可实现。

~~~js
function watch(source, cb) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  
  let oldValue, newValue
  
  // 提取 scheduler 调度函数为一个独立的 job 函数
  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }
  
  const effectFn = effect(
  	() => getter(),
    {
      lazy: true,
      scheduler: job
    }
  )
  
  if (options.immediate) {
    // 当 immediate 为 true 时立即执行 job，从而触发回调执行
    job()
  } else {
    oldValue = effectFn()
  }
}
~~~

这样就实现了回调函数的立即执行功能，并且此时回调函数的 oldValue 值为 undefined。











### 2.控制回调的执行时机

可以这样使用 watch：

~~~js
watch(obj, () => {
  console.log('变化了')
}, {
  // 回调函数会被放在一个微任务队列里，并等待DOM更新结束后再执行
  flush: 'post' // 还可以指定为 'pre' | 'sync'
})
~~~

其实现原理如下：

~~~js
function watch(source, cb) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  
  let oldValue, newValue
  
  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }
  
  const effectFn = effect(
  	() => getter(),
    {
      lazy: true,
      scheduler: () => {
        // 在调度函数中判断 flush 是否为 'post'，如果是，将其放入微任务队列中执行
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )
  
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}
~~~

除此之外，flush 的值还可以指定为 'pre'，即回调函数会在 watch 创建时立即执行一次。



### 3.过期的副作用函数

在日常开发中，我们可能会遇到竞态问题：

假设我们第一次修改 obj 对象的某个字段值，导致回调函数的执行，并发送请求A，需要 3s 才能传回结果；这时，我们再次修改了 obj 对象的某个字段值，导致回调函数的执行，并发送请求B，只需要 1s 就能传回结果。因为 请求 B 先于请求 A 返回结果，就会导致最终 finalData 中存储的是请求 A 的结果。

我们对这个问题进行总结。请求 A 是回调函数第一次执行所产生的副作用，请求 B 是回调函数第二次执行所产生的副作用。由于请求 B 后发生，所以请求 B 的结果应该被视为”最新“的，而请求 A 的结果应该”过期“。

于是我们需要一个可以让副作用过期的手段。

在 vue.js 中，watch 函数的回调函数接收第三个参数 onInvalidate，它是一个函数，我们可以使用 onInvalidate 函数注册一个回调，这个回调函数会在当前副作用函数过期时执行：

~~~js
watch(obj, async(newValue, oldValue, onInvalidate) => {
  let expired = false
  onInvalidate(() => {
    // 当过期时，将 expired 设置为 true
    expired = true
  })
  
  const res = await fetch('/path/to/request')
  
  if (!expired) {
    finalData = res
  }
})
~~~

这个功能如何实现的呢？

其实很简单，在 watch 内部每次检测到变更后，在副作用函数重新执行之前，会先调用我们通过 onInvalidate 函数注册的过期回调，仅此而已。

~~~js
function watch(source, cb) {
  let getter
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }
  
  let oldValue, newValue
  
  // cleanup 用来存储用户注册的过期回调
  let cleanup
  
  function onInvalidate(fn) {
    // 将过期回调存储到 cleanup 中
    cleanup = fn
  }
  
  const job = () => {
    newValue = effectFn()
    // 在调用回调函数 cb 之前，先调用过期回调
    if (cleanup) {
      cleanup();
    }
    cb(newValue, oldValue, onInvalidate)
    oldValue = newValue
  }
  
  const effectFn = effect(
  	() => getter(),
    {
      lazy: true,
      scheduler: () => {
        if (options.flush === 'post') {
          const p = Promise.resolve()
          p.then(job)
        } else {
          job()
        }
      }
    }
  )
  
  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}
~~~

通过一个例子来进一步说明：

~~~js
watch(obj, async(newValue, oldValue, onInvalidate) => {
  let expired = false
  onInvalidate(() => {
    expired = true
  })
  
  const res = await fetch('/path/to/request')
  
  if (!expired) {
    finalData = res
  }
  
  // 第一次修改
  obj.foo++
  setTimeout(() => {
    // 200ms 后第二次修改
    obj.foo++
  }, 200)
})
~~~

如上代码所示，第一次修改时立即执行的。这会导致 watch 的回调函数执行。由于我们在回调函数内调用了 onInvalidate，所以会注册一个过期的回调，接着发送请求A。假设请求A 需要 1000ms 才能返回结果，而我们在 200ms 时第二次修改了 obj.foo 的值，这又会导致watch 的回调函数执行。这时，因为我们已经注册过了过期的回调，所以在 watch 的回调函数第二次执行之前，会优先执行之前的过期回调，这会使得第一次执行的副作用函数内闭包的变量 expored 的值为 true，即副作用函数的执行过期了。于是等请求 A 的结果返回时，其结果会被抛弃。









# 对象的响应式方案——reactive

## 浅响应和深响应

即 reactive 与 shallowReactive。先看==浅响应==，即修改深层嵌套的属性，不能触发响应：

~~~js
const obj = reactive({ foo: { bar: 1 } });

effect(() => {
  console.log(obj.foo.bar);
})

obj.foo.bar = 2; // 修改 obj.foo.bar 的值，并不能触发响应
~~~

-----

**:white_check_mark: 一句话总结：深浅响应的实现是通过 Proxy 代理数据时，当用户读取响应式对象属性值时，如果需要深响应，那么判断属性值是否为对象类型，如果是的话将属性值递归地包装成响应式对象。**

---------------

### 深响应reactive 

为了实现深响应，需要对 Reflect.get 的返回结果做一层包装。当读取属性值时，我们首先检查该值是否是对象，如果是对象，那么递归地对属性值进行响应式封装：

~~~js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }
      track(target, key);
      const res = Relect.get(target, key, receiver);
      // 当读取属性值时，检查该值是否是对象，如果是对象，那么递归地对属性值进行响应式封装
      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }
      return res;
    }
  })
}
~~~

------------

### 浅响应shallowReactive

然而，并非所有情况下我们都希望深响应，这就催生了 shallowReactive，即浅响应。其实现如下：

~~~js
// 封装 createReactive 函数，接收一个参数 isShallow，代表是否为浅响应，默认为否
function createReactive(obj, isShallow = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }
      
      const res = Relect.get(target, key, receiver);
      
      track(target, key);
      
      // 浅响应则直接返回
      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }
      return res;
    }
  })
}
~~~

现在可以轻松实现 reactive 与 shallowReactive 了。

~~~js
function reactive(obj) {
  return createReactive(obj);
}

function shallowReactive(obj) {
  return createReactive(obj, true);
}
~~~



## 深只读与浅只读

即 readonly 与 shallowReadonly。先来看看数据只读是什么情况：

~~~js
const obj = readonly({ foo: 1 });
// 尝试修改数据，会得到警告
obj.foo = 2;
~~~

对于一个对象来说，只读意味着既不可以设置对象的属性值，也不可以删除对象的属性。这样就实现了对数据的保护，例如组件接收到的 props 对象应该是一个只读数据[^1]。

---------

### 浅只读shallowReadonly

如何实现呢？实际上，我们只需做一个只读的判断即可：

~~~js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    set(target, key, newVal, receiver) {
      // 添加只读判断
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }

      const oldVal = target[key];
      const type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD';
      const res = Reflect.set(target, key, newVal, receiver);
      if (target === receiver.raw) {
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          trigger(target, key, type);
        }
      }
      return res
    },
    deleteProperty(target, key) {
      // 添加只读判断
      if (isReadonly) {
        console.warn(`属性 ${key} 是只读的`);
        return true;
      }
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      
      if (res && hadKey) {
        trigger(target, key, 'DELETE');
      }
      
      return res;
    }
  })
}
~~~



并且，如果一个数据是只读的，那就意味着任何方式都无法修改它。因此，没有必要为只读数据建立响应联系。

~~~js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }
    	// 非只读的时候才需要建立响应联系
      if (!isReadonly) {
        track(target, key);
      }
      
      const res = Relect.get(target, key, receiver);
      
      track(target, key);

      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        return reactive(res);
      }
      return res;
    }
  })
}
~~~

### 深只读readonly 

上面实现的 readonly 是浅只读的，为了实现深只读，需要对类型是对象的属性值递归的做只读封装：

~~~js
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target;
      }

      if (!isReadonly) {
        track(target, key);
      }
      
      const res = Relect.get(target, key, receiver);
      
      track(target, key);

      if (isShallow) {
        return res;
      }

      if (typeof res === 'object' && res !== null) {
        // 如果数据只读，则调用 readonly 对值进行包装
        return isReadonly ? readonly(res) : reactive(res);
      }
      return res;
    }
  })
}
~~~

 于是，readonly 和 shallowReadonly 就实现完毕了：

~~~js
function readonly(obj) {
  return createReactive(obj, false, true);
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true);
}
~~~



[^1]: props本质上是父组件的状态， 当props发生变化时，会触发父组件自更新。在更新过程中，渲染器发现父组件的组件实例中的 subTree 包含组件类型的虚拟节点，所以会调用 patchComponent 完成子组件的更新。这个过程称为子组件的被动更新。当发生被动更新时，只需检查并更新props等即可。当子组件的 props 更新时，因为 instance.props 对象本身时浅响应的，因此会触发组件重新渲染。这就是为什么 props 是只读的，但又能触发组件更新的原因。







# 原始值的响应式方案——Ref

> 1. 因为原始值是按值传递的，这意味着如果一个函数接收原始值作为参数，那么形参和实参之间没有引用关系，他们是两个完全独立的值，对形参的修改不会影响实参。
> 2. 并且 **Proxy 不能对原始值进行代理。**

**:white_check_mark: 因此，想要将原始值变成响应式数据，就必须使用一个非原始值去 “包裹” 原始值，然后使用 proxy 代理这个非原始值。**

~~~js
const wrapper = {
  value: 'vue';
}
// 使用 proxy 代理 wrapper，间接实现对原始值的拦截
const name = reactive(wrapper);
console.log(name.value); // vue
name.value = 'vue3' // 修改值可以触发响应
~~~

为了统一和规范，可以封装成一个函数， 即 ref ：

~~~js
function ref(val) {
  const wrapper = {
    value: val;
  }
  // 使用 Object.defineProperty 在 wrapper 对象上定义一个不可枚举属性 __v_isRef，并且值为 true，用来区分一个数据是不是 ref
  Object.defineProperty(wrapper, '__v_isRef', {
    value: true;
  })
  
  return reactive(wrapper);
}
~~~

## ref解决响应丢失问题

**ref 除了能够用于原始值的响应式方案之外，还能用来解决响应丢失问题。**

首先来看什么是响应丢失问题：

~~~js
export default {
  setup() {
    // 响应式数据
    const obj = reactive({ foo: 1, bar: 2 });
    
    //将数据暴露到模板中
    return {
      ...obj;
    }
  }
}
~~~

接着，我们就可以在模板中访问从 setup 中暴露出来的数据：

~~~vue
<template>
	<p>{{ foo }} / {{ bar }}</p>
</template>
~~~

然而，这样做会导致响应丢失。其表现是，当我们修改响应式数据的值时，不会触发重新渲染：

~~~js
export default {
  setup() {
    // 响应式数据
    const obj = reactive({ foo: 1, bar: 2 });
    
    // 1s 后修改响应式数据的值，不会触发重新渲染
    setTimeout(() => {
      obj.foo = 100;
    }, 100)
    
    return {
      ...obj;
    }
  }
}
~~~

---------

**为什么会导致响应丢失呢？**

这是由于展开运算符“...”导致的：

~~~js
return {
  ...obj;
}

// 等价于:
return {
  foo: 1,
  bar: 2
}
~~~

可以发现，这其实就是返回一个普通对象。它不具有任何响应式能力。

如何解决这个问题呢？我们只需要封装一层代理转发功能的函数即可：

~~~js
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key];
    }
  }
  return wrapper; 
}

// 使用
const newObj = {
  foo: toRef(obj, 'foo'),
  bar: toRef(obj, 'bar')
}
~~~

同时，为了能够批量完成转换，可：

~~~js
function toRefs(obj) {
  const ret = {};
  // 使用 for...in 循环遍历对象
  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }
  return ret;
}
~~~

现在，我们可以一步到位完成对一个对象的转换：

~~~js
const newObj = { ...toRefs(obj) };
~~~

为了 toRef 的完整性，还需要设置 getter 转发等：

~~~js
function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key];
    }
    // 允许设置值
    set value(val) {
      obj[key] = val;
    }
  }

	Object.defineProperty(wrapper, '__v_isRef', {
    value: true
  })

  return wrapper; 
}
~~~

可以看到最终设置的是响应式数据的同名属性的值，这样就能正确触发响应了。



## 自动脱 ref

toRefs 函数的确解决了响应丢失问题，但同时也带来了新的问题。由于 toRefs 会把响应式数据的第一层属性值转换为 ref，因此必须通过 value 属性访问值。如下：

~~~vue
<p>{{ foo.value }} / {{ bar.value }}</p>
~~~

这其实增加了心智负担。为此，我们需要自动脱 ref 的能力。即读取一个 ref 数据时，应该能直接读取到。如下：

~~~vue
<p>{{ foo }} / {{ bar }}</p>
~~~

要想实现这个功能，只需在读取数据时增加一层判断，如果是 ref 数据，那么返回 value.value 即可：

~~~js
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      // 自动脱 ref 实现：如果读取的值时 ref，则返回它的 value 属性值
      return value.__v_isRef ? value.value : value;
    }
  })
}
~~~

实际上，组件中的 setup 函数所返回的数据就会传递给 proxyRefs 函数进行脱 ref。

并且不光读取属性的值有自动脱 ref 的能力，设置属性的值也应该有：

~~~js
function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      return value.__v_isRef ? value.value : value;
    },
    set(target, key, newValue, receiver) {
      // 通过 target 读取真实值
      const value = target[key];
      // 如果值是 ref，则设置其对应的 value 的属性值
      if (value.__v_isRef) {
        value.value = newValue;
        return true;
      }
      return Reflect.set(target, key, newValue, receiver);
    }
  })
}
~~~











# 组件的实现原理

在vue.js中，我们使用虚拟dom来描述最终呈现。但当我们编写比较复杂的页面时，用来描述页面结构的虚拟DOM的代码量会变得越来越多，或者说页面模板会变得越来越大。

这时，我们就需要组件化的能力。实际上，组件本身是对页面内容的封装，它用来描述页面内容的一部分。



## 自更新与异步更新机制

**当组件自身状态发生变化时，我们需要组件能够自更新。为此我们需要将整个渲染任务（render、patch等）包装到一个 effect 中。这样，一旦组件自身的响应式数据发生变化，组件就会自动重新执行渲染函数，从而完成更新。**

但是，**由于 effect 的执行是同步的，这样会导致多次修改响应式数据的值，渲染函数也会随之执行多次。**这实际上是没必要的。

**为此，vue.js设计了一个异步更新机制，以使得无论对响应式数据进行多少次修改，副作用函数都只会执行一次。这个机制实现了一个调度器，当effect执行时，vue.js不会马上执行它，而是将它缓冲到一个微任务队列中。**有了这个缓存机制，我们就可以对任务进行批处理、去重（set），从而避免多次执行副作用函数带来的性能开销。



## 组件实例

为了patch时有参照对象进行增量更新，我们需要实现组件实例，用来维护组件整个生命周期的状态，这样渲染器能够再正确的时机执行合适的操作。

组件实例本质上是一个状态集合（对象），它维护着组件运行过程中的所有信息，比如注册到组件的生命周期函数、组件渲染的子树（subTree）、组件是否已经被挂载、组件自身的状态（data）等。



## props与子组件的被动更新

在虚拟dom层面，组件的props与普通HTML标签的属性差别不大。

**props本质上是父组件的状态， 当props发生变化时，会触发父组件自更新。在更新过程中，渲染器发现父组件的组件实例中的 subTree 包含组件类型的虚拟节点，所以会调用 patchComponent 完成子组件的更新。这个过程称为子组件的被动更新。**

当发生被动更新时，只需检查并更新props等即可。当子组件的 props 更新时，因为 instance.props 对象本身是浅响应的，因此会触发组件重新渲染。



## setup函数

setup函数主要用于配合组合式API，为用户提供一个用于建立组合逻辑、创建响应式数据、创建通用函数、注册生命周期钩子等的地方。

在组件整个生命周期中，**setup函数只会在被挂载时执行一次**，它的返回值可以有两种情况。

1. 返回一个函数，该函数将作为组件的render函数
2. 返回一个对象，其中包含的数据暴露给模板使用

同时，setup函数接收两个参数，第一个参数为外部传递进来的props数据对象，第二个参数是setupContext对象，其中保存着与组件接口相关的数据和方法。（slots、emit、attrs、expose）



# 异步组件

即以异步的方式加载并渲染一个组件。

~~~js
// 同步
import App from 'App.vue';
createApp(App).mount('#app');
~~~

~~~js
// 异步
const loader = () => import('App.vue');
loader().then(App => {
  createApp(App).mount('#app');
})
~~~

使用动态导入语句import()来加载组件，它会返回一个Promise实例。组件加载成功后，会调用createApp并完成挂载。这样就实现了以异步的方式来渲染页面了。



# 内置组件

## keepalive组件

keepalive的本质是缓存管理，在加上特殊的挂载/卸载逻辑。

### 挂载/卸载

挂载一个被keepalive的组件时，它并不会真的被卸载，而会被移动到一个隐藏容器中。当重新”挂载“该组件时，它也不会被真的挂载，而是被从隐藏容器中取出，再搬运到原来的容器中。这个过程对应到组件的activated和deactivated生命周期中。

### 缓存管理

通过 Map 保存用于描述组件的 vnode 对象，由于用于描述组件的 vnode 对象存在着对组件实例的引用（即 vnode.component 属性），因此缓存用于描述组件的 vnode 对象，就等价于缓存了组件实例。

缓存策略LRU略。



## Teleport组件

该组件会直接把它的插槽内容渲染到body下，而不会按照模板的dom层级渲染，这样就实现了跨层级渲染。



## Transition组件

过渡组件的实现原理是：

1. 当dom元素被挂载时，将动效附加到该dom元素上
2. 当dom元素被卸载时，不要立即卸载dom元素，而是等到附加到该dom元素上的动效执行完成后再卸载它



### 原生dom的过渡

过渡效果本质上是一个dom元素在两种状态间的切换，浏览器会根据过渡效果自行完成DOM元素的过渡。

先看一个例子：

~~~html
<div class="box"></div>
<style>
  .box {
    width: 100px;
    height: 100px;
    background-color: red;
  }
</style>
~~~

现在我们要为元素添加一个进场动效。我们可以这样描述该动效：从距离左边200px的位置在1秒内运动到距离左边0px的位置。可以用下面的样式来描述：

~~~css
/* 初始状态是距离左边200px */
.enter-from {
  transform: translateX(200px);
}
/* 结束状态是距离左边0px */
.enter-to {
  transform: translateX(0);
}
/* 运动过程：持续时长、运动曲线 */
.enter-active {
  transition: transform 1s ease-in-out;
}
~~~

进下来我们就可以为dom元素添加进场动效了：

~~~js
const el = document.createElement('div');
el.classList.add('box');

el.classList.add('enter-from');
el.classList.add('enter-active');

document.body.appendChild(el);
~~~

经过以上步骤，元素的初始状态会生效，页面渲染的时候会将DOM元素以初始状态所定义的样式进行展示。接下来切换元素状态，并产生过渡动效。理论上我们可以：

~~~js
const el = document.createElement('div');
el.classList.add('box');

el.classList.add('enter-from');
el.classList.add('enter-active');

document.body.appendChild(el);

el.classList.remove('enter-from');
el.classList.add('enter-to');
~~~

然而，实际情况是，浏览器会在当前帧绘制DOM元素，因此最终只会绘制enter-to这个样式，而不会绘制enter-from。

为了解决这个问题，需要在下一帧执行状态切换。可以使用`requestAnimationFrame`注册一个回调函数，该回调函数理论上会在下一帧执行。

因此我们可以：

~~~js
const el = document.createElement('div');
el.classList.add('box');

el.classList.add('enter-from');
el.classList.add('enter-active');

document.body.appendChild(el);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    el.classList.remove('enter-from');
		el.classList.add('enter-to');
  })
})
~~~

最后，当过渡完成后，移除相关类即可。

~~~js
el.addEventListener('transitioned', () => {
  el.classList.remove('enter-to');
  el.classList.remove('enter-active');
})
~~~

那么离场动效呢？离场动效发生在DOM元素被卸载的时候。

具体实现思路：当元素被卸载时，不要将其立即卸载，而是等待过渡效果结束后再卸载它。为了实现这个目标，我们需要把用于卸载DOM元素的代码封装到一个函数中，该函数会等待过渡结束后调用。

~~~js
// 假设点击元素，该元素就会被卸载
el.addEventListener('click', () => {
  // 将卸载动作封装到 performRemove 函数中
  const performRemove = () => el.parentNode.removeChild(el);
  
  el.classList.add('leave-from');
  el.classList.add('leave-active');
  //强制 reflow: 使初始状态生效
  document.body.offsetHeight;
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.remove('leave-from');
      el.classList.add('leave-to');
      // 收尾工作
      el.addEventListener('transitionend', () => {
        el.classList.remove('leave-to');
        el.classList.remove('leave-active');
        // 执行移除DOM回调
        performRemove();
      })
    })
  })
})
~~~

整个过程抽象为以下几个阶段：

1. beforeEnter阶段：添加enter-from和enter-active类
2. enter阶段：在下一帧移除enter-from类，添加enter-to
3. 进场动效结束：移除enter-to和enter-active





# 编译器

编译器将源代码翻译为目标代码的过程叫做编译。

完整的编译过程通常包括词法分析、语法分析、语义分析、中间代码生成、优化、目标代码生成等步骤。

整个编译过程分为编译前端和编译后端。编译前端包含词法分析、语法分析和语义分析，它通常与目标平台无关，仅负责分析源代码。编译后端则通常和目标平台有关，编译后端涉及中间代码生成、优化、目标代码生成。



------------

vue 的模板编译器的目标代码其实就是渲染函数。详细而言：

1. vue.js 模板编译器会首先对模板进行词法分析和语法分析，得到模板 AST；
2. 接着将模板 AST 转换成 JavaScript AST；
3. 最后根据 JavaScript AST 生成 JavaScript 代码，即渲染函数代码。

![image-20220906212548246](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220906212548246.png)

--------

我们可以通过封装 parse 函数来完成对模板的词法分析和语法分析，得到模板 AST。

有了模板 AST 后，我们就可以对其进行语义分析。如分析属性值是否是静态的，是否是常量等。

接着我们还需要将模板 AST 转换为 JavaScript AST，因为 Vue.js 模板编译器的最终目标是生成渲染函数，而渲染函数本质是 JavaScript 代码，所有我们需要将模板 AST 转换成用于描述渲染函数的 JavaScript AST，可以封装 transform 函数来完成转换工作。

而有了 JavaScript AST 后，我们就可以根据它生成渲染函数了，这一步可以通过封装 generate 函数来完成。

![image-20220906213841126](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220906213841126.png)



----------



## parse原理

解析器 parse 的入参是字符串模板，解析器会逐个读取字符串模板中的字符，并根据一定的规则将整个字符串切割为一个个 Token[^1]。

例如，假设有这样一段模板：

~~~html
<p>Vue</p>
~~~

解析器会把这段字符串模板切割为三个 Token。

~~~
开始标签：<p>
文本节点：Vue
结束标签：</p>
~~~

那么，解析器是如何切割的呢？事实上是通过“有限状态机”来实现的。

所谓“有限状态”，就是指有限个状态，而“自动机”意味着随着字符的输入，解析器会自动地在不同状态间迁移。























# 编译优化

~~~html
<div id="foo">
  <p class="bar">{{ text }}</p>
</div>
~~~

在这段模板中，当响应式数据 text 变化时，会产生一颗新的虚拟DOM树，传统diff算法对比新旧两颗虚拟DOM树的过程如下：

+ 对比 div 节点，以及该节点的属性和子节点
+ 对比 p 节点，以及该节点的属性和子节点
+ 对比 p 节点的文本子节点，如果文本子节点的内容变了，则更新

:white_check_mark: 这样**对比两颗 DOM 树会产生很多无意义的比对操作，如果能够跳过这些无意义的操作，性能将会大幅提升。**而这就是编译优化的思路来源。

实际上，模板的结构非常稳定。并且通过编译手段，可以分析出很多关键信息，例如哪些节点是静态的，哪些节点是动态的。结合这些信息，编译器可以直接生成原生DOM操作的代码。

vue.js3 的编译器会将编译得到的关键信息放在它生成的虚拟DOM上，最终渲染器根据这些关键信息避开无意义操作。

--------

**一句话总结：有很多节点在编译阶段就能确定它不会改变的，称为静态节点。编译优化的目标就是跳过对静态节点的操作。**

---------

## Block和PatchFlags

**PatchFlag**（补丁标志），虚拟节点的属性，**用来标志动态节点**。

~~~js
const PatchFlags = {
  TEXT: 1; // 代表节点有动态的 textContent
  CLASS: 2; // 代表元素有动态的 class 绑定
  STYLE: 3; // 代表元素有动态的 style 绑定
  ……
}
~~~



有了这项信息，**就可以在虚拟节点的创建阶段，把它的动态子节点提取出来，并将其存储到虚拟节点的 dynamicChildren 数组内**。并且，我们把带有该属性的虚拟节点称为 Block。

注意：

1. 一个 Block 不仅能够收集它的直接动态子节点，还能够收集所有动态子代节点
2. 所有模板的根节点，以及带有v-for、v-if/v-else-if/v-else 等指令的都是 Block 节点

有了 Block 之后，渲染器的更新操作将会以 Block 为维度。也就是说，**当渲染器在更新一个 Block 时，会忽略虚拟节点的 children 数组，直接通过 dynamicChildren 数组更新其中的动态节点。**

同时，由于动态节点中存在 PatchFlag ，所以在更新动态节点的时候，也能做到靶向更新。

~~~js
function patchElement(n1, n2) {
  if (n2.patchFlags) {
    // 靶向更新
    if(n2.patchFlags === 1) {
      // 只需要更新 class
    } else if (n2.patchFlags === 2) {
      // 只需要更新 style
    } else if (...) {
               
    }
  }
  
  patchChildren(n1, n2, el);
}
~~~

可以看到，通过检测 patchFlag 实现了 props 的靶向更新。这样就避免了全量的 props 更新，从而最大化地提升性能。





## 静态提升

 :white_check_mark: **当响应式数据变化时，渲染函数重新执行，并产生新的虚拟DOM树。在这个过程中，纯静态的虚拟节点在渲染函数重新执行的时候也会被重新创建。但这是没有必要。**

:white_check_mark: **解决这个问题的办法就是静态提升。即把纯静态的节点提升到渲染函数之外，在渲染函数内只会持有对静态节点的引用。**

当响应式数据变化时，渲染函数重新执行时，并不会重新创建静态的虚拟节点，从而避免了额外的性能开销。

~~~js
const hoist1 = createVNode('p', null, 'text');

function render() {
  return (openBlock(), createBlock('div', null, [
    hoist1, createVNode('p', null, ctx.title, 1/* TEXT */)
  ]))
}
~~~

需要注意的是，这个静态提升是以树为单位。如果这颗DOM树中包含动态绑定的内容，那么整棵树都不会被提升。同时，虽然节点本身不会提升，但该动态节点上仍然可能存在静态的属性，该属性也可以被提升。

~~~js
const hoistProp = { foo: 'bar', a: 'b'};

function render(ctx) {
  return (openBlock(), createBlock('div', null, [
    createVNode('p', null, hoistProp, ctx.text)
  ]))
}
~~~





## 预字符串化

在静态提升的基础上，对静态节点序列化为字符串，并生成一个Static类型的VNode，进一步减少性能开销。



## 缓存内联事件处理函数

比如下列模板内容：

~~~vue
<Comp @change="a + b" />
~~~

对其进行编译时：

~~~js
function render(ctx) {
  return h(Comp, {
    // 内联事件处理函数
    onChange: () => (ctx.a + ctx.b)
  })
}
~~~

显然，每次重新执行render函数时，（即重新渲染时），都会重新创建一次函数，也即是会重新创建一个 props 对象。这会导致渲染器对 Comp 组件进行更新，造成额外的性能开销。

为此我们可以将内联事件处理函数缓存下来：

~~~js
function render(ctx, cache) { // cache 数组来自组件实例
  return (openBlock(), {
    // 将内联事件处理函数缓存到 cache 数组中
    onChange: cache[0] || (cache[0] = ($event) => (ctx.a + ctx.b))
  })
}
~~~

这样，无论执行多少次渲染函数，props 对象中 onChange 属性的值始终不变，于是就不会触发 Comp 组件的更新了。



## v-once指令

v-once可以缓存全部或部分虚拟DOM节点。比如：

~~~vue
<section>
	<div v-once>{{ foo }}</div>
</section>
~~~

这段模板中，虽然存在动态绑定的文本内容，但它被 v-once 指令标记，所以这段模板编译后会：

~~~js
function render(ctx, cache) { 
  return h(Comp, createBlock('div', null, [
    cache[1] || (cache[1] = createVNode('div', null, ctx.foo, 1 /* TEXT */)
  ]))
}
~~~

从编译结果可以看到，该 <div> 对应的虚拟节点被缓存到了 cache 数组中。**并且由于被缓存，意味着更新前后的虚拟节点不会发生变化，因此就不需要这些被缓存的虚拟节点参与Diff操作了。**

v-once 指令通常用于不会发生改变的动态绑定，例如绑定一个常量：

~~~html
<div v-once>{{ SOME_CONSTANT }}</div>
~~~





## 总结

以上优化内容本质上来说就是做静态分析，尽可能的在编译阶段就知道哪些东西会变，哪些东西不会变。于是就可以对不变的东西做下缓存，不需要更新的不更新。





































[^1]: token 可以视作词法记号。



























































