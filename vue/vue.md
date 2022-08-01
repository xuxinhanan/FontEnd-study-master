

# 一.Vue基础

## 1.vue的基本原理

当一个Vue实例被创建时，Vue会将data通过Object.defineProperty或者proxy进行响应式化，并且通过watcher将属性的相关依赖进行收集，之后当属性改变时，会通知watcher的依赖重新计算并更新视图。



## 2.双向绑定原理

**一、什么是双向绑定？**

我们先从单向绑定切入，单向绑定非常简单，就是把`Model`绑定到`View`，当我们用`JavaScript`代码更新`Model`时，`View`就会自动更新双向绑定就很容易联想到了，在单向绑定的基础上，用户更新了`View`，`Model`的数据也自动被更新了，这种情况就是双向绑定举个栗子：

当用户填写表单时，`View`的状态就被更新了，如果此时可以自动更新`Model`的状态，那就相当于我们把`Model`和`View`做了双向绑定。



**二、vue双向绑定原理**

由上面的例子知，双向绑定就是视图与数据的双向绑定。

因为 Vue 是数据双向绑定的框架，而整个框架的由三个部分组成：

- 数据层（Model）：应用的数据及业务逻辑，为开发者编写的业务代码；
- 视图层（View）：应用的展示效果，各类UI组件，由 template 和 css 组成的代码；
- 业务逻辑层（ViewModel）：框架封装的核心，它负责将数据与视图关联起来；

其中ViewModel的主要职责是：数据变化更新视图，视图变化更新数据。为了达成这个目的，Vue.js 采用**数据劫持**结合**发布者-订阅者模式**的方式，通过Object.defineProperty() / proxy来劫持各个属性的setter，getter，在数据变动时通知所有订阅者，触发相应的监听回调。

具体来说就是：

1. **实现一个监听器 Observer：** 对数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter。这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化。
2. **实现一个解析器 Compile：** 解析 Vue 模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图。
3. **实现一个订阅者 Watcher：** 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。
4. **实现一个订阅器 Dep：** 订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/4/11/162b38ab2d635662~tplv-t2oaga2asx-watermark.awebp)



## 





## 3.vue的生命周期

创建 --> 挂载（ -->更新 ） --> 卸载

+ **beforecreated**  el、data、message未被初始化，此时可用于loading

+ **created** 完成了data、message的初始化

+ **beforeMount** 完成了el和data的初始化 ,但是el还是 {{message}}，这里就是应用的 Virtual DOM（虚拟Dom）技术，先把坑占住了。

+ **mounted** 完成挂载，渲染值。

+ **beforeUpdate** 可以监听到data的变化但是view层没有被重新渲染，view层的数据没有变化

+ **updated** 等到updated的时候 view层才被重新渲染，数据更新。

  

![vue-lifecycle](C:\Users\64554\Desktop\FontEndInterview-master\image\vue-lifecycle.png)





















## 4.为什么data属性是一个函数而不是一个对象？

javascript中的对引用数据是按引用传递，因此操作对象时会根据引用地址找到内存中的对象进行操作。因此当创建多个组件实例并且data属性是一个对象的时候，这些组件实例的data将会引用同一个对象，就会导致一个data变化时，其他实例中的数据也会发送变化。造成组件之间相互干扰，难以正常运行。

为了避免产生这样的结果，应该将data写出函数的形式。数据以函数返回值的形式定义。这样当每次复用组件的时候，就会返回一个新的data，也就是说每个组件都有自己的私有数据空间。







## 5.Computed和Methods的区别

可以将同一函数定义为一个method或者一个计算属性。对于最终的结果，两种方式是相同的。

不同点：

+ computed：计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值。
+ method调用总会执行该函数。





## 5. Computed 和 Watch 的区别

**对于Computed：**

- 它支持缓存，只有依赖的数据发生了变化，才会重新计算

- 不支持异步，当Computed中有异步操作时，无法监听数据的变化

- computed的值会默认走缓存，计算属性是基于它们的响应式依赖进行缓存的，也就是基于data声明过，或者父组件传递过来的props中的数据进行计算的。

- 如果一个属性是由其他属性计算而来的，这个属性依赖其他的属性，一般会使用computed

- 如果computed属性的属性值是函数，那么默认使用get方法，函数的返回值就是属性的属性值；在computed中，属性有一个get方法和一个set方法，当数据发生变化时，会调用set方法。

**对于Watch：**

- 它不支持缓存，数据变化时，它就会触发相应的操作

- 支持异步监听

- 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值

- 当一个属性发生变化时，就需要执行相应的操作

+ 监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会触发其他操作，函数有两个的参数：

  + immediate：组件加载立即触发回调函数。

  + deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。

    

+ 当想要执行异步或者昂贵的操作以响应不断的变化时，就需要使用watch。



**总结：**

- computed 计算属性 : 依赖其它属性值，并且 computed 的值有缓存，只有它依赖的属性值发生改变，下一次获取 computed 的值时才会重新计算 computed 的值。
- watch 侦听器 : 更多的是**观察**的作用，**无缓存性**，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。



**运用场景：**

- 当需要进行数值计算,并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时都要重新计算。
- 当需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用 watch 选项允许执行异步操作 ( 访问一个 API )，限制执行该操作的频率，并在得到最终结果前，设置中间状态。这些都是计算属性无法做到的。



## 5. v-show 与 v-if 有什么区别

1. v-if 是真正的条件渲染，因为它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建；也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
2. v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 的 “display” 属性进行切换。
3. 所以，v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景；v-show 则适用于需要非常频繁切换条件的场景。





## 6.组件通信方式有哪些



![image-20220514192016433](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220514192016433.png)





## 7.谈谈你对 keep-alive 的了解？

keep-alive`是`vue`中的内置组件，能在组件切换过程中将状态保留在内存中，防止重复渲染`DOM。

`keep-alive` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。

![image-20220304102049023](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220304102049023.png)

**使用场景**

使用原则：当我们在某些场景下不需要让页面重新加载时我们可以使用`keepalive`

举个栗子:

当我们从`首页`–>`列表页`–>`商详页`–>`再返回`，这时候列表页应该是需要`keep-alive`

从`首页`–>`列表页`–>`商详页`–>`返回到列表页(需要缓存)`–>`返回到首页(需要缓存)`–>`再次进入列表页(不需要缓存)`，这时候可以按需来控制页面的`keep-alive`

在路由中设置`keepAlive`属性判断是否需要缓存。



## MVVM

MVVM 是 Model-View-ViewModel 缩写，**也就是把 MVC 中的 Controller 演变成 ViewModel(Vue 对象 就是 ViewModel)**。Model 层代表数据模型，View 代表 UI 组件，ViewModel 是 View 和 Model 层的桥梁，数据会绑定到 viewModel 层并自动将数据渲染到页面中，视图变化的时候会通知 viewModel 层更新数据。

## MVC 和 MVVM 区别

MVC 的思想：一句话描述就是 Controller 负责将 Model 的数据用 View 显示出来，换句话说就是在 Controller 里面把 Model 的数据赋值给 View，解耦。
MVVM 与 MVC 最大的区别就是：它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变（对应 Vue 数据驱动的思想）
为什么官方要说 Vue 没有完全遵循 MVVM 思想呢？
严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。

## 接口请求一般放在哪个生命周期中？

如果异步请求不需要依赖 Dom 推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：
能更快获取到服务端数据，减少页面 loading 时间；
ssr 不支持 beforeMount 、mounted 钩子函数，所以放在 created 中有助于一致性；
非SSR中也可以放到 mounted 中，因为created 中 dom 还未渲染出来。





## Vue3 为什么比 Vue2 快

1. proxy
2. patchFlag
   编译模板时动态节点做标记,分为 Text PROPS 等类型
   diff 算法时可以区分动静态结点/不同动态节点
   **输入做了标记** 从而 diff 性能得到提高
   优化并不只是 diff 算法 而是整个流程
3. hoistStatic
   将静态节点定义提升到父作用域缓存
   多个相邻的静态节点会被合并(相邻的静态节点多到一定程度会被合并)
   空间换时间

## Vuex 页面刷新数据丢失怎么解决

推荐使用 vuex-persist 插件，它就是为 Vuex 持久化存储而生的一个插件。不需要你手动存取 storage ，而是直接将状态保存至 cookie 或者 localStorage 中



## 为什么 for if 不能连用

**vue-for 的优先级高于 vue-if**
每次渲染都会`先循环再进行条件判断`(就是我会把所有的代码**先渲染出来**在进行条件判断，这样就造成了性能的浪费)
如果避免出现这种情况，则在外层嵌套 template（页面渲染不生成 dom 节点），在这一层进行 v-if 判断，然后在内部进行 v-for 循环

```Vue
<template v-if="isShow">
    <p v-for="item in items">
</template>
```

如果条件出现在循环内部，可通过计算属性 computed 提前过滤掉那些不需要显示的项

## v-model

- 在普通标签上是:
  value+@input 的语法糖，并且会处理拼音输入法的问题，
  text 和 textarea 元素使用 value property 和 input 事件；
  checkbox 和 radio 使用 checked property 和 change 事件；
  select 字段将 value 作为 prop 并将 change 作为事件。

- 在组件上是:value+@input 的语法糖

## provide 与 inject 实现

const provide=vm.$options.provide
将 provide 挂载到 vm 上
**inject 则不断寻找父亲的 provide 属性**
并将 provide 进行 defineReactive 到自己身上



## 异步组件

异步组件实现的本质**是 2 次渲染**，除了 0 delay 的高级异步组件第一次直接渲染成 loading 组件外，其它都是第一次渲染生成一个注释节点，当异步获取组件成功后，再通过 forceRender 强制重新渲染，这样就能正确渲染出我们异步加载的组件了。

## 什么是作用域插槽

**作用域插槽允许你传递一个模板而不是已经渲染好的元素给插槽**
之所以叫做”作用域“插槽，是因为模板虽然是在父级作用域中渲染的，却能拿到子组件的数据
即：作用域插槽**会被解析成函数**而不是孩子节点 (React 传的函数 props=>...)
被应用于表格中

## 在 vue 中 watch 和 created 哪个先执行？为什么？

官网的生命周期图中，init reactivity 是晚于 beforeCreate 但是早于 created 的。
watch 加了 immediate，应当同 init reactivity 周期一同执行，早于 created。
而正常的 watch，则是 mounted 周期后触发 data changes 的周期执行，晚于 created。

## vue 使用 v-for 遍历对象时，是按什么顺序遍历的？如何保证顺序？

