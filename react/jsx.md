**Babel**：首先，需要清楚地理解 Babel 能为我们解决什么问题。原因是我们想在浏览器这个目标环境中使用尚未实现的语言特性。这些高级特性允许开发者编写更整洁的代码，但浏览器无法识别并执行。

解决方案就是用 JSX 和 ES2015 语法编写脚本，准备发布时再将代码编译成当今主流浏览器都已实现的 ES5 标准规范。

Babel 可以将 ES2015 的 JavaScript 代码编译成 ES5 的，也可以将 JSX 编译成 JavaScript 函数。这个过程称为转译，因为它将源代码编译成另一份新源代码，而不是可执行文件。



------------------



现在我们来看看如何在组件内声明元素，React 提供了两种定义元素的方式。一种是使用 JavaScript 函数，另一种是使用类似 XML 的 JSX 语法。

以下代码展示了如何用 React 的 createElement 函数创建 div 元素：

~~~react
React.createElement('div')
~~~

以下是 JSX 写法：

~~~react
<div />
~~~

它看起来很像普通的 HTML。实际上，**运行 Babel 时会将 <div /> 转换成` React.createElement('div')`**，编写模板时要始终牢记这一点。





## DOM 元素与 React 组件

有了 JSX 后，我们**既可以创建 HTML 元素，也可以创建 React 元素**；**唯一的区别在于它们是否以大写字母开头。**

例如，渲染 HTML 按钮元素时使用<button />，而渲染 Button 组件时使用<Button />。

前一个按钮会转译为以下代码：

~~~js
React.createELement('button')  // html 元素
~~~

后一个按钮会转译为以下代码：

```js
React.createElement(Button) // React 元素
```

并且 **JSX 支持自闭的标签，这样可以很好地保持代码简洁**，无须重复编写不必要的标签。



## 元素属性

JSX 可以非常方便地书写包含属性的 DOM 元素或 React 组件。

```html
<img src="https://facebook.github.io/react/img/logo.svg" alt="React.js" /> 
```

JavaScript 的等效写法如下所示：

~~~js
React.createElement("img", { 
  src: "https://facebook.github.io/react/img/logo.svg", 
  alt: "React.js" 
}); 
~~~

## 子元素

**JSX 允许定义子元素来描述元素树**，并构建复杂的 UI。

```html
<div> 
  <a href="https://facebook.github.io/react/">Click me!</a> 
</div>
```

等效的 JavaScript 代码如下所示：

~~~react
React.createElement( 
  "div", 
  null, 
  React.createElement( 
    "a", 
    { href: "https://facebook.github.io/react/" }, 
    "Click me!" 
  ) 
);
~~~

JSX 的妙处在于没有限制只能将元素嵌套为其他元素的子元素，**还可以使用函数或变量这样的 JavaScript 表达式。**

要想这样做，只需要用双花括号括起表达式即可：

```html
<div> 
  Hello, {variable}
</div>
```

**同理，这也适用于非字符串属性**：

~~~html
<a href={this.makeHref()}>Click me!</a>
~~~

## 与 HTML 的区别

### 1.属性

我们要始终牢记，**JSX 不是一门标准语言，需要转译成 JavaScript。**由于这一点，有些属性无法使用。比如，我们需要用 className 取代 class，用 htmlFor 取代 for：

```html
<label className="awesome-label" htmlFor="name" /> 

// classname取代class, htmlFor取代for
```

这是因为 class 和 for 都是 JavaScript 的保留字。

### 2.样式

 与 HTML 不同，样式属性期望传入 JavaScript 对象，而不是 CSS 字符串，而且样式名的写法为驼峰式命名法：

```html
<div style={{ backgroundColor: 'red' }} />
```

### 3.根元素

JSX 和 HTML 之间还有一个很重要的区别值得一提，**因为 JSX 元素会转换为 JavaScript 函数，但 JavaScript 不允许返回两个函数，因此如果有多个同级元素，需要强制将它们封装在一个父元素中。**

~~~html
<div /> 
<div /> /* Adjacent JSX elements must be wrapped in an enclosing tag */

