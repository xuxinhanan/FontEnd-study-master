从广义上讲，组合是将两个或多个不同的东西放在一起，并得到相同的“种类”的东西——输入的组合——作为结果。

具体含义可能取决于上下文，因此我们将看一些前端 JavaScript 开发中出现的示例。



### Composition in Math

虽然数学在某种程度上与前端开发无关，但回顾一下数学定义是很有用的——如果只是为了说明这个术语的起源。

假设我们有两个函数。一个函数是 y = 2 * x，它的参数加倍。另一个函数是 y = x + 10，它的参数加 10。

如果我们将它们放在一起，以便将一个函数的输出馈送到另一个函数，我们得到 y = (2 * x) + 10。这是组合的一个例子——我们已经从另外两个函数中“组合”了这个函数功能。这就是这个词的全部含义。

请注意两个函数的组合如何为我们提供另一个函数。它并没有给我们完全不同的东西。因此，我们可以多次编写它。

组合是一个广义的术语，但我们只会在将事物组合在一起的结果是相同“种类”的事物时使用它——无论是函数、组件等。



### Function Composition

组合经常出现在函数式编程的环境中。在那里，它指的是与数学中相同的概念，但用代码表示。

假设我们有这样的代码：

```js
let date = getDate();
let text = formatDate(date);
let label = createLabel(text);
showLabel(label);
```

这段代码有一些重复。我们拿一个东西，把它转换成别的东西，拿那个东西，把它转换成别的东西，等等。

但是我们可以更进一步，去掉重复，只留下步骤吗？

```js
let steps = [
  getDate,
  formatDate,
  createLabel,
  showLabel
];
```

有人可能会说这段代码更干净。

让我们编写一个名为 runSteps 的函数，逐个应用每个步骤：

```js
function runSteps(steps) {
  let result;
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    // Apply next step in the chain
    result = step(result);
  }
  return result;
}
```

有了这个函数，我们原来的代码就变成了：

```js
runSteps([
  getDate,
  formatDate,
  createLabel,
  showLabel
]);
```

现在假设我们想要执行所有这些步骤，但是从我们程序的不同位置，在不同的时间。我们可以编写一个函数来为我们做这件事：

```js
function showDateLabel() {
  runSteps([
    getDate,
    formatDate,
    createLabel,
    showLabel
  ]);
}

// We can call it whenever!
showDateLabel();
showDateLabel();
```

或者我们可以有一个函数——我们称之为管道——来生成我们的函数：

```js
let showDateLabel = pipe(
  getDate,
  formatDate,
  createLabel,
  showLabel
);

// We can call it whenever!
showDateLabel();
showDateLabel();
```

这段代码做的事情完全相同，但我们不必显式地实现 showDateLabel（它只调用了 runSteps）。我们把它藏在管道里：

```js
function pipe(...steps) {
  // Return a function that will do this for me
  return function runSteps() {
    let result;
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      result = step(result);
    }
    return result;
  }
}
```

这个可重用的函数让我们可以重写我们的代码，这样我们就不用按顺序一个一个地手动调用函数，我们只指定步骤。我们称它为管道，因为它将前一个函数的输出“管道”到下一个函数。

回想一下我们的原始代码：

```js
let date = getDate();
let text = formatDate(date);
let label = createLabel(text);
showLabel(label);
```

而这是管道的样子：

```js
let showDateLabel = pipe(
  getDate,
  formatDate,
  createLabel,
  showLabel
);
showDateLabel();
```

如果你不喜欢使用函数组合来表达一切，你可能会想——这有什么意义呢？为什么我们要经历所有这些步骤？第一个例子不是更具可读性吗？你是唯一没有 get 到它的人吗？





### Functional Eureka

第一次了解管道和函数的组成是一个启蒙瞬间。我们不必手动调用我们的函数——相反，我们可以将我们的函数提供给另一个函数，它会给我们一个函数来调用我们的函数！

多漂亮。

那里肯定有我们不应该忽视的深刻见解。**通过将程序本身的结构（一系列步骤）变成我们的代码可以操作的东西，我们提高了抽象级别。**例如，我们可以教管道用一些日志记录包装每个步骤，或者异步运行每个步骤。这是一项强大的技术，值得我们理解。

这种编程风格也可能是一场噩梦。我们已经将函数调用的实际业务“外包”给了像管道这样的助手，因此我们不再清楚地看到每条数据是如何流入和流出我们的函数的，因为这一切都发生在管道内部。我们添加了一段“间接”——我们的代码更灵活，但不那么直接。添加太多层，我们的脑袋就会溢出。