1、会先判断是否有 iterator 接口，如果有循环执行 next()方法
2、没有 iterator 的情况下，会调用 Object.keys()方法，在不同浏览器中，JS 引擎不能保证输出顺序一致
3、保证对象的输出顺序可以把对象放在数组中，作为数组的元素
![顺序](https://user-images.githubusercontent.com/42334454/62844542-9fc46080-bcf4-11e9-9f52-9213e84f6536.png)

## v-show 指令算是重排吗？

v-show 本质是通过元素 css 的 display 属性来控制是否显示，在 DOM 渲染时仍然会先渲染元素，然后才会进行判断是否显示（通过 display 属性），而对于重排的定义是渲染树中的节点信息发生了**大小、边距等改变，要重新计算各节点和 css 具体的大小和位置**。
当用 display 来控制元素的显示和隐藏时，会改变节点的大小和渲染树的布局，导致发生重排，因此 v-show 指令算是重排。

## style 加 scoped 属性的用途和原理

用途：防止全局同名 CSS 污染
原理：在标签加上 v-data-something 属性，再在选择器时加上对应[v-data-something]，即 CSS 带属性选择器，以此完成类似作用域的选择方式
一、scoped 会在元素上添加唯一的属性（data-v-x 形式），css 编译后也**会加上属性选择器**，从而达到限制作用域的目的。
缺点：
（1）由于只是通过属性限制，**类还是原来的类**，所以在其他地方对类设置样式还是可以造成污染。
（2）添加了属性选择器，对于 CSS 选择器的**权重加重了(10)**。
（3）外层组件包裹子组件，会给子组件的根节点添加 data 属性。**在外层组件中无法修改子组件中除了根节点以外的节点的样式**。比如子组件中有 box 类，在父节点中设置样式，会被编译为
.box[data-v-x]的形式，但是 box 类所在的节点上没有添加 data 属性，因此无法修改样式。
可以**使用/deep/或者>>>穿透 CSS**，这样外层组件设置的 box 类编译后的就为[data-v-x] .box 了，就可以进行修改。
二、可以使用 CSS Module
CSS Module 没有添加唯一属性，而是通过**修改类名限制作用域**。这样类发生了变化，在其他地方设置样式无法造成污染，也没有使 CSS 选择器的权重增加。

1. 从 0 到 1 自己构架一个 vue 项目，说说有哪些步骤、哪些重要插件、目录结构你会怎么组织
   vue-cli 实际上已经很成熟了，目录除了脚手架默认的，
   1、一般会额外创建 views，components，api，utils，stores 等；
   2、下载重要插件，比如 axios，dayjs（moment 太大），其他的会根据项目需求补充；
   3、封装 axios，统一 api 调用风格和基本配置；
   4、如果有国际化需求，配置国际化；
   5、开发，测试和正式环境配置，一般不同环境 API 接口基础路径会不一样；

## 请简述虚拟 DOM 中 Key 的作用和好处。

解析：

 作用： **标识节点在当前层级的唯一性**。
​ 好处： 在执行 updateChildren 对比新旧 Vnode 的子节点差异时，通过设置 key 可以进行更高效的比较，便于复用节点。 降低创建销毁节点成本，从而减少 dom 操作，提升更新 dom 的性能。

## 使用 vue 渲染大量数据时应该怎么优化

1. 虚拟列表

2. 冻结属性，**让不必要的属性不响应**：Object.freeze, 或者使用 Object.defineProperty 将对象属性的 configurable 设置为 false

3. 分页

   

## provide 和 inject 原理

在初始化阶段， Vue 会遍历当前组件 inject 选项中的所有键名，拿这个键名在上级组件中的 `_provided` 属性里面进行查找，如果找到了就使用对应的值，如果找不到则再向上一级查找，直到查找完根组件为止，最终如果没有找到则使用默认值，通过这样层层向上查找的方式最终实现 provide 和 inject 的数据传递机制。
这里没有讲到 provide 的初始化，因为比较简单，就是将 provide 选项挂载在了 `_provided` 属性上。

## axios 同时请求多个接口，如果当 token 过期时，怎么取消后面的请求？

Axios 取消请求 CancelToken

## 请解释下 Vue 中 slot 和 slot-scope 两者的区别

slot 插槽分为默认插槽和具名插槽
slot-scope 是作用域插槽(render props)，父组件可以直接使用子组件中定义 data 数据

## vue 的优缺点?

- 优点

  ① 易用性：vue 提供数据响应式、基于配置的组件系统以及大量的指令等，这些让开发者只需关心核心业务即可。

  ② 灵活性：如果我们的应用足够小，可以只使用 vue 的核心库即可；随着应用的规模不断扩大，可以根据需求引入 vue-router、vuex、vue-cli 等其他工具。

  ③ 高效性：vue 操作的是虚拟 DOM，采用 diff 算法更新 DOM，比传统的 DOM 操作更加的高效。

- 缺点：

  ① 不支持 IE8 及以下版本

  ② 这不是单纯的 vue 的缺点，其他框架如 react、angular 均有，那就是不利于 SEO，不适合做需要浏览器抓取信息的电商网站，比较适合做后台管理系统。当然 vue 也有相关的 SSR 服务端渲染方式，也有针对 vue 服务端渲染的库，nuxt.js 来提高 SEO。

# 二、路由

## 0. 什么是“前端路由”？什么时候适合使用“前端路由”？“前端路由”有哪些优点和缺点？

（1）什么是前端路由？

前端路由就是把不同路由对应不同的内容或页面的任务交给前端来做，之前是通过服务端根据 url 的不同返回不同的页面实现的。

（2）什么时候使用前端路由？

在单页面应用，大部分页面结构不变，只改变部分内容的使用

（3）前端路由有什么优点和缺点？

优点：用户体验好，不需要每次都从服务器全部获取，快速展现给用户

缺点：单页面无法`记住之前滚动的位置`，无法在前进，后退的时候记住滚动的位置

前端路由一共有两种实现方式，一种是通过 hash 的方式，一种是通过使用 pushState 的方式。

## 1.对SPA(单页应用)的理解

SPA（ single-page application ）仅在 Web 页面初始化时加载相应的 HTML、JavaScript 和 CSS。一旦页面加载完成，SPA 不会因为用户的操作而进行页面的重新加载或跳转；取而代之的是利用路由机制实现 HTML 内容的变换，UI 与用户的交互，避免页面的重新加载。



**优点：**

- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染；
- 基于上面一点，SPA 相对对服务器压力小；
- 前后端职责分离，架构清晰，前端进行交互逻辑，后端负责数据处理；

**缺点：**

- 初次加载耗时多：为实现单页 Web 应用功能及显示效果，需要在加载页面的时候将 JavaScript、CSS 统一加载，部分页面按需加载；
- 前进后退路由管理：由于单页应用在一个页面中显示所有的内容，所以不能使用浏览器的前进后退功能，所有的页面切换需要自己建立堆栈管理；
- SEO 难度较大：由于所有的内容都在一个页面中动态替换显示，所以在 SEO 上其有着天然的弱势。



**原理：**

1. 监听地址栏中`hash`变化驱动界面变化
2. 用`pushsate`记录浏览器的历史，驱动界面发送变化

![img](https://static.vue-js.com/fc95bf60-3ac6-11eb-ab90-d9ae814b240d.png)



**实现（vue的路由实现）：**

**`hash` 模式**

核心通过监听`url`中的`hash`来进行路由跳转。

**hash的特点**：

+ hash 变化会触发网页跳转，即浏览器的前进和后退。

  

+ 它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。

  

+ hash 可以改变 url，但不会触发页面重新加载（hash的改变是记录在 

  window.history上），即不会刷新页面。也就是说，所有页面的跳转都是在客户端

  进行操作的，这并不算是一次 http 请求。因此这种模式不利已 SEO 优化。

  

+ hash 通过 window.onhashchange 的方式来监听 hash 的改变。

```html
<div id="app">
    <a href="#/home">home</a>
    <a href="#/about">about</a>

    <div class="content">Default</div>
</div>
```

```js
const contentEl = document.querySelector('.content');
window.addEventListener("hashchange", () => {
    switch (location.hash) {
        case '#/home':
            contentEl.innerHTML = 'Home';
            break;
        case '#/about':
            contentEl.innerHTML = 'About';
            break;
        default:
            contentEl.innerHTML = 'Default'
    }
})
```





**history模式**

 history模式的URL中没有#，它使用的是传统的路由分发模式，即用户在输入一个URL时，服务器会接收这个请求，并解析这个URL，然后做出相应的逻辑处理。

**特点：** 

当使用history模式时，URL就像这样：[abc.com/user/id](https://link.juejin.cn/?target=http%3A%2F%2Fabc.com%2Fuser%2Fid)。相比hash模式更加好看。但是，history模式需要后台配置支持。如果后台没有正确配置，访问时会返回404。 

`history` 模式核心借用 `HTML5 history api`，包括了 pushState()` 和 `replaceState()` 方法，这两个方法应用于浏览器的历史记录栈，提供了对历史记录进行修改的功能。只是当他们进行修改时，虽然修改了url，但浏览器不会立即向后端发送请求。如果要做到改变url但又不刷新页面的效果，就需要前端用上这两个API。



- `history.pushState` 浏览器历史纪录添加记录
- `history.replaceState`修改浏览器历史纪录中当前纪录
- `history.popState` 当 `history` 发生变化时触发

```js
const contentEl = document.querySelector('.content');

const aEls = document.getElementsByTagName('a');

for (let aEl of aEls) {
    aEl.addEventListener('click', e => {
        e.preventDefault();
        const href = aEl.getAttribute('href');
        history.pushState({}, "", href);

        switch (location.pathname) {
            case '/home':
                contentEl.innerHTML = 'Home';
                break;
            case '/about':
                contentEl.innerHTML = 'About';
                break;
            default:
                contentEl.innerHTML = 'Default';
        }
    })
}
```







## 2.路由懒加载

当打包构建应用时，JavaScript 包会变得非常大，影响页面加载。

如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

如何实现？ 异步组件 + webpack动态 import

~~~js
component: () => import(/*webpackChunkName:"home-chunk"*/'../pages/Home.vue')
~~~



**为什么要使用路由懒加载？**

为给客户更好的客户体验，首屏组件加载速度更快一些，解决白屏问题。



# 三、vuex

## 1.vuex的原理

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。每一个 Vuex 应用的核心就是 store（仓库）。“store” 基本上就是一个容器，它包含着你的应用中大部分的状态 ( state )。

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

- 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样可以方便地跟踪每一个状态的变化。

![b025e120ca3d0bd2ded3d038d58cacf4.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/92fc4b2c6e414344b9b22bc057dcd39c~tplv-k3u1fbpfcp-watermark.awebp)

**（1）核心流程：**

- Vue Components 是 vue 组件，组件会触发（dispatch）一些事件或动作，也就是图中的 Actions;
- 在组件中发出的动作，肯定是想获取或者改变数据的，但是在 vuex 中，数据是集中管理的，不能直接去更改数据，所以会把这个动作提交（Commit）到 Mutations 中;
- 然后 Mutations 就去改变（Mutate）State 中的数据;
- 当 State 中的数据被改变之后，就会重新渲染（Render）到 Vue Components 中去，组件展示更新后的数据，完成一个流程。





## 2.vuex的使用

在决定一个数据是否用vuex来管理的时候，核心是要思考清楚，这个数据是否有共享给其他页面或者是其他组件的需要。如果需要，就放在vuex中管理；如果不需要，就放在组件内部使用ref或者reactive去管理。



## 3. Vuex中action和mutation的区别

+ Mutation专注于修改State，理论上是修改State的唯一途径；Action业务代码、异步请求。

+ Mutation：必须同步执行；Action：可以异步，但不能直接操作State。

+ 在视图更新时，先触发actions，actions再触发mutation

+ mutation的参数是state，它包含store中的数据；store的参数是context，它是 state 的父级，包含 state、getters



## 4.下一代vuex：pinia

vuex由于对typescript的支持很不好，为了解决这个问题，vuex的作者发布了一个新的作品pinia。

优点：

1. 良好的 TypeScript 支持
2. 语法更简洁，没用commit，只有action, state, getter，（本来 vuex 中的 commit 设计也只是为了打印日志方便）





## 5.vuex源码

### install

app.use(store)的时候会执行install，这个函数通过 app.provide 注册 store 给全局的组件使用。

~~~js
  // app.use(store)的时候会执行这个函数
  install (app, injectKey) {
    app.provide(injectKey || storeKey, this)
    app.config.globalProperties.$store = this

    const useDevtools = this._devtools !== undefined
      ? this._devtools
      : __DEV__ || __VUE_PROD_DEVTOOLS__

    if (useDevtools) {
      addDevtools(app, this)
    }
  }
~~~



### store构造函数

~~~js
constructor (options = {}) {
    if (__DEV__) {
      assert(typeof Promise !== 'undefined', `vuex requires a Promise polyfill in this browser.`)
      assert(this instanceof Store, `store must be called with the new operator.`)
    }

    const {
      plugins = [],
      strict = false,
      devtools
    } = options

    // store internal state
    this._committing = false
    this._actions = Object.create(null)
    this._actionSubscribers = []
    this._mutations = Object.create(null)
    this._wrappedGetters = Object.create(null)
    this._modules = new ModuleCollection(options)
    this._modulesNamespaceMap = Object.create(null)
    this._subscribers = []
    this._makeLocalGettersCache = Object.create(null)

    // EffectScope instance. when registering new getters, we wrap them inside
    // EffectScope so that getters (computed) would not be destroyed on
    // component unmount.
    this._scope = null

    this._devtools = devtools

    // bind commit and dispatch to self
    const store = this
    const { dispatch, commit } = this
    this.dispatch = function boundDispatch (type, payload) {
      return dispatch.call(store, type, payload)
    }
    this.commit = function boundCommit (type, payload, options) {
      return commit.call(store, type, payload, options)
    }

    // strict mode
    this.strict = strict

    const state = this._modules.root.state

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root)

    // initialize the store state, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreState(this, state)

    // apply plugins
    plugins.forEach(plugin => plugin(this))
  }
~~~







installModule 方法是把我们通过 options 传入的各种属性模块注册和安装。

installModule 函数可接收5个参数：

+ store 表示当前 Store 实例
+ rootState 表示根 state
+ path 表示当前嵌套模块的路径数组
+ module 表示当前安装的模块
+ hot 当动态改变 modules 或者热更新的时候为 true。

~~~js
export function installModule (store, rootState, path, module, hot) {
  const isRoot = !path.length
  const namespace = store._modules.getNamespace(path)

  // register in namespace map
  if (module.namespaced) {
    if (store._modulesNamespaceMap[namespace] && __DEV__) {
      console.error(`[vuex] duplicate namespace ${namespace} for the namespaced module ${path.join('/')}`)
    }
    store._modulesNamespaceMap[namespace] = module
  }

  // set state
  if (!isRoot && !hot) {
    const parentState = getNestedState(rootState, path.slice(0, -1))
    const moduleName = path[path.length - 1]
    store._withCommit(() => {
      if (__DEV__) {
        if (moduleName in parentState) {
          console.warn(
            `[vuex] state field "${moduleName}" was overridden by a module with the same name at "${path.join('.')}"`
          )
        }
      }
      parentState[moduleName] = module.state
    })
  }

  const local = module.context = makeLocalContext(store, namespace, path)

  module.forEachMutation((mutation, key) => {
    const namespacedType = namespace + key
    registerMutation(store, namespacedType, mutation, local)
  })

  module.forEachAction((action, key) => {
    const type = action.root ? key : namespace + key
    const handler = action.handler || action
    registerAction(store, type, handler, local)
  })

  module.forEachGetter((getter, key) => {
    const namespacedType = namespace + key
    registerGetter(store, namespacedType, getter, local)
  })

  module.forEachChild((child, key) => {
    installModule(store, rootState, path.concat(key), child, hot)
  })
}

~~~









# 四、vue挂载篇

## 0.new一个Vue对象

~~~js
let vm = new Vue({
    el: '#app',
    /*some options*/
});
~~~

在new一个Vue对象的时候，内部究竟发生了什么？

![newVue](C:\Users\64554\Desktop\自动化设置响应式对象\newVue.png)



new 一个 Vue 实例时，调用栈如下：

![image-20220506211452711](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220506211452711.png)

## 1.Vue构造函数

Vue的构造类只做了一件事情，就是调用_init函数进行初始化。

~~~js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  /*初始化*/
  this._init(options)
}
~~~



## 2._init，初始化

_init主要做了这两件事：

1. 初始化（包括生命周期、事件、render 函数、state 等）。

2. $mount 组件。

```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this

    vm._isVue = true
  
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) 
    initState(vm)
    initProvide(vm) 
    callHook(vm, 'created')

    if (vm.$options.el) {
      /*把组件挂载到页面成为真实DOM*/
      vm.$mount(vm.$options.el)
    }
  }
```





### initData

1. 首先判断data是不是函数，如果是函数的话执行getData。getData做的事情很简单：`return data.call(vm, vm);`，因为vue推荐我们把data定义为一个函数然后返回具体的data对象，因此getData只需执行一次data拿到返回值即可。
2. 判断是否与props属性名冲突，然后将data挂载到vue实例中。这里是通过proxy对vue实例的getter，setter做一层代理转发，比如this.message访问data时实际上转发到this.data.message。
3. 对数据做响应式化。

```js
function initData(vm: Component) {
  let data = vm.$options.data;
  data = vm._data = typeof data === "function" ? getData(data, vm) : data || {};

  const keys = Object.keys(data);
  const props = vm.$options.props;
  const methods = vm.$options.methods;
  let i = keys.length;
  while (i--) {
    const key = keys[i];
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== "production" &&
        warn(
          `The data property "${key}" is already declared as a prop. ` +
            `Use prop default value instead.`,
          vm
        );
    } else if (!isReserved(key)) {
      // 将data挂载到vue实例中
      proxy(vm, `_data`, key);
    }
  }
    
  observe(data, true /* asRootData */);
}
```

~~~ts
export function proxy(target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter() {
    return this[sourceKey][key];
  };
  sharedPropertyDefinition.set = function proxySetter(val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}
~~~







## 3.mount，挂载

1. 首先将原型上的$mount方法缓存下来。

2. 然后重新定义$mount方法。

   之所以这么设计完全是为了复用，因为原生的$mount方法是可以被runtime only版本的 Vue 直接使用的。而在runtime-compiler版本中需要添加额外的逻辑。

3. 接下来的是很关键的逻辑 —— **如果没有定义 render 方法，则会把 template 字符串或者是 el 编译成 render 函数。**即调用compileToFunctions处理模板templete。如果存在render方法则优先使用render。

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* 对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上 */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' && warn(
      `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
    )
    return this
  }

  const options = this.$options
  if (!options.render) {
    let template = options.template
    /*template存在的时候取template，不存在的时候取el的outerHTML*/
    if (template) {
      /*当template是字符串的时候*/
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        /*当template为DOM节点的时候*/
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        delimiters: options.delimiters
      }, this)
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  return mount.call(this, el, hydrating)
}


