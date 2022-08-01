### 1. 介绍 js 的数据类型。

js 一共有 7 种基本数据类型，分别是 Undefined、Null、Boolean、Number、String，还有在 ES6 中新增的 Symbol 和 ES10 中新增的 BigInt 类型。

+ symbol

  ~~~js
  let id = Symbol();
  ~~~

  Symbol 代表创建后独一无二且不可变的数据类型，它的出现可以解决可能出现的全局变量冲突的问题。

+ BigInt

  `BigInt` 提供了对任意长度整数的支持。

  创建 bigint 的方式有两种：在一个整数字面量后面加 `n` 或者调用 `BigInt` 函数，该函数从字符串、数字等中生成 bigint。



引用数据类型（对象、数组和函数）。



### 2.null 和 undefined 的区别？

null 用来表示空对象指针，undefined 用来表示变量未初始化。

### 3.typeof null === "object"

这是因为特殊值 null 被认为是一个对空对象的引用，但这是 js 的一个 bug。

### 4. 内部属性 [[Class]] 是什么？

所有 typeof 返回值为 "object" 的对象（如数组）都包含一个内部属性 [[Class]]（我们可以把它看作一个内部的分类，而非传统的面向对象意义上的类）。这个属性无法直接访问，一般通过 Object.prototype.toString(..) 来查看。例如：

~~~js
Object.prototype.toString.call( [1,2,3] );
// "[object Array]"

Object.prototype.toString.call( /regex-literal/i );
// "[object RegExp]"

// 我们自己创建的类就不会有这份特殊待遇，因为 toString() 找不到 toStringTag 属性时只好返回默认的 Object 标签
// 默认情况类的[[Class]]返回[object Object]
class Class1 {}
Object.prototype.toString.call(new Class1()); // "[object Object]"
// 需要定制[[Class]]
class Class2 {
    get [Symbol.toStringTag]() {
    	return "Class2";
    }
}
Object.prototype.toString.call(new Class2()); // "[object Class2]"
~~~



### 17. 其他值到字符串的转换规则？

规范的 9.8 节中定义了抽象操作 ToString ，它负责处理非字符串到字符串的强制类型转换。

（1）Null 和 Undefined 类型 ，null 转换为 "null"，undefined 转换为 "undefined"，

（2）Boolean 类型，true 转换为 "true"，false 转换为 "false"。

（3）Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式。

（4）Symbol 类型的值直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产生错误。

（5）对普通对象来说，除非自行定义 toString() 方法，否则会调用Object.prototype.toString()来返回内部属性 [[Class]] 的值，如"[object Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其返回值。

### 18. 其他值到数字值的转换规则？

有时我们需要将非数字值当作数字来使用，比如数学运算。为此 ES5 规范在 9.3 节定义了抽象操作 ToNumber。

（1）Undefined 类型的值转换为 NaN。

（2）Null 类型的值转换为 0。

（3）Boolean 类型的值，true 转换为 1，false 转换为 0。

（4）String 类型的值转换如同使用 Number() 函数进行转换，如果包含非数字值则转换为 NaN，空字符串为 0。

（5）Symbol 类型的值不能转换为数字，会报错。

（6）对象（包括数组）会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则再遵循以上规则将其强制转换为数字。

### 19.对象转原始类型是根据什么流程运行的？

如果 Symbol.toPrimitive()方法，优先调用再返回
调用 valueOf()，如果转换为原始类型，则返回
调用 toString()，如果转换为原始类型，则返回
如果都没有返回原始类型，会报错

### 19. 其他值到布尔类型的值的转换规则？

ES5 规范 9.2 节中定义了抽象操作 ToBoolean，列举了布尔强制类型转换所有可能出现的结果。

以下这些是假值：
• undefined
• null
• false
• +0、-0 和 NaN
• ""

假值的布尔强制类型转换结果为 false。从逻辑上说，假值列表以外的都应该是真值。

### 20. {} 和 [] 的 valueOf 和 toString 的结果是什么？