虽然这种编程风格可以非常成功地使用（尤其是在强制哪些东西可以“适应”其他东西的强类型语言中），这有点被热情的程序员过度使用了，他们通过编写聪明的单行代码和将控制流隐藏在“优雅的”助手中来获得多巴胺。我也这样做了。

### 虽然函数组合很简洁

话虽如此，函数组合的基本思想很重要。本质上，这意味着当我们有 doX(doY(doZ(thing))) 时，我们可以先组合 doX、doY 和 doZ，然后使用结果函数。

在像上面这样的琐碎情况下，直接使用它带来的麻烦多于它的价值。但如果问题更具挑战性，它可能会变得更有用。也许，我们希望每一步都被记住。也许，每个步骤都是异步发生的，控制流程更复杂。在某些情况下，我们希望在每一步之前或之后发生一些事情，而不是到处重复这种脆弱的逻辑。也许，这些步骤本身需要由我们的程序以不同的方式“解释”，因此我们希望将它们的顺序与它们的执行方式分开。

如果我们牢记这一点，函数组合可以激发有趣的解决方案。这并不意味着我们每次想要将两个函数放在一起时都需要取出一个管道。我们不需要向计算机证明我们很聪明，也不需要学习作曲的课程。通常，简单的函数调用就足够了。



### 组件组合

我们可能会听到“组合”一词的另一个语境与声明式 UI 编程有关。我们将以 React 组件为例。

React 组件渲染其他组件，从 <App> 到 <Button>：

```js
function App() {
  return <Screen />;
}

function Screen() {
  return <Form />;
}

function Form() {
  return <Button />;
}

function Button() {
  return <button>Hey there.</button>;
}
```

这也称为“组合”，因为我们将（组件）放入其他（组件）中，并且它们非常适合彼此（“组合”）。

一个有趣的组合变体是当一个组件有“槽”时：

```js
function Layout({ sidebar, content }) {
  return (
    <div>
      <div className="sidebar">{sidebar}</div>
      <div className="content">{content}</div>
    </div>
  )
}
```

然后我们可以从不同的父组件中“填充”这些插槽：

```js
function HomePage() {
  return (
    <Layout
      sidebar={<HomeSidebar />}
      content={<HomeContent />}
    >
  )
}

function AboutPage() {
  return (
    <Layout
      sidebar={<AboutSidebar />}
      content={<AboutContent />}
    >
  )
}
```

请注意，这些“插槽”并不是一个特殊的 React 功能。它们是我们能够像传递任何其他数据一样传递 UI 片段的结果。

这也称为“组合”，因为我们用不同的子组件（”组合“）（“填充”）布局。把东西放在其他东西里面。



### 组合与继承

在将其与继承进行对比时，人们有时会说“组合”。这与函数（我们一直在讨论）关系不大，更多的是与对象和类有关——也就是说，与传统的面向对象编程有关。

特别是，如果您将代码表示为类，则很容易通过扩展（继承）来重用另一个类的行为。但是，这使得以后调整行为有些困难。例如，您可能希望类似地重用另一个类的行为，但您不能扩展多个基类。

有时，人们会说继承“锁定”了您的第一个设计，因为以后更改类层次结构的成本太高。当人们建议组合是继承的替代方案时，他们的意思是，您可以将该类的实例保留为字段，而不是扩展一个类。然后，您可以在必要时“委托”该实例，但您也可以自由地做一些不同的事情。

总体而言，该行业已在很大程度上不再将 UI 组件建模为深度继承层次结构，这在 2000 年代很常见。

这并不意味着继承总是“坏的”。但这是一个非常生硬的工具，应该适度使用。特别是，比几个级别更深的继承层次结构通常会导致浅继承不会出现的问题。

现代前端代码库很少在其 UI 中使用继承，因为当今所有流行的 UI 库都具有强大的内置组合支持。比如说，在 React 中，您将在父组件中渲染一个 <Button>，而不是扩展一个 Button。即使是包含类的 JavaScript UI 库通常也不使用继承作为重用渲染代码的一种方式。这可能是最好的。



### 总结

总而言之，当我们用它们制作第三个形状相似的东西时，我们说我们组合了两个东西。该术语具有数学含义，并且接近其在函数式编程中的含义。但是，我们越远离纯函数式编程，这个术语就越不正式和口语化。

**函数组合是一个强大的概念，但它提高了抽象级别并使您的代码不那么直接。如果您在调用函数之前以某种方式编写代码，并且团队中还有其他人，请确保您从这种方法中获得了具体的好处。**它不是“更干净”或“更好”，而且要为“漂亮”但间接的代码付出代价。