```

4. 然后执行缓存的mount方法。

~~~tsx
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
~~~

5. 这个方法实际上会去调用 mountComponent 函数。mountComponent 核心就是先**实例化一个渲染Watcher**，在watcher内部，会通过this.getter.call 调用 updateComponent 方法，这个方法内部会**调用 vm._render() 生成 虚拟DOM，然后调用 vm.update 更新 DOM。**

   `Watcher` 在这里起到两个作用，**一个是初始化的时候会执行回调函数，另一个是当 vm 实例中的监测的数据发生变化的时候执行回调函数。**

~~~tsx
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        )
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        )
      }
    }
  }
  // 调用beforeMount生命周期钩子
  callHook(vm, 'beforeMount')

  let updateComponent
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = () => {
      const name = vm._name
      const id = vm._uid
      const startTag = `vue-perf-start:${id}`
      const endTag = `vue-perf-end:${id}`

      const vnode = vm._render()

      measure(`vue ${name} render`, startTag, endTag)

      vm._update(vnode, hydrating)
        
      measure(`vue ${name} patch`, startTag, endTag)
    }
  } else {
    updateComponent = () => {
      vm._update(vm._render(), hydrating)
    }
  }

  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  hydrating = false

  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
~~~

6. 函数最后判断为当前是否为根节点（ vm.$vnode 表示 Vue 实例的父虚拟 Node，所以它为 Null 则表示当前是根 Vue 的实例），为根节点的时候设置 vm._isMounted 为 true， 表示这个实例已经挂载了，同时执行 mounted 钩子函数。 

### vm._render()

vm._render 通过执行 createElement 方法并返回的是 vnode，它是一个虚拟 Node。

~~~tsx
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      )
    }

    vm.$vnode = _parentVnode
    let vnode
    try {
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    vnode.parent = _parentVnode
    return vnode
  }
~~~

这里的$createElement其实就是在initRender函数中定义的vm.$createElement。

~~~tsx
export function initRender (vm: Component) {

  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)

  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
~~~









### VNode

VNode产生的前提是浏览器中的 DOM 是很“昂贵"的，为了更直观的感受，我们可以简单的把一个简单的 div 元素的属性都打印出来，如图所示：

![img](https://ustbhuangyi.github.io/vue-analysis/assets/dom.png)

可以看到，真正的 DOM 元素是非常庞大的，因为浏览器的标准就把 DOM 设计的非常复杂。当我们频繁的去做 DOM 更新，会产生一定的性能问题。

而 Virtual DOM 就是用一个原生的 JS 对象去描述一个 DOM 节点（核心就是几个关键属性，标签名、数据、子节点、键值等），并且由于 VNode 只是用来映射到真实 DOM 的渲染，不需要包含操作 DOM 的方法，因此它比创建一个 DOM 的代价要小很多。

另外，有了一层真实 DOM 的抽象以后：

+ 可以将虚拟节点缓存下来，然后使用新创建的虚拟节点和上一次渲染时的缓存的虚拟节点进行对比，然后根据对比结果进行最小代价的操作DOM更新。（也可以不进行diff直接采用全量更新DOM，但这么做的问题是如果组件只有一个节点发生变化，那么全量更新会造成很大的性能浪费）

+ 同时对 DOM 的多次操作结果一次性的更新到页面上（因为vue更新页面是异步的，所以多次对DOM的操作结果会push到一个nexttick队列中，然后一次性更新到页面中），从而有效的减少页面渲染的次数，减少修改DOM的重绘重排次数，提高渲染性能。

但是，相应的缺点就是首次渲染大量 DOM 时，由于多了一层虚拟 DOM 的计算，会比直接 innerHTML 插入慢。



```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  functionalContext: Component | void; // only for functional component root nodes
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    /*当前节点的标签名*/
    this.tag = tag
    /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.data = data
    /*当前节点的子节点，是一个数组*/
    this.children = children
    /*当前节点的文本*/
    this.text = text
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm
    /*当前节点的名字空间*/
    this.ns = undefined
    /*编译作用域*/
    this.context = context
    /*函数化组件作用域*/
    this.functionalContext = undefined
    /*节点的key属性，被当作节点的标志，用以优化*/
    this.key = data && data.key
    /*组件的option选项*/
    this.componentOptions = componentOptions
    /*当前节点对应的组件的实例*/
    this.componentInstance = undefined
    /*当前节点的父节点*/
    this.parent = undefined
    /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.raw = false
    /*静态节点标志*/
    this.isStatic = false
    /*是否作为跟节点插入*/
    this.isRootInsert = true
    /*是否为注释节点*/
    this.isComment = false
    /*是否为克隆节点*/
    this.isCloned = false
    /*是否有v-once指令*/
    this.isOnce = false
  }

  get child (): Component | void {
    return this.componentInstance
  }
}
```



### createElement

createElement方法实际上是对 _createElement 方法的封装，它允许传入的参数更加灵活，比如说可以不传Data属性，它内部会判断有无Data，若无则属性赋值前移。

因此，真正执行的是`_createElement`方法。

~~~tsx
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode | Array<VNode> {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  return _createElement(context, tag, data, children, normalizationType)
}
~~~

**_createElement**

~~~tsx
export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    if (!__WEEX__ || !('@binding' in data.key)) {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      )
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  if (typeof tag === 'string') {
    let Ctor
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn) && data.tag !== 'component') {
        warn(
          `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
          context
        )
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) applyNS(vnode, ns)
    if (isDef(data)) registerDeepBindings(data)
    return vnode
  } else {
    return createEmptyVNode()
  }
}
~~~

这里面有两个关键流程：children 的规范化和 VNode 的创建。

**children的规范化**

由于 Virtual DOM 实际上是一个树状结构，每一个 VNode 可能会有若干个子节点，这些子节点应该也是 VNode 的类型。`_createElement` 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型的 children 数组。

**VNode的创建**

这里先对 tag 做判断，如果是 string 类型，则接着判断如果是内置的一些节点，则直接创建一个普通 VNode，如果是为已注册的组件名，则通过 createComponent 创建一个组件类型的 VNode，否则创建一个未知的标签的 VNode。 如果是 tag 一个 Component 类型，则直接调用 createComponent 创建一个组件类型的 VNode 节点。



### update

经过`mountComponent` 函数的过程，我们已经知道 `vm._render` 是创建了一个 VNode，接下来就是要把这个 VNode 渲染成一个真实的 DOM 并渲染出来，这个过程是通过 `vm._update` 完成的。

 `_update` 是实例的一个私有方法，它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候。这里只分析首次渲染部分。`_update` 方法的作用是把 VNode 渲染成真实的 DOM。

~~~tsx
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode

    if (!prevVnode) {
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()

    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }

    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
  }
~~~

_update 的核心就是调用 `vm.__patch__` 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的。

~~~js
  Vue.prototype.__patch__ = inBrowser ? patch : noop
~~~

在 web 平台上，是否是服务端渲染也会对这个方法产生影响。因为在服务端渲染中，没有真实的浏览器 DOM 环境，所以不需要把 VNode 最终转换成 DOM，因此是一个空函数，而在浏览器端渲染中，它指向了 patch 方法。

~~~js
  export const patch: Function = createPatchFunction({ nodeOps, modules })
~~~

方法的定义是调用 createPatchFunction 方法的返回值，这里传入了一个对象，包含 nodeOps 参数和 modules 参数。其中，nodeOps 封装了一系列 DOM 操作的方法，modules 定义了一些模块的钩子函数的实现。

接下来回到patch的主要执行过程：

~~~tsx
const isRealElement = isDef(oldVnode.nodeType)
if (!isRealElement && sameVnode(oldVnode, vnode)) {
  // patch existing root node
  patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
} else {
  if (isRealElement) {
    // mounting to a real element
    // check if this is server-rendered content and if we can perform
    // a successful hydration.
    if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
      oldVnode.removeAttribute(SSR_ATTR)
      hydrating = true
    }
    if (isTrue(hydrating)) {
      if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
        invokeInsertHook(vnode, insertedVnodeQueue, true)
        return oldVnode
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'The client-side rendered virtual DOM tree is not matching ' +
          'server-rendered content. This is likely caused by incorrect ' +
          'HTML markup, for example nesting block-level elements inside ' +
          '<p>, or missing <tbody>. Bailing hydration and performing ' +
          'full client-side render.'
        )
      }
    }      
    // either not server-rendered, or hydration failed.
    // create an empty node and replace it
    oldVnode = emptyNodeAt(oldVnode)
  }

  // replacing existing element
  const oldElm = oldVnode.elm
  const parentElm = nodeOps.parentNode(oldElm)

  // create new node
  createElm(
    vnode,
    insertedVnodeQueue,
    // extremely rare edge case: do not insert if old element is in a
    // leaving transition. Only happens when combining transition +
    // keep-alive + HOCs. (#4590)
    oldElm._leaveCb ? null : parentElm,
    nodeOps.nextSibling(oldElm)
  )
}
~~~

我们传入的 `oldVnode` 实际上是一个 DOM container，所以 `isRealElement` 为 true，接下来又通过 `emptyNodeAt` 方法把 `oldVnode` 转换成 `VNode` 对象，然后再调用 `createElm` 方法。