/* 应该要这样 */
<div> 
 <div /> 
 <div /> 
</div>
~~~

### 4.空格

实际上，JSX 处理文本和元素间的空格的方式与 HTML 不同，这种方式有点违反直觉。

```html
<div> 
  <span>foo</span> 
  bar 
  <span>baz</span> 
</div>
```

浏览器解析 HTML 时，以上代码会显示 foo bar baz，这与我们的预想相同。

而 JSX 会将同一份代码渲染为 foobarbaz，这是因为嵌套的三行代码转译成了 div 元素的独立子元素，没有将空格计算在内。**为了得到与 HTML 一致的输出结果，普遍的解决方案是在元素间显式插入空格。**

~~~html
<div> 
  <span>foo</span> 
  {' '} 
  bar 
  {' '} 
  <span>baz</span> 
</div>
~~~

### 5. 布尔值属性

如果**设置某个属性却没有赋值，那么 JSX 会默认其值是 true**，这种行为类似 HTML 的 disabled 属性。

```react
<button disabled /> 
React.createElement("button", { disabled: true });
```

在使用 React 时，我们**应当始终显式地声明，以避免发生混淆**。

## ”...“传递属性

**向子元素传递数据时，不要按引用方式传递整个 JavaScript 对象，而要使用对象的基本类型值以方便校验。**比如：

```react
const foo = { id: 'bar' } 
return <div {...foo} />

// 不要写成 return <div foo />
```

以上代码的转译结果如下所示：

```react
var foo = { id: 'bar' }; 
return React.createElement('div', foo);
```





## 事件绑定

React 中绑定事件的方式和最初 HTML 绑定事件类似。但：

+ **React 中的事件名字是驼峰式的**，**而HTML 中的事件名字必须全部用小写字母**。
+ **React 中的事件处理器是一个函数**，**而 HTML 中的事件处理器一个宇符串**。



### 事件对象

React也会给事件处理函数传入一个事件对象参数，这个参数的很多功能和原生事件对象很相似，比如可以阻止默认事件。但需要注意，这个事件对象并不是原生事件对象 ，而 React 基于 W3C 封装过的，屏蔽了浏览器差异。React 也提供了访问原生事件对象的方式。

```js
onClick(e) { 
	e.nativeEvent // nativeEvent 原生事件对象
}
```



### this绑定丢失的问题

```jsx
class Button extends React.Component { 
  handleClick() {
    console.log(this) 
  } 
  render() { 
    return <button onClick={this.handleClick} /> 
  } 
}
```

点击按钮后，控制台输出的结果为 null。这是因为**函数传给事件处理器后丢失了对组件的引用**。

ES2015 提供的箭头函数可以自动将当前的 this 绑定到函数体。

查看这段代码示例：

```js
() => this.setState()
```

Babel 会将以上代码转译为以下代码：

```jsx
var _this = this; 
(function () { 
  return _this.setState(); 
});
```

可以得知，**解决自动绑定问题的一种可能方案就是使用箭头函数：**

```jsx
class Button extends React.Component { 
  handleClick() { 
    console.log(this) 
  } 
  render() { 
    return <button onClick={() => this.handleClick()} />  // 解决this丢失问题
  } 
}
```

这样做符合预期，也不会带来什么特殊问题。唯一的缺点在于，如果在意性能，那么就需要理解代码的本质。

实际上，在渲染方法中绑定函数会带来无法预料的副作用，因为每次渲染组件（应用在生命周期内会多次渲染组件）时都会触发箭头函数。

问题在于，如果这个函数传递给子组件，那么子组件在每次更新过程中都会接收新的 prop。这可能会导致低效的渲染。

解决函数绑定问题的最佳方案是在构造器内进行绑定操作，这样即使多次渲染组件，它也不会发生任何改变。

```jsx
class Button extends React.Component { 
  constructor(props) { 
    super(props) 
    this.handleClick = this.handleClick.bind(this) 
  } 
  handleClick() { 
    console.log(this) 
  } 
  render() { 
    return <button onClick={this.handleClick} /> 
  } 
}
```



