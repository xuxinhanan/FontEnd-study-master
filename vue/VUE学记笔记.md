### 1.MVVM模型（数据驱动）

MVVM表示的是 Model - View - ViewModel

- Model：模型层，负责处理业务逻辑以及和服务器端进行交互
- View：视图层，负责将数据模型转化为UI展示出来，可以简单的理解为HTML页面
- ViewModel（Model for View）：视图模型层，用来连接Model和View，是Model和View之间的通信桥梁

![image-20211202205446595](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211202205446595.png)



### 2.template属性

表示的是Vue需要帮我们渲染的信息。

如果需要在html元素外面包裹一层div的话，通常可以用template来替代。

好处是template不会被渲染，提高性能。







### 3.为什么data属性是一个函数而不是一个对象？

+ data属性要求传入一个函数，并且该函数需要返回一个对象

+ **怕重复创建实例造成多个实例共享一个数据对象**







+ data中返回的对象会被Vue的响应式系统劫持，之后对该对象的修改或者访问都会在劫持中被处理
  + 所以我们在template中通过{{counter}}访问counter，可以从对象中获取到数据
  + 所以我们修改counter的值时，template中的{{counter}}也会发生改变



#### 组件data定义函数与对象的区别

在我们定义好一个组件的时候，`vue`最终都会通过`Vue.extend()`构成组件实例

这里我们模仿组件构造函数，定义`data`属性，采用对象的形式

```js
function Component(){
 
}
Component.prototype.data = {
	count : 0
}
```

创建两个组件实例

```js
const componentA = new Component()
const componentB = new Component()
```

修改`componentA`组件`data`属性的值，`componentB`中的值也发生了改变

```js
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 1
```

产生这样的原因这是两者共用了同一个内存地址，`componentA`修改的内容，同样对`componentB`产生了影响

如果我们采用函数的形式，则不会出现这种情况（函数返回的对象内存地址并不相同）

```js
function Component(){
	this.data = this.data()
}
Component.prototype.data = function (){
    return {
   		count : 0
    }
}
```

修改`componentA`组件`data`属性的值，`componentB`中的值不受影响

```js
console.log(componentB.data.count)  // 0
componentA.data.count = 1
console.log(componentB.data.count)  // 0
```

`vue`组件可能会有很多个实例，采用函数返回一个全新`data`形式，使每个实例对象的数据不会受到其他实例对象数据的污染













### 4.methods属性

methods属性是一个对象，通常我们会在这个对象中定义很多的方法：

+ 这些方法可以被绑定到template模板中
+ 在该方法中，我们可以使用this关键字来直接访问到data中返回的对象属性



this的绑定

![image-20211202232053157](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211202232053157.png)

template中获取到的 btnClick 是 从 ctx 中找到的， 而ctx是 bind 绑定后返回的新的函数



### 5.基本指令

#### 开发模式

React的开发模式：

React 使用的 jsx，所以对应的代码都是编写的类似于 js 的一种语法。

之后通过 Babel 将 jsx 编译成 React.createElement 函数调用。

Vue 也支持 jsx 的开发模式：

但是大多数情况下，使用基于 HTML 的模板语法。

在模板中，允许开发者以声明式的方式将DOM和底层组件实例的数据绑定在一起。

在底层的实现中，Vue将模板编译成虚拟DOM渲染函数。



#### Mustche双大括号语法

如果我们希望把数据显示到模板（template）中，使用最多的语法是Mustche语法的文本插值。

Mustche语法也可以是JS表达式。



#### Vue2指令

HTML元素的属性值可以使用 vue 里的数据，不论是变量、数组，对象还是函数。

v-once指令

v-once用于指定元素或者组件只渲染一次。

当数据发生变化时，元素或者组件以及其所有的子元素将视为静态内容并且跳过。

该指令可以用于性能优化。



v-text指令

用于更新元素的textContent：

![image-20211203100408210](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203100408210.png)



v-html

默认情况下，如果我们展示的内容本身是html的，那么vue并不对对其进行特殊的解析。

如果我们希望这个内容被Vue可以解析出来，那么可以使用 v-html 来展示。

![image-20211203101035852](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203101035852.png)



v-pre