~~~tsx
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  if (isDef(vnode.elm) && isDef(ownerArray)) {
    // This vnode was used in a previous render!
    // now it's used as a new node, overwriting its elm would cause
    // potential patch errors down the road when it's used as an insertion
    // reference node. Instead, we clone the node on-demand before creating
    // associated DOM element for it.
    vnode = ownerArray[index] = cloneVNode(vnode)
  }

  vnode.isRootInsert = !nested // for transition enter check
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }

  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (isDef(tag)) {
    if (process.env.NODE_ENV !== 'production') {
      if (data && data.pre) {
        creatingElmInVPre++
      }
      if (isUnknownElement(vnode, creatingElmInVPre)) {
        warn(
          'Unknown custom element: <' + tag + '> - did you ' +
          'register the component correctly? For recursive components, ' +
          'make sure to provide the "name" option.',
          vnode.context
        )
      }
    }

    vnode.elm = vnode.ns
      ? nodeOps.createElementNS(vnode.ns, tag)
      : nodeOps.createElement(tag, vnode)
    setScope(vnode)

    /* istanbul ignore if */
    if (__WEEX__) {
      // ...
    } else {
      createChildren(vnode, children, insertedVnodeQueue)
      if (isDef(data)) {
        invokeCreateHooks(vnode, insertedVnodeQueue)
      }
      insert(parentElm, vnode.elm, refElm)
    }

    if (process.env.NODE_ENV !== 'production' && data && data.pre) {
      creatingElmInVPre--
    }
  } else if (isTrue(vnode.isComment)) {
    vnode.elm = nodeOps.createComment(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  } else {
    vnode.elm = nodeOps.createTextNode(vnode.text)
    insert(parentElm, vnode.elm, refElm)
  }
}
~~~

`createElm` 的作用是通过虚拟节点创建真实的 DOM 并插入到它的父节点中。

对于最简单的渲染case来说，createElm 的执行过程如下：

判断 `vnode` 是否包含 tag，如果包含，先简单对 tag 的合法性在非生产环境下做校验，看是否是一个合法标签；然后再去调用平台 DOM 的操作去创建一个占位符元素。

~~~tsx
vnode.elm = vnode.ns
  ? nodeOps.createElementNS(vnode.ns, tag)
  : nodeOps.createElement(tag, vnode)
~~~

接下来调用 `createChildren` 方法去创建子元素，实际上是做的就是遍历子虚拟节点，递归调用 `createElm`。

~~~tsx
createChildren(vnode, children, insertedVnodeQueue)

function createChildren (vnode, children, insertedVnodeQueue) {
  if (Array.isArray(children)) {
    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(children)
    }
    for (let i = 0; i < children.length; ++i) {
      createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i)
    }
  } else if (isPrimitive(vnode.text)) {
    nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)))
  }
}
~~~

接着再调用 `invokeCreateHooks` 方法执行所有的 create 的钩子并把 `vnode` push 到 `insertedVnodeQueue` 中。

最后调用 `insert` 方法把 `DOM` 插入到父节点中，因为是递归调用，子元素会优先调用 `insert`，所以整个 `vnode` 树节点的插入顺序是先子后父。

~~~tsx
function insert (parent, elm, ref) {
  if (isDef(parent)) {
    if (isDef(ref)) {
      if (ref.parentNode === parent) {
        nodeOps.insertBefore(parent, elm, ref)
      }
    } else {
      nodeOps.appendChild(parent, elm)
    }
  }
}
~~~

可以看到，`insert` 逻辑很简单，调用一些 `nodeOps` 把子节点插入到父节点中。这些方法其实就是调用原生DOM的API进行DOM操作。

~~~tsx
export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}

export function appendChild (node: Node, child: Node) {
  node.appendChild(child)
}
~~~

### 总结

patch 过程主要是调用 createElm 方法来创建真实 DOM。createElm 会调用 createChildren 方法，这个方法再调用 createElm 创建子 DOM，这样实际上是递归的创建一个完整 DOM。因此最先插入的是递归最深处即叶子节点对应的真实 DOM，在回溯过程中继续插入 DOM 直至得到完整 DOM。

















# 五、响应式系统

## 0.自动化设置响应式对象

我们可以简单的把具有getter、setter方法的对象称为响应式对象。

那么vue如何自动化将props、data等自动化的设置为响应式对象的呢？

![页面-1](C:\Users\64554\Desktop\自动化设置响应式对象\页面-1.png)

在vue初始化中，会执行initState方法完成这件事。接下来具体分析这个过程：

~~~ts
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
~~~



### initProps

~~~tsx
function initProps (vm: Component, propsOptions: Object) {
  const propsData = vm.$options.propsData || {}
  const props = vm._props = {}
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  const keys = vm.$options._propKeys = []
  const isRoot = !vm.$parent
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false)
  }
  for (const key in propsOptions) {
    keys.push(key)
    const value = validateProp(key, propsOptions, propsData, vm)
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      const hyphenatedKey = hyphenate(key)
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          `"${hyphenatedKey}" is a reserved attribute and cannot be used as component prop.`,
          vm
        )
      }
      defineReactive(props, key, value, () => {
        if (vm.$parent && !isUpdatingChildComponent) {
          warn(
            `Avoid mutating a prop directly since the value will be ` +
            `overwritten whenever the parent component re-renders. ` +
            `Instead, use a data or computed property based on the prop's ` +
            `value. Prop being mutated: "${key}"`,
            vm
          )
        }
      })
    } else {
      defineReactive(props, key, value)
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, `_props`, key)
    }
  }
  toggleObserving(true)
}
~~~

`props` 的初始化主要过程，就是遍历定义的 `props` 配置。

遍历的过程主要做两件事情：

1. 调用 `defineReactive` 方法把每个 `prop` 对应的值变成响应式，可以通过 `vm._props.xxx` 访问到定义 `props` 中对应的属性。
2. 通过 `proxy` 把 `vm._props.xxx` 的访问代理到 `vm.xxx` 上。

### defineReactive()

~~~js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  /*在闭包中定义一个dep对象*/
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)

  /*如果之前该对象已经定义了getter以及setter函数则将其取出来，新定义的getter/setter中会将其执行，保证不会覆盖之前已经定义的getter/setter。*/
  const getter = property && property.get
  const setter = property && property.set

  /*对象的子对象递归进行observe*/
  let childOb = observe(val)
  
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {

      /*如果原本对象拥有getter方法则执行*/
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {

        /*进行依赖收集*/
        dep.depend()
        if (childOb) {
          /*子对象进行依赖收集，其实就是将同一个watcher观察者实例放进了两个depend中，一个是正在本身闭包中的depend，另一个是子元素的depend*/
          childOb.dep.depend()
        }
        if (Array.isArray(value)) {

          /*是数组则需要对每一个成员都进行依赖收集，如果数组的成员还是数组，则递归。*/
          dependArray(value)
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {

      /*通过getter方法获取当前值，与新值进行比较，一致则不需要执行下面的操作*/
      const value = getter ? getter.call(obj) : val

      if (setter) {
        /*如果原本对象拥有setter方法则执行setter*/
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      /*新的值需要重新进行observe，保证数据响应式*/
      childOb = observe(newVal)

      /*dep对象通知所有的观察者*/
      dep.notify()
    }
  })
}
~~~

`defineReactive` 函数最开始初始化 `Dep` 对象的实例，接着拿到 `obj` 的属性描述符，然后对子对象递归调用 `observe` 方法，将它的所有子属性也能变成响应式的对象。最后利用 `Object.defineProperty` 去给 `obj` 的属性 `key` 添加 getter 和 setter。

### observe()

接着来看defineReactive里调用的observe方法：

~~~tsx
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
~~~

`observe` 方法的作用就是给非 VNode 的对象类型数据添加一个 `Observer`，如果已经添加过则直接返回。

### Observer类

接下来继续看 `Observer`。`Observer` 是一个类，它的作用是给对象的属性添加 getter 和 setter，用于依赖收集和派发更新：

~~~tsx
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that has this object as root $data

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }

  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
~~~

`Observer` 的构造函数逻辑很简单，首先实例化 `Dep` 对象，这块稍后会介绍，接着通过执行 `def` 函数把自身实例添加到数据对象 `value` 的 `__ob__` 属性上。

接下来会对 `value` 做判断，对于数组会调用 `observeArray` 方法，否则对纯对象调用 `walk` 方法。可以看到 `observeArray` 是遍历数组再次调用 `observe` 方法，而 `walk` 方法是遍历对象的 key 调用 `defineReactive` 方法。

看一下def的实现，非常简单的`Object.defineProperty` 的封装，通过def，data对象会一个 `__ob__` 的属性。：

~~~tsx
export function def (obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
~~~





### proxy()

props初始化过程中的第二件事就是将props属性代理到vm实例中，因此我们可以通过vm实例来访问props里面的数据。比如：

~~~js
let comP = {
  props: {
    msg: 'hello'
  },
  methods: {
    say() {
      // 直接通过vm实例访问props里的具体数据
      console.log(this.msg)
    }
  }
}
~~~

proxy的实现很简单，就是做了一层代理转发。

~~~tsx
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
~~~



### 总结

Vue初始化时自动化设置响应式对象所做的事就是，遍历data，对每个data执行observe()方法，observe()方法会实例化Observer类，Observer类做的事就是遍历data的每一个属性，并执行defineReactive来给每个属性添加getter，setter。同时会在闭包中创建一个Dep用来管理依赖。



## 1.依赖收集

![响应式](C:\Users\64554\Desktop\自动化设置响应式对象\响应式.png)

在上面vue已经将普通对象设置为响应式对象，接下来看看响应式对象里getter的相关逻辑，主要就是依赖收集：

~~~ts
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    // ...
  })
~~~

可以看到`get` 函数中通过 `dep.depend` 做依赖收集。

### Dep类

~~~tsx
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

Dep.target = null
const targetStack = []

export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}
~~~

`Dep` 是整个 getter 依赖收集的核心。它定义了一些属性和方法，需要特别注意的是它有一个静态属性 `target`，这是一个全局唯一 `Watcher`。

`Dep` 实际上就是对 `Watcher` 的一种管理，`Dep` 脱离 `Watcher` 单独存在是没有意义的。

### Watcher类

`Watcher` 的作用就是将正在执行的函数通过 `Watcher` 包装后保存到 `Dep.target` 中，然后调用传进来的函数，此时触发对象属性的 `get` 函数，会收集当前 `Watcher` 。

```js
export default class Watcher {
    
  constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.computed = !!options.computed
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.computed = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.computed // for computed watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = function () {}
        process.env.NODE_ENV !== 'production' && warn(
          `Failed watching path: "${expOrFn}" ` +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        )
      }
    }
    if (this.computed) {
      this.value = undefined
      this.dep = new Dep()
    } else {
      this.value = this.get()
    }
  }

  get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }

  addDep (dep: Dep) {
    const id = dep.id
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

  cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
  // ...
}
```



### 过程分析

我们在实例挂载篇中知道，在mount过程中会实例化一个渲染 `watcher`。而这个过程中，最终会**执行 `vm._render()` 方法生成渲染 VNode，并且在这个过程中会对 `vm` 上的数据进行访问，于是触发了数据对象的 getter。**

另外，在实例化watcher过程触发`this.get()` 方法时，会执行`pushTarget(this)`方法，把 `Dep.target` 赋值为当前的渲染 `watcher`。

~~~tsx
export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}
~~~

然后因为每个对象值的 getter 都持有一个 `dep`（这个 dep 是在数据初始化 defineReactive 过程中实例化的），在触发 getter 的时候会调用 `dep.depend()` 方法，也就会执行 `Dep.target.addDep(this)`，即执行`Watcher.addDep(this)`方法。

