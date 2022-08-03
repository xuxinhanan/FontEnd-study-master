## JS系列



### 1.JS的类型转换机制

JavaScript 在声明过程中并不会指定数据类型，但是在程序运行过程中是需要确定当前类型的。

比如在输出内容、算术运算和逻辑操作等情况下对数据类型是有要求的，如果数据类型与预期不符就会触发类型转换机制。

类型转换机制分为显示转换和隐式转换。

1. 在输出内容时会将数据隐式的转换为字符串类型，或者通过String()来强制转换

2. 在进行算术运算时会将数据隐式的转换为数字类型，或者通过Number()，parseInt()来强制转换

   | true/false | 1/0  |
   | ---------- | ---- |
   | null       | 0    |
   | undefined  | NaN  |

   

3. 在进行逻辑操作时（即需要布尔值的地方）会将数据隐式的转换为Boolean类型，或者通过Boolean来强制转换

   | 0,null,undefined,NaN," " | false |
   | ------------------------ | ----- |
   | 其他                     | true  |

   









### 2. == 和 === 的区别，分别在什么情况使用

"=="是算术运算符，在使用时会遵循类型转换机制。

"===" 全等操作符，只有两个操作数在不进行类型转换的前提下相等才会返回true。即需要两个操作数类型相同，数值相等。









### 3.let，const，var的区别









### 3.深拷贝浅拷贝的区别，如何实现一个深拷贝？



浅拷贝是创建一个新对象，然后将原始对象的属性拷贝过来，对于基本类型的属性，拷贝的就是基本类型的值，而对于引用类型的属性，拷贝过来的是引用对象的地址。如果改变其中一个对象，就会影响到另一个对象。

深拷贝是在内存中开辟一个新的区域来存放拷贝过来的对象，该对象独立于原始对象。



#### 一、用递归实现深拷贝

```js
//为了避免循环引用（对象属性直接或间接引用自身）的情况，引入hash表

//考虑到如果要拷贝的对象非常庞大时，使用map会对内存造成非常大的额外消耗，而且需要手动清除Map的属性才能释放这块内存。而weakMap弱引用的特性刚好能巧妙地化解这个问题。
function deepClone(obj,hash = new WeakMap()){
    if(obj == null) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
   	if(typeof obj !== 'object') return obj;
    if(hash.get(obj)) return obj;
    let cloneObj = new obj.constructor();
    hash.set(obj,cloneObj);
    for(let key in obj){
        if(obj.hasOwnProperty(key)){
            cloneObj[key] = deepClone(obj.key,hash);
        }
    }
    return cloneObj;
}
```



#### 二、通过lodash库实现深拷贝

“_” 表示lodash库

_.cloneDeep()

```js
const _ = require('lodash');
const obj1 = {
    a: 1,
    b: { f: { g: 1 } },
    c: [1, 2, 3]
};
const obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);// false
```







### 4.说说你对闭包的理解？

闭包是指内部函数总是可以访问其所在的外部函数中声明的变量和函数。

但是访问变量和函数的时候是有区别的，用let声明变量的时候，需要直到声明处才可用。

而函数声明的机制则是，当创建了一个词法环境时，里面的函数声明会立即变成即用型函数，因此我们可以在函数声明的定义之前调用函数。

<!--（在JS中，每个运行的函数 ，代码块，脚本，都有一个被称为词法环境的内部（隐藏）的关联对象。）-->

词法环境对象由两部分组成：

1. **环境记录** —— 一个存储所有局部变量作为其属性的对象
2. 对**外部词法环境**的引用

在每次创建函数时，都会创建 [[ Environment ]] 隐藏属性，该属性记录着函数自身的创建时的词法环境。因此当执行内部函数时，即使外部函数执行结束，仍然能访问到外部词法环境的内容。

~~~js
function getFunc() {//外部词法环境
  let value = "test";
  //创建一个函数，会创建 [[ Environment ]] 隐藏属性，该属性记录着当前词法环境
  let func = function() { alert(value); };//内部词法环境

  return func;
}