{} 的 valueOf 结果为 {} ，`toString 的结果为 "[object Object]"`

[] 的 valueOf 结果为 [] ，`toString 的结果为 ""`

### 22. ~ 操作符的作用？

~ 返回 补码，并且 ~ 会将数字`转换为 32 位整数`，因此我们可以使用 ~ 来进行取整操作。

~x 大致等同于 -(x+1)。

### 24. `+` 操作符什么时候用于字符串的拼接？

简单来说就是，如果 + 的其中一个操作数是字符串（或者类型转换为字符串），则执行字符串拼接，否则执行数字加法。

那么对于除了加法的运算符来说，只要其中一方是数字，那么另一方就会被转为数字。

### 23.[] == ![]结果是什么？为什么？

== 中，左右两边都需要转换为数字然后进行比较。
[]转换为数字为 0。
![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为 true,
因此![]为 false，进而在转换成数字，变为 0。
0 == 0 ， 结果为 true

### 25. 什么情况下会发生布尔值的隐式强制类型转换？

（1） if (..) 语句中的条件判断表达式。
（2） for ( .. ; .. ; .. ) 语句中的条件判断表达式（第二个）。
（3） while (..) 和 do..while(..) 循环中的条件判断表达式。
（4） ? : 中的条件判断表达式。
（5） 逻辑运算符 ||（逻辑或）和 &&（逻辑与）左边的操作数（作为条件判断表达式）。

### 27. Symbol 值的强制类型转换？

ES6 允许从 Symbol 到字符串的显式强制类型转换，然而隐式强制类型转换会产生错误。

Symbol 值不能够被强制类型转换为数字（显式和隐式都会产生错误），但可以被强制类型转换为布尔值（显式和隐式结果都是 true ）。

### 28.==/===

"=="是算术运算符，在使用时会遵循类型转换机制。

"===" 全等操作符，只有两个操作数在不进行类型转换的前提下相等才会返回true。即需要两个操作数类型相同，数值相等。



### 29.判断类型方法

+ typeof

  适合检测原始类型，对于原始类型来说，除了 null 都可以调用typeof显示正确的类型。但对于引用数据类型，除了函数之外，都会显示"object"。

+ instanceof

  用来检测引用数据类型，本质上是基于原型链判断。

+ constructor

  返回构造函数。注意：除了 undefined 和 null 之外，其他类型都可以通过 constructor 属性来判断类型

+ Object.prototype.toString.call()

  返回格式为[object xxx]，是判断一个变量的类型是最准确的方法

### 29.为什么是Object.prototype.toString.call()

这是因为toString为Object的原型方法，而Array ，function等类型作为Object的实例，都重写了toString方法。不同的对象类型调用toString方法时，根据原型链的知识，调用的是对应的重写之后的toString方法（function类型返回内容为函数体的字符串，Array类型返回元素组成的字符串…），而不会去调用Object上原型toString方法（返回对象的具体类型），所以采用obj.toString()不能得到其对象类型，只能将obj转换为字符串类型；因此，在想要得到对象的具体类型时，应该调用Object上原型toString方法。

### 29. 如何将字符串转化为数字，例如 '12.3b'?

（1）使用 Number() 方法，前提是所包含的字符串不包含不合法字符。

（2）使用 parseInt() 方法，parseInt() 函数可解析一个字符串，并返回一个整数。还可以设置要解析的数字的基数。当基数的值为 0，或没有设置该参数时，parseInt() 会根据 string 来判断数字的基数。

（3）使用 parseFloat() 方法，该函数解析一个字符串参数并返回一个浮点数。

（4）使用 + 操作符的隐式转换，前提是所包含的字符串不包含不合法字符。

注：b不合法。

### 30.javascript 代码中的 "use strict"; 是什么意思 ? 使用它区别是什么？

use strict 指的是严格运行模式，在这种模式对 js 的使用添加了一些限制。比如说禁止 this 指向全局对象，还有禁止使用 with 语句等。设立严格模式的目的，主要是为了消除代码使用中的一些不安全的使用方式，也是为了消除 js 语法本身的一些不合理的地方，以此来减少一些运行时的怪异的行为。同时使用严格运行模式也能够提高编译的效率，从而提高代码的运行速度。
我认为严格模式代表了 js 一种更合理、更安全、更严谨的发展方向。

### 51. Javascript 中，有一个函数，执行时对象查找时，永远不会去查找原型，这个函数是？

**hasOwnProperty**

所有继承了 Object 的对象都会继承到 hasOwnProperty 方法。这个方法可以用来检测一个对象是否含有特定的自身属性，和 in 运算符不同，该方法会忽略掉那些从原型链上继承到的属性。



### 54. js 延迟加载的方式有哪些？

相关知识点：

js 延迟加载，也就是等页面加载完成之后再加载 JavaScript 文件。 js 延迟加载有助于提高页面加载速度。

一般有以下几种方式：

- defer 属性
- async 属性
- 动态创建 DOM 方式
- 使用 setTimeout 延迟方法
- 让 JS 最后加载

回答：

js 的加载、解析和执行会阻塞页面的渲染过程，因此我们希望 js 脚本能够尽可能的延迟加载，提高页面的渲染速度。

我了解到的几种方式是：

第一种方式是我们一般采用的是将 js 脚本放在文档的底部，来使 js 脚本尽可能的在最后来加载执行。

第二种方式是给 js 脚本添加 defer 属性，这个属性会让脚本的加载与文档的解析同步解析，然后在文档解析完成后再执行这个脚本文件，这样的话就能使页面的渲染不被阻塞。多个设置了 defer 属性的脚本按规范来说最后是顺序执行的，但是在一些浏览器中可能不是这样。

第三种方式是给 js 脚本添加 async 属性，这个属性会使脚本异步加载，不会阻塞页面的解析过程，但是当脚本加载完成后立即执行 js 脚本，这个时候如果文档没有解析完成的话同样会阻塞。多个 async 属性的脚本的执行顺序是不可预测的，一般不会按照代码的顺序依次执行。

第四种方式是动态创建 DOM 标签的方式，我们可以对文档的加载事件进行监听，**当文档加载完成后再动态的创建 script 标签来引入 js 脚本。**

### 96. js 中的深浅拷贝实现？

~~~js
// 浅拷贝的实现;

function shallowCopy(object) {
    // 只拷贝对象
    if (!object || typeof object !== "object") return;

    // 根据 object 的类型判断是新建一个数组还是对象
    let newObject = Array.isArray(object) ? [] : {};

    // 遍历 object，并且判断是 object 的属性才拷贝
    for (let key in object) {
        if (object.hasOwnProperty(key)) {
        newObject[key] = object[key];
        }
    }

    return newObject;
}

// 深拷贝的实现;

function deepCopy(object) {
    if (!object || typeof object !== "object") return object;

    let newObject = Array.isArray(object) ? [] : {};

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
        newObject[key] = deepCopy(object[key]);
        }
    }

    return newObject;
}
~~~