~~~ts
addDep (dep: Dep) {
  const id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
~~~

这里会做一些逻辑判断（保证同一数据不会被添加多次）后执行 `dep.addSub(this)`，那么就会执行 `this.subs.push(sub)`，也就是说把当前的 `watcher` 订阅到这个数据持有的 `dep` 的 `subs` 中，用来为后续数据变化时候能通知到哪些 `subs` （订阅者）做准备。



## 2.派发更新

依赖收集目的就是为了当修改数据的时候，可以对相关的依赖派发更新。接下来具体分析派发更新的过程：

~~~tsx
 Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    // ...
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
~~~

setter 的逻辑有 2 个关键的点，一个是 `childOb = !shallow && observe(newVal)`，如果 `shallow` 为 false 的情况，会对新设置的值变成一个响应式对象；另一个是 `dep.notify()`，通知所有的订阅者。

### 过程分析

当我们在组件中对响应的数据做了修改，就会触发 setter 的逻辑，最后调用 `dep.notify()` 方法。

~~~js
class Dep {
  // ...
  notify () {
  // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}
~~~

这里的逻辑非常简单，遍历所有的 `subs`，也就是 `Watcher` 的实例数组，然后调用每一个 `watcher` 的 `update` 方法。

~~~tsx
update () {
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()
    } else {
        /*异步推送到观察者队列中，下一个tick时调用。*/
        queueWatcher(this)
    }
}
~~~

对于一般组件数据更新的场景，会走到最后一个 `queueWatcher(this)` 的逻辑，即异步更新视图：

~~~tsx
const queue: Array<Watcher> = []
let has: { [key: number]: ?true } = {}
let waiting = false
let flushing = false

export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
~~~

这里注意 Vue 在做派发更新的时候的一个优化的点，它并不会每次数据改变都触发 `watcher` 的回调，而是把这些 `watcher` 先添加到一个队列里，然后在 `nextTick` 后执行 `flushSchedulerQueue`。



### 为什么要异步更新视图

```html
<template>
  <div>
    <div>{{test}}</div>
  </div>
</template>
```

```js
export default {
    data () {
        return {
            test: 0
        };
    },
    mounted () {
      for(let i = 0; i < 1000; i++) {
        this.test++;
      }
    }
}
```

现在有这样的一种情况，mounted的时候test的值会被++循环执行1000次。 每次++时，都会根据响应式触发setter->Dep->Watcher->update->patch。 如果这时候没有异步更新视图，那么每次++都会直接操作DOM更新视图，这是非常消耗性能的。 



## 3.一些细节

当我们改变某个响应式数据触发 setter 时，会执行该数据的 Dep 中的所有 Watcher，也就是会执行 new watcher 时保存的 回调函数如（computed 的 getter)。执行这个回调函数的时候会重新读取依赖的响应式数据，从而触发 getter 进行依赖收集。

![data](C:\Users\64554\Desktop\自动化设置响应式对象\data.png)

1. 那么在这个过程中如何保证 Dep 不会重复收集 Watcher 呢？

Vue 采用的方式是给每个 `Dep` 对象引入 `id` ，`Watcher` 对象中记录所有的 `Dep` 的 `id`，下次重新收集依赖的时候，如果 `Dep` 的 `id` 已经存在，就不再收集该 `Watcher` 了。

~~~js
let uid = 0;

export default class Dep {
    constructor() {
        this.id = uid++;
        this.subs = []; // 保存所有需要执行的函数
    }
	// ......
}
~~~

```js
export default class Watcher {
  constructor(Fn) {
    this.depIds = new Set(); // 拥有 has 函数可以判断是否存在某个 id
  }

  addDep(dep: Dep) {
    const id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  }
}
```



2. 如何移除不需要的依赖呢？

Vue 采用的方法是：**重新收集依赖时，用一个变量`newDeps`来记录新一次的依赖，之后再和旧的 `Dep` 对象列表比对，如果发现多余依赖，就将该依赖的 `Watcher` 从 `Dep` 中移除。**

```js
export default class Dep {
    // ......
    removeSub(sub) {
        remove(this.subs, sub);
    }
    // ......
}
```

```js
export default class Watcher {
    constructor(Fn) {
        this.getter = Fn;
        this.depIds = new Set(); 
        this.deps = [];
        this.newDeps = []; // 记录新一次的依赖
        this.newDepIds = new Set();
        this.get();
    }

    get() {
        Dep.target = this; 
        let value;
        try {
            value = this.getter.call();
        } catch (e) {
            throw e;
        } finally {
            /* 重点关注 */
            this.cleanupDeps();
        }
        return value;
    }

    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }
}
```

在执行 `cleanupDeps` 函数的时候，会首先遍历 `deps`，移除对 `dep.subs` 数组中 `Wathcer` 的订阅，然后把 `newDepIds` 和 `depIds` 交换，`newDeps` 和 `deps` 交换，并把 `newDepIds` 和 `newDeps` 清空。























## 4.nextTick

nextTick 的实现中，首先申明了 `timerFunc` 变量，然后会去检测环境来决定最终函数的实现方式。优先实现为promise的版本。

+ 为什么优先实现为微任务版本？

  根据 HTML Standard，在每个 task 运行完以后，UI 都会重渲染，那么在 microtask 中就完成数据更新，当前 task 结束就可以得到最新的 UI 了。如果新建一个 task 来做数据更新，那么渲染就会进行两次。

继续看 `nextTick()`，它的逻辑也很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，然后执行 `timerFunc` 时执行 `flushCallbacks`。`flushCallbacks` 的逻辑非常简单，对 `callbacks` 遍历，然后执行相应的回调函数。

+ 为什么使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数？

  原因是保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。

~~~tsx
export let isUsingMicroTask = false

const callbacks = []
let pending = false

function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

let timerFunc

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||

  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {

  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {

  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
~~~



### 访问真实DOM节点更新后的数据

```js
export default {
    data () {
        return {
            test: 'begin'
        };
    },
    methods () {
        handleClick () {
            this.test = 'end';
            this.$nextTick(() => {
                console.log(this.$refs.test.innerText);//打印"end"
            });
            console.log(this.$refs.test.innerText);//打印“begin”
        }
    }
}
```

使用Vue.js的global API的$nextTick方法。



### 事件循环

浏览器渲染进程的主线程非常繁忙，要做的事情很多，比如解析执行js代码，渲染UI，用户交互事件（如鼠标点击）等。

> 鼠标点击事件是页面渲染完毕之后，此时js脚本执行完毕，主线程一般处于等待状态。

为了有条不紊的处理这些任务于是引入了**事件循环系统和消息队列**。

事件循环系统就是渲染进程的主线程上形成一个执行栈，用来执行所有同步任务，相当于while(true)循环，然后不断取出消息队列中的任务来进行执行。

消息队列的任务有哪些呢？js脚本、定时器、渲染事件（解析html,css等）、用户交互事件等。

![image-20220510201244808](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220510201244808.png)



这基本上就是事件循环了，然后为什么又引入微任务，把任务区分为宏任务、微任务呢？

原因是为了高优先级的任务先处理。比如 DOM 节点的修改，如果直接塞到消息队列的尾部，那么实时性很差，因为要等前面的任务执行完毕；而如果做成同步任务，那么当前任务的执行时间会被拉长，从而导致执行效率下降。

针对这种情况，微任务就应运而生了。把消息队列中的任务称为宏任务，并且每个宏任务中包含了一个微任务队列。等宏任务执行完毕后，检查并执行微任务队列的微任务。

微任务系统本质上是 V8 引擎创建全局执行上下文的同时，也会在其内部创建一个微任务队列。产生微任务有两种方式：

一种是使用 MutationObserver 监控某个 DOM 节点，当 DOM 节点变化时就会产生 DOM 变化记录的微任务。

第二种是使用 Promise，当调用 resolve() 或者 reject() 的时候会产生微任务。











##  5.响应式存在的问题

### 对象添加属性

使用 `Object.defineProperty` 实现响应式的对象，当我们去给这个对象添加一个新的属性的时候，是不能够触发它的 setter 的，比如：

```js
var vm = new Vue({
  data:{
    a:1
  }
})
// vm.b 是非响应的
vm.b = 2
```

Vue 为了解决这个问题，定义了一个全局 API `Vue.set` 方法。







### 数组元素添加或删除

对于 vue 无法检测到数组元素的添加或删除的问题，通过将数组的7种原生方法重写为可以截获响应的方法，再将数组的每个成员进行 observe 来解决。

~~~js
function protoAugment (target, src: Object) {
  target.__proto__ = src
}

function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

const arrayProto = Array.prototype
/*创建一个新的数组对象，修改该对象上的数组的七个方法，防止污染原生数组方法*/
export const arrayMethods = Object.create(arrayProto)

 /*这里重写了数组的这些方法，在保证不污染原生数组原型的情况下重写数组的这些方法，截获数组的成员发生的变化，执行原生数组操作的同时dep通知关联的所有观察者进行响应式处理*/
[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) {
    
  /*将数组的原生方法缓存起来，后面要调用*/
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator () {
    let i = arguments.length
    const args = new Array(i)
    while (i--) {
      args[i] = arguments[i]
    }
    /*调用原生的数组方法*/
    const result = original.apply(this, args)

    /*数组新插入的元素需要重新进行observe才能响应式*/
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args
        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
      
    // notify change
    /*dep通知所有注册的观察者进行响应式处理*/
    ob.dep.notify()
    return result
  })
})
~~~







## 5.computed

函数首先创建 `vm._computedWatchers` 为一个空对象。

接着对 `computed` 对象做遍历，拿到计算属性的每一个 `userDef`，然后尝试获取这个 `userDef` 对应的 `getter` 函数。

接下来为每一个 `getter` 创建一个 `watcher`，这个 `watcher` 和渲染 `watcher` 有一点很大的不同，它是一个 `computed watcher`，因为 `const computedWatcherOptions = { computed: true }`。

最后对判断如果 `key` 不是 `vm` 的属性，则调用 `defineComputed(vm, key, userDef)`。

```js
const computedWatcherOptions = { computed: true }
function initComputed (vm: Component, computed: Object) {
  const watchers = vm._computedWatchers = Object.create(null)
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

接下来看 `defineComputed` 的实现。其实就是利用 `Object.defineProperty` 给计算属性对应的 `key` 值添加 getter 和 setter。

```js
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef
    sharedPropertyDefinition.set = noop
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        `Computed property "${key}" was assigned to but it has no setter.`,
        this
      )
    }
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

先看 getter，最终 getter 对应的是 `createComputedGetter(key)` 的返回值。`createComputedGetter` 返回一个函数 `computedGetter`，它就是计算属性对应的 getter。

```js
function createComputedGetter (key) {
  return function computedGetter () {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      watcher.depend()
      return watcher.evaluate()
    }
  }
}
```

我们知道计算属性是一个 `computed watcher`，它和普通的 `watcher` 有什么区别呢？

当初始化这个 `computed watcher` 实例的时候，构造函数部分逻辑稍有不同：

```js
constructor (
  vm: Component,
  expOrFn: string | Function,
  cb: Function,
  options?: ?Object,
  isRenderWatcher?: boolean
) {
  // ...
  if (this.computed) {
    this.value = undefined
    this.dep = new Dep()
  } else {
    this.value = this.get()
  }
}  
```









# 五、组件更新Diff算法

在vue中组件级别是一个 watcher 实例，因此即便一个组件内有10个节点使用了某个状态，但其实也只有一个 watcher 在观察这个状态的变化。所以当这个状态变化时，只能通知到组件，然后组件内部去通过 虚拟DOM 的 patch 进行对比与渲染。接下来我们来详细分析这一过程。

```js
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

组件的更新调用了 `vm._update` 方法：

~~~js
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
  const vm: Component = this
  // ...
  const prevVnode = vm._vnode
  if (!prevVnode) {
     // initial render
    vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
  } else {
    // updates
    vm.$el = vm.__patch__(prevVnode, vnode)
  }
  // ...
}
~~~

如果是相同节点则进行差异更新（ **patchVnode** ）（这里是通过操作DOM的接口直接更新DOM的），否则相应的增加、删除节点。

~~~js
  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    /*vnode不存在则直接调用销毁钩子*/
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
      return
    }

    let isInitialPatch = false
    const insertedVnodeQueue = []

    if (isUndef(oldVnode)) {
      /*oldVnode未定义的时候，其实也就是root节点，创建一个新的节点*/
      isInitialPatch = true
      createElm(vnode, insertedVnodeQueue, parentElm, refElm)
    } else {
      /*标记旧的VNode是否有nodeType*/
      const isRealElement = isDef(oldVnode.nodeType)
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        /*是同一个节点的时候直接修改现有的节点*/
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
      } else {
        if (isRealElement) {
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            /*当旧的VNode是服务端渲染的元素，hydrating记为true*/
            oldVnode.removeAttribute(SSR_ATTR)
            hydrating = true
          }
          if (isTrue(hydrating)) {
            /*需要合并到真实DOM上*/
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              /*调用insert钩子*/
              invokeInsertHook(vnode, insertedVnodeQueue, true)
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              )
            }
          }
          /*如果不是服务端渲染或者合并到真实DOM失败，则创建一个空的VNode节点替换它*/
          oldVnode = emptyNodeAt(oldVnode)
        }

        /*取代现有元素*/
        const oldElm = oldVnode.elm
        const parentElm = nodeOps.parentNode(oldElm)
        createElm(
          vnode,
          insertedVnodeQueue,
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        )

        if (isDef(vnode.parent)) {
          /*组件根节点被替换，遍历更新父节点element*/
          let ancestor = vnode.parent
          while (ancestor) {
            ancestor.elm = vnode.elm
            ancestor = ancestor.parent
          }
          if (isPatchable(vnode)) {
            /*调用create回调*/
            for (let i = 0; i < cbs.create.length; ++i) {
              cbs.create[i](emptyNode, vnode.parent)
            }
          }
        }

        if (isDef(parentElm)) {
          /*移除老节点*/
          removeVnodes(parentElm, [oldVnode], 0, 0)
        } else if (isDef(oldVnode.tag)) {
          /*调用destroy钩子*/
          invokeDestroyHook(oldVnode)
        }
      }
    }

    /*调用insert钩子*/
    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
    return vnode.elm
  }
~~~

因为 `oldVnode` 不为空，并且它和 `vnode` 都是 VNode 类型，接下来会通过 `sameVNode(oldVnode, vnode)` 判断它们是否是相同的 VNode 来决定走不同的更新逻辑：

```js
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

我们先来说一下不同的情况：

## 新旧节点不同

如果新旧 `vnode` 不同，那么更新的逻辑非常简单，它本质上是要替换已存在的节点，大致分为 3 步