v-pre用于跳过元素和它的子元素的编译过程，显示原始的 Mustache 标签。

跳过不需要编译的节点，加快编译的速度。

![image-20211203101353582](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203101353582.png)



#### vue3指令

##### v-bind

前面讲的一系列指令，主要是将值插入到模板内容中。

但是，除了内容需要动态来决定外，某些属性我们也希望动态来绑定：

+ 比如动态绑定 a 元素的 href 属性
+ 比如动态绑定 img 元素的 src 属性

![image-20211203103032155](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203103032155.png)



v-bind 绑定 class - 对象语法

可以传给 ：class 一个对象，好处是可以动态的切换 class。



v-bind绑定 class - 数组语法

可以把一个数组传给 ：class ，以应用一个 class 列表。

![image-20211203111015290](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203111015290.png)



v-bind动态绑定属性名称

在某些情况下，属性的名称可能也不是固定的：

如果属性名称不是固定的，我们可以使用：[属性名]= “值” 的格式来定义



v-bind绑定直接一个对象

如果我们希望将一个对象的所有属性，绑定到元素上的所有属性，可以通过v-bind绑定直接一个对象。



##### v-on绑定事件

前面我们绑定了元素的内容和属性，在前端开发中另外一个非常重要的特性就是交互。

在vue通过 v-on 指令进行事件监听。

![image-20211203145840570](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203145840570.png)



当通过 methods 中定义事件处理程序时，需要注意：

1. 如果方法本身有一个参数，那么会默认将原生事件event参数传递进去
2. 如果需要同时传入多个参数，同时需要event时，通过$event传入事件对象

![image-20211203152348775](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203152348775.png)

![image-20211203152626419](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211203152626419.png)



**条件渲染**

某些情况下，需要根据当前的条件决定某些元素或组件是否渲染，这个时候就需要进行条件判断了。



### 4.v-show 和 v-if 怎么理解？

**v-show 和 v-if 的区别**

+ 控制手段不同
+ 编译过程不同
+ 编译条件不同

控制手段：v-show 隐藏是为该元素添加 css - - display：none，dom元素依旧存在。v-if 显示隐藏是将dom元素整个添加或删除

编译条件：v-if 是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建。

v-show 由 false 变为 true 的时候不会触发组件的生命周期

v-if 由 false 变为 true 的时候，触发组件的 beforeCreate、create、`beforeMount`、`mounted`钩子，由`true`变为`false`的时候触发组件的`beforeDestory`、`destoryed`方法

性能消耗：`v-if`有更高的切换消耗；`v-show`有更高的初始渲染消耗；



**v-show与v-if的使用场景**

`v-if` 与 `v-show` 都能控制`dom`元素在页面的显示

`v-if` 相比 `v-show` 开销更大的（直接操作`dom`节点增加与删除）

如果需要非常频繁地切换，则使用 v-show 较好

如果在运行时条件很少改变，则使用 v-if 较好



### 5.虚拟DOM的理解

#### 一、什么是虚拟DOM

虚拟DOM（ Virtual DOM）实际上是一层对真实DOM的抽象，是多个 VNode 形成的 **树**，通过对比虚拟DOM和当前真实DOM的差异，然后进行局部渲染从而实现性能上的优化。

在JavaScript对象中，虚拟DOM表现为一个Object对象。并且最少包含标签名（tag）、属性（attrs）和子元素对象（children）三个属性。

```html
<div id="app">
  <p class="text">hello world!!!</p>
</div>
```

上面的 HTML 转换为虚拟 DOM 如下：

```js
{
  tag: 'div',
  props: {
    id: 'app'
  },
  chidren: [
    {
      tag: 'p',
      props: {
        className: 'text'
      },
      chidren: [
        'hello world!!!'
      ]
    }
  ]
}
```

该JS对象也可以称为VNode（Virtual Node），每个children都是VNode，众多节点构成树结构。





#### 二、为什么需要虚拟DOM

1. 避免大量无谓的计算
2. 实现跨平台能力





### 6.v-for及key的原理

#### 一、key是什么

key是给每一个 VNode 的唯一 ID。主要用在Vue的虚拟算法，在新旧nodes对比时辨识VNodes。

在使用 **v-for** 进行列表渲染时，通常会给元素或者组件绑定一个key属性。