getFunc()(); // "test"，从 getFunc 的词法环境中获取的
~~~



此时，当函数内的代码要访问一个变量时，首先会搜索内部词法环境，如果没有找到，就会搜索外部词法环境，直到全局词法环境。

JS的这个机制称为闭包，他可以像保护气泡一样，保护该作用域中可能会被垃圾回收的变量。

![image-20211124161223666](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211124161223666.png)













### 5.闭包的使用场景

任何闭包的使用场景都离不开这两点：

1. 设计私有变量
2. 延长变量的生命周期

<!--一般函数的词法环境在函数返回后就被销毁，但是闭包会保存对创建时所在词法环境的引用，即便创建时所在的执行上下文被销毁，但创建时所在词法环境依然存在，以达到延长变量的生命周期的目的。-->



~~~js
//思考题

var result = [];
var a = 3;
var total = 0;

function foo(a) {
    for (var i = 0; i < 3; i++) {
        result[i] = function () {
            total += i * a;
            console.log(total);
        }
    }
}

foo(1);
result[0]();  // 3
result[1]();  // 6
result[2]();  // 9

1.//执行foo(1)后会将result设置为[fn(),fn(),fn()]
2.//执行result[0]()，即fn()后，会给这个函数设置[[ Enviroment ]]属性，里面保存着对词法环境的引用。
3.//for循环之后，会将变量i修改成3
4.//fn()执行时，会在词法环境中找到i,a,total，并将total修改和打印total
5.//执行result[1]()，即再次执行fn()，此时从词法环境找到的total是修改后的，值为3

注：当函数的代码需要修改变量时，从词法环境中查找并更新变量
~~~



1. return回一个函数

~~~js
//在页面上添加一些可以调整字号的按钮
function makeSizer(size) {
  return function() {
    document.body.style.fontSize = size + 'px';
  };
}

var size12 = makeSizer(12);
var size14 = makeSizer(14);

document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
~~~



2. 使用回调函数就是在使用闭包

~~~js
window.name = '徐鑫瀚'
setTimeout(function timeHandler(){
  console.log(window.name);
}, 100)
~~~





### 6.this对象

this 关键字是**函数运行时自动生成的一个内部对象**。

在 JavaScript 中，`this` 是“自由”的，它的值是在调用时计算出来的（执行上下文创建阶段确定this的值），

它的值并不取决于方法声明的位置，而是取决于在“点符号前”的是什么对象。

根据不同的使用场合，this 的绑定主要分为以下几种情况：

1. 隐式绑定

   + 全局上下文

     函数在全局上下文下调用，默认this指向window，严格模式下指向undefined

   

   + 直接调用函数

   ~~~js
   let obj = {
     a: function() {
       console.log(this);
     }
   }
   let func = obj.a;
   func();
   ~~~

   ​	 直接调用相当于在全局上下文下调用的情况。

   

   + 对象下调用

   ~~~js
   obj.a();
   ~~~

   ​	此时this指向这个对象obj

   

   + new构造函数下调用

   ~~~js
   function Person(name) {
     console.log(this); // Person {}
     this.name = name; // Person {name: "why"}
   }
   
   var p = new Person("why");
   console.log(p);
   ~~~

   ​	此时this指向new出来的实例对象

   

2. 显示绑定 call / apply / bind

   略



 3. 箭头函数

    箭头函数没有 this 对象。如果访问this，则会从外部获取。

    

    利用这个特性：

    ![image-20211207214435721](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211207214435721.png)













### 7.new操作符

在JavaScript中，new 操作符用于创建一个给定构造函数的实例对象。



#### 构造器的return

构造器里有 return 语句，则：

- 如果 `return` 返回的是一个对象，则返回这个对象，而不是 `this`。
- 如果 `return` 返回的是一个原始类型，则忽略。

如果没有 return 语句，默认返回 this ，即新建对象。

~~~js
function mynew(Func,...args){
    //1.创建一个新对象
    const obj = {}
    //2.新对象原型指向构造函数原型对象
    obj.__proto__ = Func.prototype
    //3.将构造函数的this绑定新对象
    let result = Func.apply(obj,args)
    //4.如果构造函数有返回值，则根据类型确定返回值，否则返回新对象
    return result instanceof Object ? result : obj
}
~~~