+ 创建新节点	

```js
const oldElm = oldVnode.elm
const parentElm = nodeOps.parentNode(oldElm)
// create new node
createElm(
  vnode,
  insertedVnodeQueue,
  // extremely rare edge case: do not insert if old element is in a
  // leaving transition. Only happens when combining  transition +
  // keep-alive + HOCs. (#4590)
  oldElm._leaveCb ? null : parentElm,
  nodeOps.nextSibling(oldElm)
)
```

以当前旧节点为参考节点，创建新的节点，并插入到 DOM 中，即`createElm`的逻辑。

+ 更新父的占位符节点

~~~js
if (isDef(vnode.parent)) {
  let ancestor = vnode.parent
  const patchable = isPatchable(vnode)
  while (ancestor) {
    for (let i = 0; i < cbs.destroy.length; ++i) {
      cbs.destroy[i](ancestor)
    }
    ancestor.elm = vnode.elm
    if (patchable) {
      for (let i = 0; i < cbs.create.length; ++i) {
        cbs.create[i](emptyNode, ancestor)
      }
      // #6513
      // invoke insert hooks that may have been merged by create hooks.
      // e.g. for directives that uses the "inserted" hook.
      const insert = ancestor.data.hook.insert
      if (insert.merged) {
        // start at index 1 to avoid re-invoking component mounted hook
        for (let i = 1; i < insert.fns.length; i++) {
          insert.fns[i]()
        }
      }
    } else {
      registerRef(ancestor)
    }
    ancestor = ancestor.parent
  }
}
~~~

找到当前 `vnode` 的父的占位符节点，先执行各个 `module` 的 `destroy` 的钩子函数，如果当前占位符是一个可挂载的节点，则执行 `module` 的 `create` 钩子函数。

+ 删除旧节点

```js
if (isDef(parentElm)) {
  removeVnodes(parentElm, [oldVnode], 0, 0)
} else if (isDef(oldVnode.tag)) {
  invokeDestroyHook(oldVnode)
}
```

把 `oldVnode` 从当前 DOM 树中删除，如果父节点存在，则执行 `removeVnodes` 方法：

```js
function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
  for (; startIdx <= endIdx; ++startIdx) {
    const ch = vnodes[startIdx]
    if (isDef(ch)) {
      if (isDef(ch.tag)) {
        removeAndInvokeRemoveHook(ch)
        invokeDestroyHook(ch)
      } else { // Text node
        removeNode(ch.elm)
      }
    }
  }
}

function removeAndInvokeRemoveHook (vnode, rm) {
  if (isDef(rm) || isDef(vnode.data)) {
    let i
    const listeners = cbs.remove.length + 1
    if (isDef(rm)) {
      // we have a recursively passed down rm callback
      // increase the listeners count
      rm.listeners += listeners
    } else {
      // directly removing
      rm = createRmCb(vnode.elm, listeners)
    }
    // recursively invoke hooks on child component root node
    if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
      removeAndInvokeRemoveHook(i, rm)
    }
    for (i = 0; i < cbs.remove.length; ++i) {
      cbs.remove[i](vnode, rm)
    }
    if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
      i(vnode, rm)
    } else {
      rm()
    }
  } else {
    removeNode(vnode.elm)
  }
}

function invokeDestroyHook (vnode) {
  let i, j
  const data = vnode.data
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode)
    for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode)
  }
  if (isDef(i = vnode.children)) {
    for (j = 0; j < vnode.children.length; ++j) {
      invokeDestroyHook(vnode.children[j])
    }
  }
}
```

删除节点逻辑很简单，就是遍历待删除的 `vnodes` 做删除。

其中 `removeAndInvokeRemoveHook` 的作用是从 DOM 中移除节点并执行 `module` 的 `remove` 钩子函数，并对它的子节点递归调用 `removeAndInvokeRemoveHook` 函数；

`invokeDestroyHook` 是执行 `module` 的 `destory` 钩子函数以及 `vnode` 的 `destory` 钩子函数，并对它的子 `vnode` 递归调用 `invokeDestroyHook` 函数；

`removeNode` 就是调用平台的 DOM API 去把真正的 DOM 节点移除。

对于新旧节点不同的情况，这种创建新节点 -> 更新占位符节点 -> 删除旧节点的逻辑是很容易理解的。接下来来看新旧节点相同的情况：



## 新旧节点相同

新旧节点相同，会调用 `patchVNode` 方法：

~~~js
function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
  if (oldVnode === vnode) {
    return
  }

  const elm = vnode.elm = oldVnode.elm

  if (isTrue(oldVnode.isAsyncPlaceholder)) {
    if (isDef(vnode.asyncFactory.resolved)) {
      hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
    } else {
      vnode.isAsyncPlaceholder = true
    }
    return
  }

  if (isTrue(vnode.isStatic) &&
    isTrue(oldVnode.isStatic) &&
    vnode.key === oldVnode.key &&
    (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
  ) {
    vnode.componentInstance = oldVnode.componentInstance
    return
  }
	
  let i
  const data = vnode.data
  if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
    i(oldVnode, vnode)
  }

  const oldCh = oldVnode.children
  const ch = vnode.children
  if (isDef(data) && isPatchable(vnode)) {
    for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
    if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
  }
  if (isUndef(vnode.text)) {
    if (isDef(oldCh) && isDef(ch)) {
      if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
    } else if (isDef(ch)) {
      if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
      addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
    } else if (isDef(oldCh)) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (isDef(oldVnode.text)) {
      nodeOps.setTextContent(elm, '')
    }
  } else if (oldVnode.text !== vnode.text) {
    nodeOps.setTextContent(elm, vnode.text)
  }
  if (isDef(data)) {
    if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
  }
}
~~~

`patchVnode` 的作用就是把新的 `vnode` `patch` 到旧的 `vnode` 上，关键的核心逻辑有四部分：

- 执行 `prepatch` 钩子函数

```js
let i
const data = vnode.data
if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
  i(oldVnode, vnode)
}
```

`prepatch`的定义在 `src/core/vdom/create-component.js` 中：

```js
const componentVNodeHooks = {
  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  }
}
```

`prepatch` 方法就是拿到新的 `vnode` 的组件配置以及组件实例，去执行 `updateChildComponent` 方法：

```js
export function updateChildComponent (
  vm: Component,
  propsData: ?Object,
  listeners: ?Object,
  parentVnode: MountedComponentVNode,
  renderChildren: ?Array<VNode>
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true
  }

  const hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  )

  vm.$options._parentVnode = parentVnode
  vm.$vnode = parentVnode // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode
  }
  vm.$options._renderChildren = renderChildren

  vm.$attrs = parentVnode.data.attrs || emptyObject
  vm.$listeners = listeners || emptyObject

  if (propsData && vm.$options.props) {
    toggleObserving(false)
    const props = vm._props
    const propKeys = vm.$options._propKeys || []
    for (let i = 0; i < propKeys.length; i++) {
      const key = propKeys[i]
      const propOptions: any = vm.$options.props // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm)
    }
    toggleObserving(true)
    // keep a copy of raw propsData
    vm.$options.propsData = propsData
  }

  listeners = listeners || emptyObject
  const oldListeners = vm.$options._parentListeners
  vm.$options._parentListeners = listeners
  updateComponentListeners(vm, listeners, oldListeners)

  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context)
    vm.$forceUpdate()
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false
  }
}
```

`updateChildComponent` 的逻辑也非常简单，由于更新了 `vnode`，那么 `vnode` 对应的实例 `vm` 的一系列属性也会发生变化，包括占位符 `vm.$vnode` 的更新、`slot` 的更新，`listeners` 的更新，`props` 的更新等等。

- 执行 `update` 钩子函数

```js
if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
}
```

回到 `patchVNode` 函数，在执行完新的 `vnode` 的 `prepatch` 钩子函数，会执行所有 `module` 的 `update` 钩子函数以及用户自定义 `update` 钩子函数。

- 完成 `patch` 过程

```js
const oldCh = oldVnode.children
const ch = vnode.children
if (isDef(data) && isPatchable(vnode)) {
  for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
  if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
}
if (isUndef(vnode.text)) {
  if (isDef(oldCh) && isDef(ch)) {
    if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
  } else if (isDef(ch)) {
    if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
    addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
  } else if (isDef(oldCh)) {
    removeVnodes(elm, oldCh, 0, oldCh.length - 1)
  } else if (isDef(oldVnode.text)) {
    nodeOps.setTextContent(elm, '')
  }
} else if (oldVnode.text !== vnode.text) {
  nodeOps.setTextContent(elm, vnode.text)
}
```

如果 `vnode` 是个文本节点且新旧文本不相同，则直接替换文本内容。如果不是文本节点，则判断它们的子节点，并分了几种情况处理：

1. `oldCh` 与 `ch` 都存在且不相同时，使用 `updateChildren` 函数来更新子节点。

2. 如果只有 `ch` 存在，表示旧节点不需要了。如果旧的节点是文本节点则先将节点的文本清除，然后通过 `addVnodes` 将 `ch` 批量插入到新节点 `elm` 下。

3. 如果只有 `oldCh` 存在，表示更新的是空节点，则需要将旧的节点通过 `removeVnodes` 全部清除。

4. 当只有旧节点是文本节点的时候，则清除其节点文本内容。

- 执行 `postpatch` 钩子函数

```js
if (isDef(data)) {
  if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
}
```

再执行完 `patch` 过程后，会执行 `postpatch` 钩子函数，它是组件自定义的钩子函数，有则执行。

那么在整个 `pathVnode` 过程中，最复杂的就是 `updateChildren` 方法了，下面我们来单独介绍它。

~~~js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0, newStartIdx = 0, 
        oldEndIdx = oldCh.length - 1,oldStartVnode = oldCh[0], oldEndVnode = oldCh[oldEndIdx],
    	newEndIdx = newCh.length - 1, newStartVnode = newCh[0], newEndVnode = newCh[newEndIdx]
    
	while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            //指针移动
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            //指针移动
        } else if (sameVnode(oldStartVnode, newEndVnode)) { 
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            //move node
            //指针移动
        } else if (sameVnode(oldEndVnode, newStartVnode)) { 
            patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
            //move node
            //指针移动
        } else {
            //createKeyToOldIdx
            //比如childre是这样的 [{xx: xx, key: 'key0'}, {xx: xx, key: 'key1'}, 	{xx: xx, key: 'key2'}]  beginIdx = 0   endIdx = 2  
          	//结果生成{key0: 0, key1: 1, key2: 2}
            //if not find in Map, 则 createElement && 指针移动
            //if find, 则：
                //if (sameVnode): patch && move node && 指针移动
                //else: createElement && 指针移动
            
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
        /*如果newStartVnode新的VNode节点存在key并且这个key在oldVnode中能找到则返回这个节点的idxInOld（即第几个节点，下标）*/
        idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null
        if (isUndef(idxInOld)) { // New element
          /*newStartVnode没有key或者是该key没有在老节点中找到则创建一个新的节点*/
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          newStartVnode = newCh[++newStartIdx]
        } else {
          /*获取同key的老节点*/
          elmToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !elmToMove) {
            /*如果elmToMove不存在说明之前已经有新节点放入过这个key的DOM中，提示可能存在重复的key，确保v-for的时候item有唯一的key值*/
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }
          if (sameVnode(elmToMove, newStartVnode)) {
            /*如果新VNode与得到的有相同key的节点是同一个VNode则进行patchVnode*/
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue)
            /*因为已经patchVnode进去了，所以将这个老节点赋值undefined，之后如果还有新节点与该节点key相同可以检测出来提示已有重复的key*/
            oldCh[idxInOld] = undefined
            /*当有标识位canMove实可以直接插入oldStartVnode对应的真实DOM节点前面*/
            canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          } else {
            /*当新的VNode与找到的同样key的VNode不是sameVNode的时候（比如说tag不一样或者是有不一样type的input标签），创建一个新的节点*/
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
            newStartVnode = newCh[++newStartIdx]
          }
        }
	}
    if (oldStartIdx > oldEndIdx) {
        //addVnodes
    }else if (newStartIdx > newEndIdx) {
        //removeVnodes
    }
}
~~~



diff 操作具体来说就是新旧 VNode 节点的左右头尾两侧都有一个指针，用来遍历新旧 VNode 列表。

<img src="https://camo.githubusercontent.com/25512af67dc2d9ffbacc876598509eb77b804572d045805c0195555038dd511d/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32382f353961343031356262323736352e706e67" alt="img" style="zoom:50%;" />

1. 当新老 VNode 节点的 start 或者 end 满足 sameVnode 时，直接将该 VNode 节点进行 patchVnode 即可。

   <img src="https://camo.githubusercontent.com/c5be36bb8b6bff3a09200eefe210b3cf2332f236f3ff30048fde9de1f51773b4/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32382f353961343063313263313635352e706e67" alt="img" style="zoom:50%;" />