#### 二、有没有key的区别

如果不使用key：

1. 则比较新旧节点的长度，并根据最小的长度的值做遍历，
2. 从0位置开始patch比较，数据相同的节点不发生DOM操作，不同的节点发生DOM操作。
3. 遍历完成后判断如果旧的节点数多则移除剩余的节点。
4. 如果新的节点多则创建新的节点。

如果使用key：

1. 则从头开始遍历，比较节点，如果类型相同，key也相同，不发生DOM操作，直到比较出不同节点跳出循环。

2. 然后从尾部开始遍历，直到发现不同的节点。

3. 如果此时旧节点遍历完毕，依然有新的节点，那么就新增节点。

4. 如果新的节点遍历完毕，依然有旧的节点，则移除旧节点。

5. 如果中间还有很多未知的，乱序的节点，则进行移动、挂载、移除节点操作。



#### 三、总结

如果不使用key，Vue会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。

而使用key时，它会基于key的变化重新排列元素顺序，并且会移除/销毁key不存在的元素。



### 7.计算属性computed

对于任何包含响应式数据的复杂逻辑，都应该使用计算属性。

![image-20211204151646267](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211204151646267.png)



#### 计算属性 vs methods

我们会发现计算属性和methods的实现看起来是差别是不大的，然而计算属性有缓存的。



1. 计算属性会基于它们的依赖关系进行缓存； 

2. 在数据不发生变化时，计算属性是不需要重新计算的；

3. 如果依赖的数据发生变化，在使用时，计算属性依然会重新进行计算；

![image-20211204152507595](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211204152507595.png)





### 8.侦听器watch

#### 一、什么是侦听器呢

1. 开发中我们在data返回的对象中定义了数据，这个数据通过插值语法等方式绑定到template中；

2. 当数据变化时，template会自动进行更新来显示最新的数据；

3. 但是在某些情况下，我们希望在代码逻辑中监听某个数据的变化，这个时候就需要用侦听器watch来完成了；

![image-20211204175319117](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211204175319117.png)



#### 二、侦听器的配置选项

默认情况下，**watch只是在侦听info的引用变化**，对于**内部属性的变化是不会做出响应**的，

这个时候使用选项**deep**进行更深层的侦听。

还有**另外一个属性**，是**希望一开始的就会立即执行一次**，这个时候使用**immediate**选项。

![image-20211205210121856](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211205210121856.png)



#### 三、侦听器的其他方式

**还有另外一种方式就是使用 $watch 的API：** 

我们可以在created的生命周期中，使用 this.$watchs 来侦听； 

第一个参数是要侦听的源； 

第二个参数是侦听的回调函数callback； 

第三个参数是额外的其他选项，比如deep、immediate；





### 9.v-model

#### 一、是什么

**表单提交**是开发中非常常见的功能，也是和用户交互的重要手段： 

比如用户在登录、注册时需要提交账号密码；

比如用户在检索、创建、更新信息时，需要提交一些数据；

这些都要求我们可以在**代码逻辑中获取到用户提交的数据**，我们通常会使用**v-model指令**来完成：

v-model指令可以在表单 input、textarea以及select元素上创建**双向数据绑定**； 

它会根据控件类型自动选取正确的方法来更新元素； 

尽管有些神奇，但 v-model 本质上不过是**语法糖**，它负责监听用户的输入事件来更新数据，并在某种极端场景下进行一些特殊处理；

语法糖：**v-model的原理**其实是背后有两个操作 

1. v-bind绑定value属性的值； 

2. v-on绑定input事件监听到函数中，函数会获取最新的值赋值到绑定的属性中；

~~~html
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
~~~







#### 二、v-model的修饰符

##### 1.lazy

默认情况下，v-model在进行双向绑定时，绑定的是input事件，那么会在每次内容输入后就将最新的值和绑定的属性进行同步； 

如果我们在v-model后跟上lazy修饰符，那么会将绑定的事件切换为 change 事件，只有在提交时（比如回车） 才会触发；

![image-20211205222644829](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211205222644829.png)



##### 2.number

v-model绑定后的值总是**string类型**，如果我们希望转化为**数字类型**，那么可以使用.number修饰符。



##### 3.trim