浅拷贝指的是将一个对象的属性值复制到另一个对象，如果有的属性的值为引用类型的话，那么会将这个引用的地址复制给对象，因此两个对象会有同一个引用类型的引用。浅拷贝可以使用 Object.assign 和展开运算符来实现。

深拷贝相对浅拷贝而言，如果遇到属性值为引用类型的时候，它新建一个引用类型并将对应的值复制给它，因此对象获得的一个新的引用类型而不是一个原有类型的引用。深拷贝对于一些对象可以使用 JSON 的两个函数来实现，但是由于 JSON 的对象格式比 js 的对象格式更加严格，所以如果属性值里边出现函数或者 Symbol 类型的值时，会转换失败。

### 99. 为什么 0.1 + 0.2 != 0.3？如何解决这个问题？

当计算机计算 0.1+0.2 的时候，实际上计算的是这两个数字在计算机里所存储的二进制，0.1 和 0.2 在转换为二进制表示的时候会出现位数无限循环的情况。js 中是以 64 位双精度格式来存储数字的，只有 53 位的有效数字，超过这个长度的位数会被截取掉这样就造成了精度丢失的问题。这是第一个会造成精度丢失的地方。在对两个以 64 位双精度格式的数据进行计算的时候，首先会进行对阶的处理，对阶指的是将阶码对齐，也就是将小数点的位置对齐后，再进行计算，一般是小阶向大阶对齐，因此小阶的数在对齐的过程中，有效数字会向右移动，移动后超过有效位数的位会被截取掉，这是第二个可能会出现精度丢失的地方。当两个数据阶码对齐后，进行相加运算后，得到的结果可能会超过 53 位有效数字，因此超过的位数也会被截取掉，这是可能发生精度丢失的第三个地方。