### 8.typeof和 instanceof的区别

typeof 返回一个字符串，用来判断给定值的类型。

对于引用类型，除了 function 会被识别出来，其他都输出 object。

instanceof 用来判断给定对象是否为给定构造函数的实例。

实际上，instanceof 做的事是判断给定构造函数的prototype属性是否出现在给定对象的原型链上。

从上面知道，new操作符创建实例对象做的事是新建一个空对象，然后将这个空对象的原型设置为构造函数的prototype属性，然后将构造函数的this绑定新对象，再返回新对象。

















### 9.call / apply / bind

作用是改变函数执行时 this 的指向。

三者第一个参数接收的都是欲绑定的对象。



#### 区别

+ apply：

  第二个参数接收一个组数，并将其中的数组元素作为单独的参数传给func。

  改变`this`指向后原函数会立即执行。

  

+ call：第二个参数开始可以接收多个参数（一次），并传给func。

  跟`apply`一样，改变`this`指向后原函数会立即执行。

  

+ bind：接收函数参数的形式与call相似，可以接收多个参数，也可以分成数次接收。

  改变`this`指向后不会立即执行，而是返回一个改变了`this`指向的新函数。

  

~~~js
function fn(...args){
    console.log(this,args);
}
let obj = {
    myname:"张三"
}

fn.apply(obj,[1,2]); // this会变成传入的obj，传入的参数必须是一个数组；
fn(1,2) // this指向window

fn.call(obj,1,2); // this会变成传入的obj，传入的参数必须是一个数组；
fn(1,2) // this指向window

const bindFn = fn.bind(obj); // this 也会变成传入的obj 
bindFn(1,2) // bind不是立即执行需要执行一次 , this指向obj
fn(1,2) // this指向window

~~~



#### 手写实现

手写call核心：

+ 将函数设为对象的属性

+ 执行并删除这个函数

  

~~~js
Function.prototype.myCall = function(content = window){
    content.fn = this;
    let args = [...arguments].slice(1);
    let result = content.fn(...args);
    delete content.fn;
    return result;
}
~~~



手写apply：

~~~js
Function.prototype.apply2 = function(content = window){
    content.fn = this;
    let result;
    //判断是否有第二个参数,如果有的话，按照apply的规则，第二个参数是数组，
    //则需要遍历出来进行传参
    if(arguments[1]){
        result = content.fn(...arguments[1]);
    }else{
        result = content.fn();
    }
    delete content.fn;
    return result;
}
~~~



手写bind核心：

返回一个函数，这个函数用来执行绑定了this的原函数。

~~~js
Function.prototype.myBind = function(content=window){
    // 判断调用对象是否为函数
    if (typeof this !== "function") {
        throw new TypeError("Error");
    }

    //哪个函数调用了bind，this就指向谁，因此可以通过this来获取该函数
    const self = this;
    
    //调用slice方法，通过call指定在arguments对象下执行
    const args = [...arguments].slice(1);

    return function(){
        return self.apply(content,args);
    }
}

~~~







### 10.执行上下文

简单来说，执行上下文是一种对 javascript 代码执行环境的抽象概念。

执行上下文的类型分为三种：

1. 全局执行上下文：只有一个
2. 函数执行上下文：存在无数个，只有在函数被调用的时候才会被创建。
3. Eval 函数执行上下文



生命周期

执行上下文的生命周期包括三个阶段：创建阶段，执行阶段，回收阶段



创建阶段

创建阶段即当函数被调用，但未执行任何其内部代码之前（加入到执行栈时）。

创建阶段做了三件事，**即初始化**：

+ 确定 this 的值，也被称为 This Binding
+ LexicalEnvironment （词法环境）被创建
+ VariableEnvironment （变量环境）被创建

<img src="C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211221153543744.png" alt="image-20211221153543744" style="zoom:200%;" />

词法环境

前面闭包中讲过，词法环境由环境记录和外部词法环境的引用两部分组成