如果要自动过滤用户输入的首尾空白字符，可以给v-model添加 trim 修饰符。







### 10.组件化开发

我们将一个完整的页面分成很多个组件； 每个组件都用于实现页面的一个功能块； 

而每一个组件又可以进行细分； 并且组件本身又可以在多个地方进行复用。

在`Vue`中每一个`.vue`文件都可以视为一个组件。**组件是带有名称的可复用实例。**



**组件的优势**

- 降低整个系统的耦合度，在保持接口不变的情况下，我们可以替换不同的组件快速完

  成需求，例如输入框，可以替换为日历、时间、范围等组件作具体的实现

  

- 调试方便，由于整个系统是通过组件组合起来的，在出现问题的时候，可以用排除法

  直接移除组件，或者根据报错的组件快速定位问题，之所以能够快速定位，是因为每

  个组件之间低耦合，职责单一，所以逻辑会比分析整个系统要简单

  

- 提高可维护性，由于每个组件的职责单一，并且组件在系统中是被复用的，所以对代

  码进行优化可获得系统的整体升级



#### 注册组件

注册组件分成两种：

1. **全局组件**：在任何其他的组件中都可以使用的组件；

全局组件需要使用我们全局创建的app来注册组件； 

通过component方法传入组件名称、组件对象即可注册一个全局组件了； 

之后，我们可以在App组件的template中直接使用这个全局组件：



2. **局部组件**：只有在注册的组件中才能使用的组件；

局部注册是在我们需要使用到的组件中，通过components属性选项来进行注册；

比如之前的App组件中，我们有data、computed、methods等选项了，事实上还可以有一个components选 项； 

该components选项对应的是一个对象，对象中的键值对是 组件的名称: 组件对象；



#### 组件通信

1. **父子组件之间通信**

父组件传递给子组件：通过props属性； 

子组件传递给父组件：通过$emit触发事件；

![image-20211206142136814](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211206142136814.png)



##### 1.父组件传递给子组件

**props**

Props是你可以在组件上注册一些**自定义的attribute**； 

父组件给这些attribute赋值，子组件通过attribute的名称获取到对应的值；



Props有两种常见的用法：

方式一：字符串数组，数组中的字符串就是attribute的名称；

方式二：对象类型，对象类型我们可以在指定attribute名称的同时，指定它需要传递的类型、是否是必须的、默认值等等；

![image-20211206222412975](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211206222412975.png)



当使用对象语法的时候，我们可以对传入的内容限制更多：

比如指定传入的attribute的类型； 

比如指定传入的attribute是否是必传的； 

比如指定没有传入时，attribute的默认值；



###### **非Prop的Attribute** 

**什么是非Prop的Attribute呢？**

当我们传递给一个组件某个属性，但是该属性并没有定义对应的props或者emits时，就称之为 非Prop的Attribute； 

常见的包括class、style、id属性等；**( 这些是HTML属性，但组件不是HTML元素 )**



**Attribute继承**：当组件有单个根节点时，非Prop的Attribute将自动添加到根节点的Attribute中。如果我们不希望组件的根元素继承attribute，可以在组件中设置 **inheritAttrs: false**



我们可以通过 **$attrs**来访问所有的 非props的attribute；

![image-20211206142749829](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211206142749829.png)





##### 2.子组件传递给父组件

**什么情况下子组件需要传递内容到父组件呢？**

当子组件有一些事件发生的时候，比如在组件中发生了点击，父组件需要切换内容；

子组件有一些内容想要传递给父组件的时候；



**如何完成上面的操作呢？**

首先，我们需要在子组件中定义好在某些情况下触发的事件名称； 

其次，在父组件中以v-on的方式传入要监听的事件名称，并且绑定到对应的方法中；

最后，在子组件中发生某个事件的时候，根据事件名称触发对应的事件；



##### 3.非父子组件的通信

**主要两种方式：**

Provide/Inject； 

Mitt全局事件总线；



1. **Provide和Inject**

Provide/Inject用于**非父子组件之间共享数据**： 

比如有一些深度嵌套的组件，子组件想要获取父组件的部分内容； 

在这种情况下，如果我们仍然将props沿着组件链逐级传递下去，就会非常的麻烦；