2. 如果直接对比不符合，那么进行交错对比，即旧的 start 与新的 end。对比发现满足 sameVnode 的话，进行 patchVNode 并且将该 VNode 移动到后面。

   <img src="https://camo.githubusercontent.com/f20fc12ad620ef93d5b442c88d8ba1f80f1a0ff5c79beb60ffa578eefaea8bc9/68747470733a2f2f6f6f6f2e306f302e6f6f6f2f323031372f30382f32382f353961343231343738343937392e706e67" alt="img" style="zoom: 33%;" />

3. 如果不匹配，则对比旧的 end 与新的 start 对比。对比发现满足 sameVnode 的话，进行 patchVNode 并且将该 VNode 移动到前面。

   <img src="https://camo.githubusercontent.com/8735f850e213c66aa23f3d026bd4075613213c489d8d7ab33fdbfde08574fe4f/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961346337303638356431322e706e67" alt="img" style="zoom: 50%;" />

4. 如果以上通过指针无法找到相同的节点，则创建一个 key 与旧VNode在列表中的索引对应的哈希表。然后从这个哈希表中可以查找是否有与 newStartVnode 相同 key 的旧 VNode 节点，如果同时满足 sameVnode，进行 patchVNode 并且将该 VNode 移动到前面。

   <img src="https://camo.githubusercontent.com/c9520d25ba2f2a2beba98d80d274c244c6879959800d923ed40378381bcd302b/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961346437353532643239392e706e67" alt="img" style="zoom:50%;" />

5. 当然也有可能找不到一致的key，或者是即便 key 相同却不是 sameVnode，这个时候会创建一个新的节点。

6. 接下来等循环结束处理多余的节点或者不够的节点，直接增加或者删除节点即可。

   



diff 流程：对比新旧节点的 childNodeList，通过首尾指针双向匹配，匹配成功则相应更新即移位。同时指针移动，继续匹配。如果无法通过指针直接匹配，则创建一个{ key，nodeIdx }的哈希表（这里的key就是 v-for指令指定的唯一key），通过查找这个哈希表的 key 进行匹配相同节点，如果仍然不能匹配，则创建一个新节点。





## diff的优化，sameVnode

patch时发现不是sameVNode，则直接销毁旧的 vnode，渲染新的 vnode。这也解释了为什么 diff 是同层对比。

但是**为了减少 DOM 操作的性能开销，我们要尽可能的复用 DOM 元素。所以我们需要判断出是否有节点需要移动，应该如何移动以及找出那些需要被添加或删除的节点。**

那么怎么判断新旧 VNode 是 sameVNode 呢？

1. 比较标签名

2. 比较key

key主要用在比较childrenNode时，创建一个key -> index子节点下标映射表，然后用新vnode的key去找出在旧节点中可以复用的节点，将其直接插入oldStartVnode对应的真实DOM节点前面。



~~~js
function sameVnode (a, b) {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b)
  )
}
/*
  判断当标签是<input>的时候，type是否相同
  某些浏览器不支持动态修改<input>类型，所以他们被视为不同节点
*/
function sameInputType (a, b) {
  if (a.tag !== 'input') return true
  let i
  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
  return typeA === typeB
}
~~~











## 2.vue3中的diff



~~~tsx
const patchKeyedChildren = (
    c1: VNode[],
    c2: VNodeArrayChildren,
    container: RendererElement,
    parentAnchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) => {
    let i = 0
    const l2 = c2.length
    // oldVnode数组长度
    let e1 = c1.length - 1 // prev ending index
    // vnode数组长度
    let e2 = l2 - 1 // next ending index

    // 从头部开始遍历
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i]
      const n2 = (c2[i] = optimized
        ? cloneIfMounted(c2[i] as VNode)
        : normalizeVNode(c2[i]))
      // 如果节点相同, 那么就继续遍历
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        // 节点不同就直接跳出循环
        break
      }
      i++
    }

    // 从尾部开始遍历
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1]
      const n2 = (c2[e2] = optimized
        ? cloneIfMounted(c2[e2] as VNode)
        : normalizeVNode(c2[e2]))
      // 如果节点相同, 就继续遍历
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        )
      } else {
        // 不同就直接跳出循环
        break
      }
      e1--
      e2--
    }

    // 如果旧节点遍历完了, 依然有新的节点, 那么新的节点就是添加(mount)
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (a b)
    // c (a b)
    // i = 0, e1 = -1, e2 = 0
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
        while (i <= e2) {
          patch(
            null,
            (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i])),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          i++
        }
      }
    }

    // 如果新的节点遍历完了, 还有旧的节点, 那么旧的节点就是移除的
    // (a b) c
    // (a b)
    // i = 2, e1 = 2, e2 = 1
    // a (b c)
    // (b c)
    // i = 0, e1 = 0, e2 = -1
    else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
      }
    }

    // 如果有多余的节点, 那么就移除节点
    // 之后是移动节点和挂载新节点
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      // 紊乱序列的起点
      const s1 = i // prev starting index
      const s2 = i // next starting index

      // 根据key建立map索引图 --> { key1: 2, key2: 3, key3: 4 } 紊乱序列从下标2开始
      const keyToNewIndexMap: Map<string | number, number> = new Map()
      // 遍历新节点数组的紊乱序列来填充好 map 索引图
      for (i = s2; i <= e2; i++) {
        const nextChild = (c2[i] = optimized
          ? cloneIfMounted(c2[i] as VNode)
          : normalizeVNode(c2[i]))
        if (nextChild.key != null) {
          if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
            warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            )
          }
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }

      // 遍历剩下的旧节点, 新旧对比, 移除不使用的旧节点
      let j
      let patched = 0
      // 紊乱序列的长度，即需要被 patch 的节点数组长度
      const toBePatched = e2 - s2 + 1
      let moved = false
      let maxNewIndexSoFar = 0
      // 这个map数组的下标是vnode数组下标的映射，值是oldVnode数组相应元素的下标索引
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // 不在 toBePatched 的范围的节点直接移除
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        if (prevChild.key != null) {
          // 获得指定节点在oldVnode数组的下标索引
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // key-less node, try to locate a key-less node of the same type
          for (j = s2; j <= e2; j++) {
            if (
              newIndexToOldIndexMap[j - s2] === 0 &&
              isSameVNodeType(prevChild, c2[j] as VNode)
            ) {
              newIndex = j
              break
            }
          }
        }
        // 如果新节点中没有这个旧节点那么直接移除
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
          // 如果有的话就进行patch
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          patch(
            prevChild,
            c2[newIndex] as VNode,
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
          patched++
        }
      }

      // 拿到最长递增子序列进行move 和 mount
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : EMPTY_ARR
      j = increasingNewIndexSequence.length - 1
      // looping backwards so that we can use last patched node as anchor
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i
        const nextChild = c2[nextIndex] as VNode
        const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
        if (newIndexToOldIndexMap[i] === 0) {
          // mount new
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          )
        } else if (moved) {
          // move if:
          // There is no stable subsequence (e.g. a reverse)
          // OR current node is not among the stable sequence
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, MoveType.REORDER)
          } else {
            j--
          }
        }
      }
    }
  }
~~~





# 七、vue组件挂载篇

对于组件的挂载，与上篇的区别在于：

1. 创建vnode时创建的是组件vnode。
2. patch过程的差异。



## createComponent

从`_createElement` 的实现中，可以看到其中有一段逻辑是对参数 `tag` 的判断，如果是一个普通的 html 标签，像上一章的例子那样是一个普通的 div，则会实例化一个普通 VNode 节点，否则通过 `createComponent` 方法创建一个组件 VNode。

~~~tsx
if (typeof tag === 'string') {
  // ......
} else {
  vnode = createComponent(tag, data, context, children)
}
~~~

本章我们分析组件是如何挂载的。

先看 createComponent 的实现：

~~~tsx
export function createComponent (
  // ......
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // ......
  installComponentHooks(data)

  // ......
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )
  return vnode
}
~~~

`createComponent` 的逻辑也会有一些复杂，这里针对组件渲染这个 case 主要分析 3 个关键步骤：



### 构造子类构造函数

当我们传入一个组件的时候，实际上就是传入一个对象，于是会执行：

~~~ts
const baseCtor = context.$options._base

if (isObject(Ctor)) {
  Ctor = baseCtor.extend(Ctor)
}
~~~

这里 `baseCtor` 实际上就是 Vue。这个的定义是在最开始初始化 Vue 的阶段做的：

~~~tsx
Vue.options._base = Vue
~~~

这里定义的是 `Vue.options`，而我们的 `createComponent` 取的是 `context.$options`，其实是 Vue 的`_init`中会把 Vue 中 option 拓展到vm.$options 上。所以我们也就能通过 `vm.$options._base` 拿到 Vue 这个构造函数了。

接下来我们继续看 Vue.extend 方法：

~~~tsx
Vue.extend = function (extendOptions: Object): Function {
  extendOptions = extendOptions || {}
  const Super = this
  const SuperId = Super.cid
  const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
  if (cachedCtors[SuperId]) {
    return cachedCtors[SuperId]
  }

  const name = extendOptions.name || Super.options.name
  if (process.env.NODE_ENV !== 'production' && name) {
    validateComponentName(name)
  }

  const Sub = function VueComponent (options) {
    this._init(options)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
  Sub.cid = cid++
  Sub.options = mergeOptions(
    Super.options,
    extendOptions
  )
  Sub['super'] = Super

  if (Sub.options.props) {
    initProps(Sub)
  }
  if (Sub.options.computed) {
    initComputed(Sub)
  }

  Sub.extend = Super.extend
  Sub.mixin = Super.mixin
  Sub.use = Super.use

  ASSET_TYPES.forEach(function (type) {
    Sub[type] = Super[type]
  })

  if (name) {
    Sub.options.components[name] = Sub
  }

  Sub.superOptions = Super.options
  Sub.extendOptions = extendOptions
  Sub.sealedOptions = extend({}, Sub.options)

  cachedCtors[SuperId] = Sub
  return Sub
}

~~~

`Vue.extend` 的作用实际上就是构造一个 `Vue` 的子类，它通过 Object.create 设置 Sub 构造函数的原型，然后对 `Sub` 这个对象本身扩展了一些属性，如扩展 `options`、添加全局 API 等；并且对配置中的 `props` 和 `computed` 做了初始化工作；最后对于这个 `Sub` 构造函数做了缓存，避免多次执行 `Vue.extend` 的时候对同一个子组件重复构造。

这样当我们去实例化 `Sub` 的时候，就会执行 `this._init` 逻辑再次走到了 `Vue` 实例的初始化逻辑。

~~~tsx
const Sub = function VueComponent (options) {
  this._init(options)
}
~~~



### 安装组件钩子函数

接下来 createComponent 的另一个重要逻辑是：

~~~
installComponentHooks(data)
~~~

 VNode 的 patch 流程中对外暴露了各种时机的钩子函数，方便我们做一些额外的事情。Vue 在初始化一个 Component 类型的 VNode 的过程中实现了几个钩子函数：

~~~tsx
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}

const hooksToMerge = Object.keys(componentVNodeHooks)
~~~



整个 `installComponentHooks` 的过程就是把 `componentVNodeHooks` 的钩子函数合并到 `data.hook` 中，在 VNode 执行 `patch` 的过程中执行相关的钩子函数。这里的合并策略是，在合并过程中，如果某个时机的钩子已经存在 `data.hook` 中，那么通过执行 `mergeHook` 函数做合并，这个逻辑很简单，就是在最终执行的时候，依次执行这两个钩子函数即可。

~~~tsx
function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
~~~





### 实例化vnode

最后一步非常简单，通过 `new VNode` 实例化一个 `vnode` 并返回。需要注意的是和普通元素节点的 `vnode` 不同，组件的 `vnode` 是没有 `children` 的。

~~~tsx
const name = Ctor.options.name || tag
const vnode = new VNode(
  `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
  data, undefined, undefined, undefined, context,
  { Ctor, propsData, listeners, tag, children },
  asyncFactory
)
return vnode
~~~



## patch

组件 patch 过程在有以下不同，即createComponent表现不同：

~~~tsx
function createElm (
  vnode,
  insertedVnodeQueue,
  parentElm,
  refElm,
  nested,
  ownerArray,
  index
) {
  // ...
  if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
    return
  }
  // ...
}
~~~

先来看createComponent的实现：

~~~tsx
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data
  if (isDef(i)) {
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
    if (isDef(i = i.hook) && isDef(i = i.init)) {
      i(vnode, false /* hydrating */)
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      initComponent(vnode, insertedVnodeQueue)
      insert(parentElm, vnode.elm, refElm)
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm)
      }
      return true
    }
  }
}
~~~

这里首先对 vnode.data 做了判断，如果vnode是一个组件 vnode，那么条件会满足，并且得到 `i` 就是 `init` 钩子函数

















## 4.Watcher到视图

Watcher对象会通过调用updateComponent方法来达到更新视图的目的。

```js
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}
```

updateComponent就执行一句话，_render函数会返回一个新的Vnode节点，传入_update中与旧的VNode对象进行对比，经过一个patch的过程得到两个VNode节点的差异返回真实DOM，最后将这些差异渲染到真实环境形成视图。



```js
update () {
    if (this.lazy) {
        this.dirty = true
    } else if (this.sync) {
        this.run()
    } else {
        /*异步推送到观察者队列中，下一个tick时调用。*/
        queueWatcher(this)
    }
}
```

我们发现Vue.js默认是使用异步执行DOM更新。 当异步执行update的时候，会调用queueWatcher函数。

Watch对象并不是立即更新视图，而是被push进了一个队列queue，此时状态处于waiting的状态，这时候会继续会有Watch对象被push进这个队列queue，等到下一个tick运行时，这些Watch对象才会被遍历取出，更新视图。

```js
 /*将一个观察者对象push进观察者队列，在队列中已经存在相同的id则该观察者对象将被跳过，除非它是在队列被刷新时推送*/