变量环境

变量环境也是一个词法环境，在 ES6 中，词法环境和变量环境的区别在于前者用于存储函数声明和变量（ `let` 和 `const` ）绑定，而后者仅用于存储变量（ `var` ）绑定



~~~js
let a = 20;  
const b = 30;  
var c;

function multiply(e, f) {  
 var g = 20;  
 return e * f * g;  
}

c = multiply(20, 30);
~~~



~~~js
//执行上下文创建阶段
GlobalExectionContext = {

  //确定 this 的值
  ThisBinding: <Global Object>,

  //创建词法环境
  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
      // 标识符绑定在这里  
      a: < uninitialized >,  
      b: < uninitialized >,  
      multiply: < func >  
    }  
    outer: <null>  
  },

  // 变量环境
  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Object",  
     
      c: undefined,  
    }  
    outer: <null>  
  }  
}

FunctionExectionContext = {  
   
  ThisBinding: <Global Object>,

  LexicalEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      Arguments: {0: 20, 1: 30, length: 2},  
    },  
    outer: <GlobalLexicalEnvironment>  
  },

  VariableEnvironment: {  
    EnvironmentRecord: {  
      Type: "Declarative",  
      // 标识符绑定在这里  
      g: undefined  
    },  
    outer: <GlobalLexicalEnvironment>  
  }  
}
~~~



创建阶段，会在代码中扫描变量和函数声明，然后， 函数声明会被储存在环境中

，但变量会被初始化为 undifined ( var 声明 ) 和保持 uninitialized ( 未初始状态 ) ( let 和 

const 声明的情况下 )，这就是变量提升的实际原因。



执行阶段

在这个阶段，执行变量赋值、代码执行

如果 JavaScript 引擎在源代码中声明的实际位置找不到变量的值，那么为其分配 undefined 值



回收阶段

执行上下文出栈，等待虚拟机回收执行上下文。





### 11.执行栈

执行栈，用于存储代码在执行期间创建的所有执行上下文。

当 Javascript 引擎开始执行第一行脚本代码的时候，它就会创建一个全局执行上下文然后将它压入执行栈中。

每当引擎碰到一个函数的时候，它就会创建一个函数执行上下文，然后将这个执行上下文压到执行栈中。

引擎会执行位于执行栈栈顶的执行上下文(一般是函数执行上下文)，当该函数执行结束后，对应的执行上下文就会被弹出，然后控制流程到达执行栈的下一个执行上下文。

如：

~~~js
let a = 'Hello World!';
function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}
function second() {
  console.log('Inside second function');
}
first();
console.log('Inside Global Execution Context');
~~~