对于这种情况下，**我们可以使用 Provide 和 Inject ：** 

无论层级结构有多深，父组件都可以作为其所有子组件的依赖提供者； 

**父组件有一个 provide** 选项来提供数据；

**子组件有一个 inject** 选项来开始使用这些数据；

![image-20211206222933083](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211206222933083.png)



**4**.**各个组件之间传递**

使用全局事件总线（EventBus），Vue3官方有推荐一些库，例如 mitt 。







### 10.插槽slot

#### 一、是什么

Slot插槽，可以理解为 slot 在组件模板中占好了位置，在需要的时候，特定的内容会自动填坑（替换组件模板中 slot 位置）。



**如何使用slot呢？**

Vue中将 slot 元素**作为承载分发内容的出口**；

在封装组件中，使用特殊的元素 slot 就可以为封装组件开启一个插槽； 

该插槽**插入什么内容取决于父组件**如何使用；



#### 二、分类

**默认插槽**

父组件没有往插槽传入内容的时候默认显示。



**具名插槽**

给插槽起一个名字，slot 元素有一个特殊的属性：name；



**具名插槽使用的时候缩写：** 

把参数之前的所有内容 (v-slot:) 替换为字符 #



动态插槽名：v-slot:[dynamicSlotName]方式动态绑定一个名称



**作用域插槽**

插槽**可以访问到子组件中的内容**。

父组件中在使用时**通过`v-slot:xx`**（简写：#xx）**赋值来获取子组件的信息**，在内容中使用

**并且子组件将要传递的信息绑定到`slot`中**，如（：testProps="子组件的值"）。

子组件`Child.vue`

```html
<template> 
  <slot name="footer" ：testProps="子组件的值">
          <h3>没传footer插槽</h3>
    </slot>
</template>
```

父组件

```html
<child> 
    <!-- 把v-slot的值指定为作⽤域上下⽂对象 -->
    <template v-slot:default="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
  <template #default="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
</child>
```



### 11.路由

路由主要是维护一个映射表。

映射表决定数据的流向。



#### 一、后端路由

维护 路径 -> 页面的映射关系。

![image-20211212205816401](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211212205816401.png)



#### 二、SPA

web的发展主要经历了这样一些阶段：

+ 后端路由阶段；

+ 前后端分离阶段；

+ 单页面富应用（SPA）；



**单页面应用（SinglePage Web Application，SPA）**

只有一张Web页面的应用，是一种从Web服务器加载的富客户端，单页面跳转仅刷新局部资源 ，公共资源(js、css等)仅需加载一次，常用于PC端官网、购物等网站

![åé¡µé¢åºç¨ç»æè§å¾](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2017/11/17/15fc93562b418a6e~tplv-t2oaga2asx-watermark.awebp)









#### 三、前端路由

维护 路径 -> 组件的映射关系。

如何做到呢？

通过一个占位组件，当路径改变时，占位组件变成当前路径映射的相应组件。

![image-20211212205904945](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211212205904945.png)



现在有一个问题是：浏览器路径（url）改变后，默认会向服务器请求相应的静态资源（刷新页面）。

如何避免这样的问题呢？



**方法一：通过 url 的 hash**

**hash的特点**：

+ hash 变化会触发网页跳转，即浏览器的前进和后退。

  

+ hash 可以改变 url，但不会触发页面重新加载（hash的改变是记录在 

  window.history上），即不会刷新页面。也就是说，所有页面的跳转都是在客户端

  进行操作的，这并不算是一次 http 请求。因此这种模式不利已 SEO 优化。

  

+ hash 通过 window.onhashchange 的方式来监听 hash 的改变。



~~~html
    <div id="app">
        <a href="#/home">home</a>
        <a href="#/about">about</a>

        <div class="content">Default</div>
    </div>
~~~

~~~js
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
~~~



**方法二：HTML5的history模式**

如果不想要很丑的hash（有#），可以利用HTML5新增的 pushState() 和 

replaceState() 两个API，来完成URL跳转不重新加载页面。

~~~js
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
~~~





### 12.vue-router

#### 一、router 使用

通常在router文件夹中新建index.js进行路由配置。