对于这样的情况，我们可以将其转换为整数后再进行运算，运算后再转换为对应的小数，以这种方式来解决这个问题。

我们还可以将两个数相加的结果和右边相减，如果相减的结果小于一个极小数，那么我们就可以认定结果是相等的，这个极小数可以使用 es6 的 Number.EPSILON。



### 97.map和Object的区别

|          |      | Map                                                          | Object                                                       |
| :------- | ---- | :----------------------------------------------------------- | ------------------------------------------------------------ |
| 意外的键 |      | `Map` 默认情 况不包含任何键。只包含显式插入的键。            | 一个 `Object` 有一个原型, 原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。<br />**备注：**虽然从 ES5 开始可以用 [`Object.create(null)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create) 来创建一个没有原型的对象，但是这种用法不太常见。 |
| 键的类型 |      | 一个 `Map` 的键可以是**任意值**，包括函数、对象或任意基本类型。 | 一个 `Object` 的键必须是一个 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 或是 [`Symbol`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)。 |
| 键的顺序 |      | `Map` 中的 key 是有序的。                                    |                                                              |
| Size     |      | `Map` 的键值对个数可以轻易地通过 [`size`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map/size) 属性获取。 | `Object` 的键值对个数只能手动计算.                           |
| 迭代     |      | `Map` 是 [可迭代的](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols) 的，所以可以直接被迭代。 | `Object` 没有实现 [迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)，所以使用 JavaSctipt 的 [for...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of) 表达式并不能直接迭代对象。**备注：**对象可以实现迭代协议，或者你可以使用 [`Object.keys`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys) 或 [`Object.entries`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)。[for...in](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...in) 表达式允许你迭代一个对象的*可枚举*属性。 |
| 性能     |      | 在频繁增删键值对的场景下表现更好。                           | 在频繁添加和删除键值对的场景下未作出优化。                   |

**尽管如此，有时候利用 Object 来代替 Map 会有奇效（存、取代码更简单）。**



### 55. 为什么普通 for 循环的性能远远高于 forEach 的性能，请解释其中的原因

for 循环没有任何额外的函数调用栈和上下文；
forEach 函数签名实际上是 array.forEach(function(currentValue, index, arr), thisValue)
它不是普通的 for 循环的语法糖，还有诸多参数和上下文需要在执行的时候考虑进来，这里可能拖慢性能；



### 56.对象没有length属性，想要获得对象的长度

![image-20220610160444827](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220610160444827.png)

但这个方法不能获得原型上继承的属性，完美方法：

~~~js
function getPropertyCount(o){  
    var n, count = 0;  
    for(n in o){  
        if(o.hasOwnProperty(n)){  
            count++;  
        }  
    }  
    return count;  
} 
~~~

![image-20220610160546999](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220610160546999.png)





### 57.Function.length 和 argument.length

`Function.length` 属性指明函数的形参个数。

`arguments.length`指明本次函数调用时传入函数的实参数量。



### 130. Symbol 类型的注意点？

- 1.Symbol 函数前不能使用 new 命令，否则会报错。
- 2.Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
- 3.Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。
- 4.Object.getOwnPropertySymbols 方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
- 5.Symbol.for 接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。
- 6.Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。
- 7.Symbol 值作为对象属性名不能用点运算符，因为会转为字符串