![img](https://static.vue-js.com/ac11a600-74c1-11eb-ab90-d9ae814b240d.png)







### 11.作用域链

作用域

作用域，即变量和函数生效的区域或集合。

我们一般将作用域分成：

- 全局作用域，任何不在函数中或是大括号中声明的变量，都是在全局作用域下
- 函数作用域，一个变量是在函数内部声明的它就在一个函数作用域下面
- 块级作用域，在大括号中使用`let`和`const`声明的变量存在于块级作用域中。在大括号之外不能访问这些变量



词法作用域

词法作用域，又叫静态作用域，变量被创建时就确定好了，而非执行阶段确定的。也就是说我们写好代码时它的作用域就确定了，`JavaScript` 遵循的就是词法作用域

```js
var a = 2;
function foo(){
    console.log(a)
}
function bar(){
    var a = 3;
    foo();
}
n()
```

上述代码改变成一张图

![img](https://static.vue-js.com/29fab3d0-718f-11eb-85f6-6fac77c0c9b3.png)



作用域链

当在`Javascript`中使用一个变量的时候，首先`Javascript`引擎会尝试在当前作用域下去寻找该变量，如果没找到，再到它的上层作用域寻找，以此类推直到找到该变量或是已经到了全局作用域













### 12.原型

在JavaScript中，**所有对象都有一个隐藏的 [[ Prototype ]] 属性**，它要么是 null ，要么是对另一个对象的引用。该对象被称为 “原型”。

**每个函数中也有一个普通的 “prototype” 属性**，但它并不是“原型”，实际上指的是具有该名字的常规属性。

默认的 prototype 属性是一个只有属性 constructor 的对象，属性 constructor 指向函数自身。

在通过 new 创建实例的时候会将实例对象内的 [[ Prototype ]] 隐藏属性指向构造函数的prototype 属性。

原型是定义对象的一种方便的方式，使用原型所定义的属性和功能会自动应用到对象的实例上。一旦进行了定义，原型的属性就会变成实例化对象的属性，从而作为复杂对象创建的概览。

原型类似于经典面向对象语言中的类，但它本质依然是函数属性。

注：

1. 原型仅用于读取属性。 对于写入/删除操作可以直接在对象上进行。
2. `__proto__` 是 `[[Prototype]]` 的因历史原因而留下来的 getter/setter 。
3. 构造函数、原型和实例的关系：每个构造函数都有一个prototype属性，它的值是一个对象，prototype属性值里有个 constructor 属性指向构造函数自身。通过构造函数创建的实例有一个隐藏的 [[prototype]] 属性，该属性指向原型。











### 13.原型链

如果原型是另一个类型的实例，那么就意味着这个原型本身有一个内部指针（__ proto __）指向另一个原型，相应的另一个原型也有一个指针指向另一个构造函数的prototype属性。这样在实例、原型间就构成了一条原型链。

原型链解释了为何一个对象会拥有定义在其他对象中的属性和方法。

注：ECMA-262把原型链定义为 ECMAScript 的主要继承方式。









### 14.浏览器事件、事件流

+ 事件：事件是某事发生的信号。所有的DOM节点都生成这样的信号。

  

  常见的事件有：鼠标事件（click , mousemove），键盘事件（ keydown , keyup），表单元素事件（submit , focus）

  

+ 事件处理程序：为了对事件作出响应，我们可以分配一个处理程序——一个在事件发生时运行的函数。

+ **事件对象**：当事件发生时，浏览器会创建一个 event 对象，将详细信息放入其中，并将其作为参数传递给处理程序。

  event对象的一些属性：event.type 事件类型，evnet.currentTarget 处理事件的元素。

+ 事件流：DOM事件传播的三个阶段：

  

  	1. 捕获阶段 —— 事件（从 Window）向下走近元素。
   2. 目标阶段 —— 事件到达目标元素。
   3. 冒泡阶段 —— 事件从元素上开始冒泡。

![image-20211129215408259](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211129215408259.png)













### 15.事件模型

事件模型可以分为三种：

+ 原始事件模型（DOM0级）
+ 标准事件模型（DOM2级）
+ IE事件模型（基本不用）













### 16.事件委托（代理）

捕获和冒泡允许我们实现一种被称为事件委托的强大的事件处理模式。

如果我们有许多以类似方式处理的元素，就不必为每个元素分配一个处理程序 —— 而是将单个处理程序放在他们的共同祖先上。





### 17.浏览器工作原理

如输入 `www.baidu.com` 后经过`DNS`域名解析，转换成`ip`地址 xxx.xx.xx.xx（服务器的地址），访问服务器后，服务器会返回静态资源`index.html`，获得`index.html`后，浏览器开始解析，遇到`css`文件，下载`css`文件，遇到`js`文件，下载`js`文件。

![image-20211218205855602](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211218205855602.png)



### 18.浏览器渲染过程

![image-20211218210033517](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211218210033517.png)

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/27/167f057704b94f08~tplv-t2oaga2asx-watermark.awebp)



浏览器渲染过程大体分为如下三个部分：

**1）浏览器会解析三个东西：**

- **HTML/SVG/XHTML**，HTML字符串描述了一个页面的结构，浏览器会把

  HTML结构字符串解析转换DOM树形结构。

  

- **CSS**，解析CSS会产生CSS规则树，它和DOM结构比较像。

  

- **scirpt**，等到Javascript 脚本文件加载后， 通过 DOM API 和 CSSOM API 

  来操作 DOM Tree 和 CSS Rule Tree。



**2）解析完成后，浏览器引擎会通过DOM Tree 和 CSS Rule Tree 来构造 Rendering Tree。**

注：Rendering Tree 渲染树并不等同于DOM树，渲染树只会包括需要显示的节点和这些节点的样式信息。



**3）最后通过调用操作系统Native GUI的API绘制。**



注：https://www.cnblogs.com/inJS/p/4893434.html

i.渲染是以流式进行的。不需要得到全部数据再渲染，如：HTML文件下载多少就渲染多少；

ii.大多数HTML外部资源都不会阻塞UI线程，如：CSS、IMG、Flash等，没有load完毕的图片会留一个空位置在那里；

iii.大多数的HTML元素都是渲染出DOM便立刻显示的；

iiii.HTML从上到下解析，该过程不可逆（参考 i）。但会出现reflow（重排） and repaint（重绘）。





### 18.重绘和回流



**重绘**：当我们对 DOM 的修改导致了样式的变化、却并未影响其几何属性（比如修改了颜色或背景色）时，浏览器不需重新计算元素的几何属性、直接为该元素绘制新的样式（跳过了上图所示的回流环节）。

**回流**：当我们对 DOM 的修改引发了 DOM 几何尺寸的变化（比如修改元素的宽、高或隐藏元素等）时，浏览器需要重新计算元素的几何属性（其他元素的几何属性和位置也会因此受到影响），然后再将计算的结果绘制出来。这个过程就是回流（也叫重排）



重绘和回流会在我们设置节点样式时频繁出现，同时也会很大程度上影响性能。回流所需的成本比重绘高的多，改变父节点里的子节点很可能会导致父节点的一系列回流。



**1）常见引起回流属性和方法**

任何会改变元素几何信息(元素的位置和尺寸大小)的操作，都会触发回流，

- 添加或者删除可见的DOM元素；

- 元素尺寸改变——边距、填充、边框、宽度和高度

- 内容变化，比如用户在input框中输入文字

- 浏览器窗口尺寸改变——resize事件发生时

- 计算 offsetWidth 和 offsetHeight 属性

- 设置 style 属性的值

  

**2）常见引起重绘属性和方法**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/1/16809d8e6482b813~tplv-t2oaga2asx-watermark.awebp)