export function queueWatcher (watcher: Watcher) {
  /*获取watcher的id*/
  const id = watcher.id
  /*检验id是否存在，已经存在则直接跳过，不存在则标记哈希表has，用于下次检验*/
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      /*如果没有flush掉，直接push到队列中即可*/
      queue.push(watcher)
    } else {
      let i = queue.length - 1
      while (i >= 0 && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(Math.max(i, index) + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
```























### 映射到真实DOM

由于Vue使用了虚拟DOM，所以虚拟DOM可以在任何支持JavaScript语言的平台上操作，譬如说目前Vue支持的浏览器平台或是weex，在虚拟DOM的实现上是一致的。那么最后虚拟DOM如何映射到真实的DOM节点上呢？

Vue为平台做了一层适配层，不同平台之间通过适配层对外提供相同的接口，虚拟DOM进行操作真实DOM节点的时候，只需要调用这些适配层的接口即可，而内部实现则不需要关心，它会根据平台的改变而改变。

现在又出现了一个问题，我们只是将虚拟DOM映射成了真实的DOM。那如何给这些DOM加入attr、class、style等DOM属性呢？

这要依赖于虚拟DOM的生命钩子。虚拟DOM提供了如下的钩子函数，分别在不同的时期会进行调用。

```js
const hooks = ['create', 'activate', 'update', 'remove', 'destroy']

/*构建cbs回调函数，web平台上见/platforms/web/runtime/modules*/
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = []
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]])
      }
    }
  }
```







# 七、其他源码

## 1. keep-alive

### LRU

LRU（ least recently used）根据数据的历史记录来淘汰数据，重点在于**保护最近被访问/使用过的数据，淘汰现阶段最久未被访问的数据**

> LRU的主体思想在于：如果数据最近被访问过,那么将来被访问的几率也更高

![fifo对比lru原理](https://zoo.team/images/upload/upload_de96ea8ddceacbc7ad6b6d27fc8e3d0c.jpg)



经典的 LRU 实现一般采用双向链表 + Hash表。借助Hash表来通过key快速映射到对应的链表节点，然后进行插入和删除操作。这样既解决了hash表无固定顺序的缺点，又解决了链表查找慢的缺点。





![img](https://pic.leetcode-cn.com/1647580694-NAtygG-4.jpg)

**但实际上在 js 中无需这样实现，这点我们后面在说。先看 vue 的 keep-alive 实现。**



### **keep-alive 实现原理**

通过 keep-alive 组件插槽，获取第一个子节点。根据 include、exclude 判断是否需要缓存，通过组件的 key，判断是否命中缓存。利用 LRU 算法，更新缓存以及对应的 keys 数组。根据 max 控制缓存的最大组件数量。

先看 vue2 的实现，通过数组+Object，数组用来记录缓存顺序，Object用来模仿Map的功能进行vnode的缓存（`created` 钩子里定义的 `this.cache` 和 `this.keys`）：

![image-20220516190639194](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220516190639194.png)

~~~tsx
export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
~~~

可以看到 `<keep-alive>` 组件的实现也是一个对象，注意它有一个属性 `abstract` 为 true，是一个抽象组件，它在组件实例建立父子关系的时候会被忽略，发生在 `initLifecycle` 的过程中：

~~~js
// 忽略抽象组件
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}
vm.$parent = parent
~~~

`<keep-alive>` 直接实现了 `render` 函数，执行 `<keep-alive>` 组件渲染的时候，就会执行到这个 `render` 函数，接下来我们分析一下它的实现。

首先通过插槽获取第一个子元素的 `vnode`：

```js
const slot = this.$slots.default
const vnode: VNode = getFirstComponentChild(slot)
```

`<keep-alive>` 只处理第一个子元素，所以一般和它搭配使用的有 `component` 动态组件或者是 `router-view`。

然后又判断了当前组件的名称和 `include`、`exclude` （白名单、黑名单）的关系：

```js
// check pattern
const name: ?string = getComponentName(componentOptions)
const { include, exclude } = this
if (
  // not included
  (include && (!name || !matches(include, name))) ||
  // excluded
  (exclude && name && matches(exclude, name))
) {
  return vnode
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  return false
}
```

组件名如果不满足条件，那么就直接返回这个组件的 `vnode`，否则的话走下一步缓存：

```js
const { cache, keys } = this
const key: ?string = vnode.key == null
  ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
  : vnode.key
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
} else {
  cache[key] = vnode
  keys.push(key)
  // prune oldest entry
  if (this.max && keys.length > parseInt(this.max)) {
    pruneCacheEntry(cache, keys[0], keys, this._vnode)
  }
}
```

如果命中缓存，则直接从缓存中拿 `vnode` 的组件实例，并且重新调整了 key 的顺序放在了最后一个；否则把 `vnode` 设置进缓存，如果配置了 `max` 并且缓存的长度超过了 `this.max`，还要从缓存中删除第一个（**这里的实现有一个问题：判断是否超过最大容量应该放在 put 操作前。为什么呢？我们设置一个缓存队列，都已经满了你还塞进来？肯定得先删一个才能塞进来新的。**）：

```js
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null 
  remove(keys, key)
}
```

除了从缓存中删除外，还要判断如果要删除的缓存的组件 `tag` 不是当前渲染组件 `tag`，则执行删除缓存的组件实例的 `$destroy` 方法。



### vue3的实现

vue3 实现思路基本和 vue2 类似，这里不再赘述。主要看 LRU 算法的实现。

vue3 通过 set + map 实现 LRU 算法：

~~~ts
const cache: Cache = new Map()
const keys: Keys = new Set()
~~~



并且在判断是否超过缓存容量时的实现比较巧妙：

~~~tsx
if (max && keys.size > parseInt(max as string, 10)) {
  pruneCacheEntry(keys.values().next().value)
}
~~~

这里巧妙的利用 Set 是可迭代对象的特定，通过 keys.value() 获得包含 keys 中所有 key 的可迭代对象，并通过 next().value 获得第一个元素，然后进行删除。



### 借助vue3的思路实现LRU算法

#### [Leetcode 题目—— LRU 缓存](https://leetcode.cn/problems/lru-cache/)

~~~js
var LRUCache = function(capacity) {
  this.map = new Map();
  this.capacity = capacity;
};

LRUCache.prototype.get = function(key) {
  if (this.map.has(key)) {
    let value = this.map.get(key);
    // 删除后，再 set ，相当于更新到 map 最后一位
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  return -1;
};

LRUCache.prototype.put = function(key, value) {
  // 如果已经存在，那就要更新，即先删了再进行后面的 set
  if (this.map.has(key)) {
    this.map.delete(key);
  } else { //如果 map 中不存在，要先判断是否超过最大容量
    if (this.map.size === this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
  }
  this.map.set(key, value);
};
~~~

这里我们直接通过 Map 来就可以直接实现了。

而 keep-alive 的实现因为缓存的内容是 vnode，直接操作 Map 中缓存的位置代价较大，而采用 Set / Array 来记录缓存的 key 来模拟缓存顺序。















## 2. transition

在我们平时的开发中，经常会遇到如下需求，一个 DOM 节点的插入和删除或者是显示和隐藏，我们不想让它特别生硬，通常会考虑加一些过渡效果。

此时 Vue.js 给我们提供了过渡的解决方案——内置组件 `<transition>` 。我们可以利用它配合一些 CSS3 样式很方便地实现过渡动画。

在下列情形中，可以给任何元素和组件添加 entering/leaving 过渡：

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件













































# 八、vue3

1. createApp

~~~js
export const createApp = ((...args) => {
  // 1.创建app对象
  const app = ensureRenderer().createApp(...args)

  // 2.这里取出了app中的mount方法，因为待会儿要进行重写
  const { mount } = app

  // 3.重写mount方法
  // 这里重写的目的是考虑到跨平台(app.mount里面只包含和平台无关的代码)
  // 这些重写的代码都是一些和web关系比较大的代码(比如其他平台也可以进行类似的重写)
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    // normalizeContainer方法就是在web端获取我们的元素，比如div#app
    const container = normalizeContainer(containerOrSelector)
    if (!container) return
    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML
    }
    // clear content before mounting
    // 先清空container中的原本内容
    container.innerHTML = ''
    // 调用真正的mount函数, 进行挂载
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }

  // 3.返回app
  return app
})
~~~



2. ensureRenderer

~~~js
function ensureRenderer() {
  // 如果已经有渲染器直接返回
  // 如果没有渲染器, 那么调用createRenderer创建渲染器
  return renderer || (renderer = createRenderer<Node, Element>(rendererOptions))
}
~~~



3. createRenderer

~~~js
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
~~~



4. baseCreateRenderer

~~~js
return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
    }
~~~



5. createApp

~~~tsx
function createApp(rootComponent, rootProps = null) {
    
    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    // 定义app对象
    const app: App = (context.app = {
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,

      version,

      get config() {
        return context.config
      },

		// 注册插件
      use(plugin: Plugin, ...options: any[]) {
        if (installedPlugins.has(plugin)) {
          warn(`Plugin has already been applied to target app.`)
        } else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin)
          plugin.install(app, ...options)
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin)
          plugin(app, ...options)
        } else if (__DEV__) {
          warn(
            `A plugin must either be a function or an object with an "install" ` +
              `function.`
          )
        }
        return app
      },

      mixin(mixin: ComponentOptions) {
        if (__FEATURE_OPTIONS_API__) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin)
            if (mixin.props || mixin.emits) {
              context.deopt = true
            }
          } else if (__DEV__) {
            warn(
              'Mixin has already been applied to target app' +
                (mixin.name ? `: ${mixin.name}` : '')
            )
          }
        } else if (__DEV__) {
          warn('Mixins are only available in builds supporting Options API')
        }
        return app
      },

      component(name: string, component?: Component): any {
        if (__DEV__) {
          validateComponentName(name, context.config)
        }
        if (!component) {
          return context.components[name]
        }
        if (__DEV__ && context.components[name]) {
          warn(`Component "${name}" has already been registered in target app.`)
        }
        context.components[name] = component
        return app
      },

      directive(name: string, directive?: Directive) {
        if (__DEV__) {
          validateDirectiveName(name)
        }

        if (!directive) {
          return context.directives[name] as any
        }
        if (__DEV__ && context.directives[name]) {
          warn(`Directive "${name}" has already been registered in target app.`)
        }
        context.directives[name] = directive
        return app
      },

      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {
        if (!isMounted) {
          // 1.创建跟组件的 vnode
          // 使用createVNode来创建vnode对象
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )
          // store app context on the root VNode.
          // this will be set on the root instance on initial mount.
          vnode.appContext = context

          // HMR root reload
          if (__DEV__) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer, isSVG)
            }
          }

          if (isHydrate && hydrate) {
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            // 渲染vnode
            render(vnode, rootContainer, isSVG)
          }
          isMounted = true
          app._container = rootContainer
          // for devtools and telemetry
          ;(rootContainer as any).__vue_app__ = app

          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsInitApp(app, version)
          }

          return vnode.component!.proxy
        } else if (__DEV__) {
          warn(
            `App has already been mounted.\n` +
              `If you want to remount the same app, move your app creation logic ` +
              `into a factory function and create fresh app instances for each ` +
              `mount - e.g. \`const createMyApp = () => createApp(App)\``
          )
        }
      },

      unmount() {
        if (isMounted) {
          render(null, app._container)
          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsUnmountApp(app)
          }
          delete app._container.__vue_app__
        } else if (__DEV__) {
          warn(`Cannot unmount an app that is not mounted.`)
        }
      },

      provide(key, value) {
        if (__DEV__ && (key as string | symbol) in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". ` +
              `It will be overwritten with the new value.`
          )
        }
        // TypeScript doesn't allow symbols as index type
        // https://github.com/Microsoft/TypeScript/issues/24587
        context.provides[key as string] = value

        return app
      }
    })

    // 返回app对象
    return app
  }
~~~





6. render

~~~tsx
const render: RootRenderFunction = (vnode, container, isSVG) => {
    // 如果vnode为null, 那么久会销毁组件
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      // 创建或者更新组件都是使用patch函数(这里就是将根组件挂载到DOM上)
      patch(container._vnode || null, vnode, container, null, null, null, isSVG)
    }
    flushPostFlushCbs()
    // 放到container上面 缓存vnode
    container._vnode = vnode
  }
~~~

