+ 创建 rootes 来配置路由的映射
+ 创建 router 实例来为后续挂载到 vue上
+ 通过 <router-view/> 来创建占位组件
+ 通过 <router-link to=" "/> 来创建 a 标签进行路径跳转





![image-20211212223824710](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211212223824710.png)



**重定向**

“重定向”的意思是，当用户访问 `/a`时，URL 将会被替换成 `/b`，然后匹配路由为 `/b`。

在 routes 里 通过 redirect 来配置



#### 二、路由API

1. **在setup函数中拿到router实例对象**

通过`useRouter`API拿到`router`实例对象。



2. **路由跳转**

路由跳转的方式，除了使用<router-link>创建 a 标签来定义导航链接外，还可以通过编程的方式来实现导航。

1. router.push ，这个方法会向 history 栈添加一个新纪录，当浏览器后退时，可以返回到之前的url。

   

2. router.replace，这个方法是替换式导航，不会在 history 中留下记录。

注：

	1. router.push 方法的参数可以是一个字符串路径，或者是一个描述地址的对象。
	2. <router-link>实际上会在内部调用 router.push 方法，因此<router-link :to="">等同于调用 router.push()。



3. **添加路由**

通过 router 实例的 addRoute 方法，来添加路由。

如果传入一个参数，则添加一条新的路由。

路过传入两个参数，则给指定路由添加子路由。

```js
addRoute(parentName, route)()
//parentName 为指定路由的 name 属性
```





### 14.nextTick的理解

将回调推迟到下一个 DOM 更新周期之后执行。在更改了一些数据以等待 DOM 更新后立即使用它。

nextTick 做的事是将任务加入到微任务队列末尾，在异步操作中最后执行。





### 15.vuex

![image-20211220220833168](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211220220833168.png)

+ vuex的store有State、 Getter、Mutation 、Action、 Module五种属性；
+ **state** 为单一状态树，在state中需要定义我们所需要管理的数组、对象、字符串等等
+ **getters** 类似vue的计算属性，主要用来过滤一些数据。
+ **mutation** 更改store中state状态的唯一方法就是提交mutation，store.commit。
+ **action** actions可以理解为通过将mutations里面处里数据的方法变成可异步的处理数据的方法，简单的说就是异步操作数据。view 层通过 store.dispath 来分发 action。
+ **module** module其实只是解决了当state中很复杂臃肿的时候，module可以将store分割成模块，每个模块中拥有自己的state、mutation、action和getter。



### 16.compositionAPI

+ 如果我们能将同一个逻辑关注点相关的代码收集在一起会更好。

+ 这就是compositionAPI想要做的事情，以及可以帮助我们完成的事情。

  

+ 为了开始使用compositionAPI，我们需要有一个可以实际使用它（编写代码）的地方。
+ 在vue组件中，这个位置就是setup函数。



### 17.setup函数

1. **setup函数的参数：props，context**

props非常好理解，它其实就是**父组件传递过来的属性**会被**放到props对象**中，我们在**setup中如果需要使用**，那么就可以直接**通过props参数获取**



2) **setup函数的返回值**

setup既然是一个函数，那么它也可以有**返回值**。

**它的返回值用来做什么呢？**setup的返回值可以在模板template中被使用。

注意：setup返回的变量是不会引起界面响应式变化的。



### 18.reactive API

如果想为在setup中定义的数据提供响应式的特性，那么我们可以**使用reactive的函数**



**那么这是什么原因呢？为什么就可以变成响应式的呢？**

这是因为当我们使用reactive函数处理我们的数据之后，数据再次被使用时就会进行依赖收集； 

当数据发生改变时，所有收集到的依赖都会进行对应的响应式操作（重新执行）（比如更新界面）；

事实上，我们编写的data选项，也是在内部交给了reactive函数将其编程响应式对象的；





### 19.ref API （reference)

reactive API对**传入的类型是有限制的**，它要求我们必须传入的是**一个对象或者数组类型**。

如果我们传入一个基本数据类型（String、Number、Boolean），这个时候Vue3给我们提供了**另外一个API：ref API**。

ref 会返回一个可变的响应式对象，该对象作为一个 **响应式的引用** 维护着它内部的值，这就是ref名称的来源； 

**它内部的值是在ref的 value 属性中被维护的**；

