**性能优化策略**

基于上面介绍的浏览器渲染原理，DOM 和 CSSOM 结构构建顺序，初始化可以对页面渲染做些优化，提升页面性能。

- JS优化： 

  <script>标签加上 defer属性 和 async属性 用于在不阻塞页面文档解析的前提下，控制脚本的下载和执行。

  - defer属性： 用于开启新的线程下载脚本文件，并使脚本在文档解析完成后执行。
  - async属性： HTML5新增属性，用于异步下载脚本文件，下载完毕立即解释执行代码。

- CSS优化： `<link>` 标签的 rel属性 中的属性值设置为 preload 能够让你在你的HTML页面中可以指明哪些资源是在页面加载完成后即刻需要的,最优的配置加载顺序，提高渲染性能





### 19.V8引擎的原理

JS代码通过V8引擎解析生成AST，再转化为字节码文件，才能被CPU运行。

![image-20211218210543371](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211218210543371.png)



解析阶段：创建全局上下文，用于初始化各变量、函数。即生成AST。

执行阶段：将全局上下文压入执行上下文栈中开始执行，遇到变量，则赋值，遇到函

​				  数，则将函数上下文压入执行栈中，执行函数里面的代码。





### 20.事件循环

程序开始执行时，主程序首先执行 **同步任务**，碰到 **异步任务** 就把它放到任务队列中,等到同步任务全部执行完毕之后，js引擎便去查看任务队列有没有可以执行的异步任务，有的话放在主程序中执行，执行完之后继续查看任务队列，这个过程是一直 **循环** 的，这个过程就是所谓的 **事件循环**，其中任务队列也被称为事件队列。通过一个任务队列，单线程的js实现了异步任务的执行，给人感觉js好像是多线程的。



### 21.微任务、宏任务

同时异步任务还可以细分为微任务与宏任务。微任务比宏任务先进入主程序执行。

常见的微任务有：

- **Promise.then**
- MutaionObserver
- process.nextTick（Node.js）



常见的宏任务有：

- script (可以理解为外层同步代码)
- **setTimeout/setInterval**
- UI rendering/UI事件
- postMessage、MessageChannel
- setImmediate、I/O（Node.js）



### 22.谈谈js的垃圾回收机制

+ JavaScript拥有自动的垃圾回收机制，当一个值，在内存中失去引用时，垃圾回收机制会根据特殊的算法找到它，并将其回收，释放内存。
+ **标记清除算法：**
  1. 标记阶段，垃圾回收器会从根对象开始遍历。每一个可以从根对象访问到的对象都会被添加一个标识，于是这个对象就会被标识为可达到对象。
  2. 清除阶段，垃圾回收器会对堆内存从头到尾进行线性遍历，如果发现有对象没有被标识为可到达对象，那么就将此对象占用的内存回收，并且将原来标记为可到达对象的标识清除，以便进行下一次垃圾回收操作。
  3. 缺点：垃圾收集后有可能会造成大量的内存碎片。
+ **引用计数算法：**
  1. 引用计数的含义是跟踪记录每个值被引用的次数，如果没有引用指向该对象，对象将被垃圾回收机制回收。
  2. 缺点：循环引用没法回收。





### 23.ES6 Module

#### 重要特性

1. **模块代码仅在第一次导入时被解析**

假设一个模块导出了一个对象：

~~~js
// 📁 admin.js
export let admin = {
  name: "John"
};
~~~

如果这个模块被导入到多个文件中，模块仅在第一次被导入时被解析，并创建 `admin` 对象，然后将其传入到所有的导入。

所有的导入都只获得了一个唯一的 `admin` 对象：

~~~js
// 📁 1.js
import { admin } from './admin.js';
admin.name = "Pete";

// 📁 2.js
import { admin } from './admin.js';
alert(admin.name); // Pete

// 1.js 和 2.js 引用的是同一个 admin 对象
// 在 1.js 中对对象做的更改，在 2.js 中也是可见的
~~~

因此，顶层模块代码应该用于初始化，创建模块特定的内部数据结构。如果我们需要多次调用某些东西 —— 我们应该将其以函数的形式导出。

**这种行为实际上非常方便，因为它允许我们“配置”模块。**

换句话说，模块可以提供需要配置的通用功能。例如身份验证需要凭证。那么模块可以导出一个配置对象，期望外部代码可以对其进行赋值。

这是经典的使用模式：

1. 模块导出一些配置方法，例如一个配置对象。
2. 在第一次导入时，我们对其进行初始化，写入其属性。可以在应用顶级脚本中进行此操作。
3. 进一步地导入使用模块。





2. **模块脚本是延迟的**

在**浏览器环境**中，模块脚本 总是 被延迟的，与 `defer` 特性对外部脚本和内联脚本的影响相同。

~~~js
<script type="module">
  alert(typeof button); // object：脚本可以“看见”下面的 button
  // 因为模块是被延迟的（deferred，所以模块脚本会在整个页面加载完成后才运行
</script>

相较于下面这个常规脚本：

<script>
  alert(typeof button); // button 为 undefined，脚本看不到下面的元素
  // 常规脚本会立即运行，常规脚本的运行是在在处理页面的其余部分之前进行的
</script>

<button id="button">Button</button>
~~~









#### **模块语法**

##### **导出**

+ 在声明前导出

我们可以通过在声明之前放置 `export` 来标记任意声明为导出，无论声明的是变量，函数还是类都可以。

~~~js
// 导出变量
export let months = 'Mar';
~~~



+ 单独导出

~~~js
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

export {sayHi, sayBye}; // 导出变量列表
~~~



+ 命名导出 export as

导出也具有类似的语法。

~~~js
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};
~~~



+ 默认导出 export default

模块提供了一个特殊的默认导出 `export default` 语法，以使“一个模块只做一件事”的方式看起来更好。

将 `export default` 放在要导出的实体前：

~~~js
// 📁 user.js
export default class User { // 只需要添加 "default" 即可
  constructor(name) {
    this.name = name;
  }
}
~~~

每个文件可能只有一个 `export default`，并且将其导入不再需要花括号：

~~~js
// 📁 main.js
import User from './user.js'; // 不需要花括号 {User}，只需要写成 User 即可

new User('John');
~~~





+ 重新导出

允许导入内容，并立即将其导出。

- `export {x [as y], ...} from "module"`
- `export * from "module"`（重新导出只导出了命名的导出，但是忽略了默认的导出）
- `export {default [as y]} from "module"`（重新导出默认的导出）

~~~js
export {sayHi} from './say.js'; // 重新导出 sayHi

export {default as User} from './user.js'; // 重新导出 default
~~~



##### **导入**

+ import 

通常，我们把要导入的东西列在花括号 `import {...}` 中：

~~~js
// 📁 main.js
import {sayHi, sayBye} from './say.js';

sayHi('John'); // Hello, John!
sayBye('John'); // Bye, John!
~~~



+ 导入所有 import * 

但是如果有很多要导入的内容，我们可以使用 `import * as <obj>` 将所有内容导入为一个对象，例如：

~~~js
// 📁 main.js
import * as say from './say.js';

say.sayHi('John');
say.sayBye('John');
~~~



+ 命名导入 import as

可以使用 `as` 让导入具有不同的名字。

~~~js
// 📁 main.js
import {sayHi as hi, sayBye as bye} from './say.js';

hi('John'); // Hello, John!
bye('John'); // Bye, John!
~~~



##### 动态导入

`import(module)` 表达式加载模块并返回一个 promise，该 promise resolve 为一个包含其所有导出的模块对象。我们可以在代码中的任意位置调用这个表达式。

例如，如果我们有以下模块 `say.js`：

```javascript
// 📁 say.js
export function hi() {
  alert(`Hello`);
}

export function bye() {
  alert(`Bye`);
}
```

那么，可以想像下面这样进行动态导入：

```javascript
let {hi, bye} = await import('./say.js');

hi();
bye();
```











## 二、DOM



DOM 是 HTML 的编程接口。DOM 表示由多层节点构成的文档，通过它开发者可以添加、删除和修改页面的各个部分。不同节点对应不同类型。



### 1.1 节点层级

document 节点表示每个文档的根节点。根节点的唯一子节点是 <html> 元素，称为文档元素。

<img src="C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220414145325103.png" alt="image-20220414145325103" style="zoom: 80%;" />





### 1.2 Node类型

DOM Level1 描述了名为 Node 的接口，这个接口是所有 DOM 节点类型都必须实现的。

Node 接口在 JavaScript 中被实现为 Node 类型。并且所有节点都继承 Node 类型，因此所有类型都共享相同的基本属性和方法。



**节点关系**

每个节点都有一个 childNodes 属性，这个属性的值是一个类数组对象 NodeList。

每个节点都有一个 parentNode 属性，指向其 DOM 树中的父元素。

使用 previousSibling 和 nextSibling 可以在列表的节点间导航。

<img src="C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220414150318690.png" alt="image-20220414150318690" style="zoom:80%;" />



利用这些关系指针，几乎可以访问到文档树的任何节点。



**操纵节点**

+ appendChild()。用于在 childNodes 列表末尾添加节点。并返回新添加的节点。
+ insertBefore()。把节点放到 childNodes 中的特定位置。这个方法接收两个参数：要插入的节点和参照节点。
+ replaceChild()。接收两个参数：要插入的节点和要替换的节点。
+ removeChild()。接收一个参数：要移除的节点。



**其他方法**

+ cloneNode()。会返回与调用它的节点一模一样的节点。可选参数：是否深复制。



### 1.3 Document 类型

Document 类型是 JavaScript 中表示文档节点的类型。在浏览器中， document 表示整个 HTML 页面。同时，document 也是 window 对象的属性。



**文档子节点**



















## BOM







## AJAX















