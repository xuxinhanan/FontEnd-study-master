# 一、react基础

> 使用 React 时，应用就是一个个状态机，页面中的组件在得到所需状态之后，React 便会生成一个视图（ View ），在状态机的状态发生改变后，又会由 React 生成一个对应状态的视图。

## 声明式编程

React 推行声明式编程范式。将界面抽象为状态和视图，只需定义好每个状态对应的视图就行了，剩下的 React 会帮你搞定 ，比如状态改变自动刷新视图等。

## 虚拟DOM

React 使用了元素这种特殊类型的对象来控制 UI 流程。元素描述了屏幕上需要显示的内容。这些不可变对象比组件和组件实例要简单得多，而且只包含了展示界面所必需的信息。

~~~json
{ 
  type: Title, 
  props: { 
    color: 'red', 
    children: { // DOM 元素和组件可以互相嵌套，以表示整个渲染树
      type: 'h1', 
      props: { 
        children: 'Hello, H1!' 
      } 
    } 
  } 
}
~~~

元素最重要的属性是 type，另一个比较特殊的属性是 children，它是可选的，用于表示元素的直接后代。type 属性很重要，因为它告诉 React 如何处理元素本身。实际上，如果 type 属性是字符串，那么元素就表示 DOM 节点；如果 type 属性是函数，那么元素就是组件。

当元素的 type 属性是函数时，React 会调用它，传入 props 来取回底层元素。React 会一直对返回结果递归地执行相同的操作，直到取回完整的 DOM 节点树，然后就可以将它渲染到屏幕。











![image-20220618221906153](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220618221906153.png)

![image-20220618221916065](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220618221916065.png)











# 二、整理代码





## 常见最佳实践

### 1.多行书写

需要嵌套元素的任何情况下都应该多行书写：

~~~html
<div> 
  <Header />
  <div> 
 		<Main content={...} /> 
 	</div> 
</div>
~~~

多行书写元素时，一定要记得用括号封装它们。JSX 本质上会替换成函数，由于自动分号插入机制的存在，另起一行的函数可能会导致意外结果。

以下示例可以正常运行，因为 div 元素和返回在同一行：

```html
return <div />
```

但接下来的示例就失效了：

```react
return 
 <div />
```

因为它会转换为以下代码：

```react
return; 
React.createElement("div", null);
```

因此你需要将代码语句包裹在括号内：

~~~html
return ( 
 <div /> 
)
~~~

### 2.多个属性的书写

编写 JSX 代码经常遇到的一个问题是元素拥有多个属性。常见的解决方案是一行书写一个属性，同时缩进一个层级，并保持结尾括号和开始标签对齐：

```html
<button 
  foo="bar" 
  veryLongPropertyName="baz" 
  onSomething={this.handleSomething} 
/>
```

### 3.条件语句

JSX 有许多不同方式来表达条件逻辑，理解每种方式的益处及其存在的问题对于编写可读且可维护的代码非常重要。

假设我们想要在用户当前登录到应用时显示注销按钮。起初的代码如下所示：

```jsx
let button 
if (isLoggedIn) { 
  button = <LogoutButton /> 
} 
return <div>{button}</div>
```

这种做法可行，但可读性不够好，组件和条件很多时会更差。

JSX 可以利用行内条件来判断：

~~~jsx
<div> 
 {isLoggedIn && <LoginButton />} 
</div>
~~~

上述写法同样有效，因为如果条件为 false，则不会渲染任何组件，而如果条件为 true，那么 LoginButton 组件的 createElement 方法会被调用，并返回元素以构建最终的元素树。

如果条件语句有额外分支（常见的 if...else 语句），就可以利用 JavaScript 的 if...else 语句，如下所示：

~~~jsx
let button 
if (isLoggedIn) { 
  button = <LogoutButton /> 
} else { 
  button = <LoginButton /> 
} 
return <div>{button}</div>
~~~

更好的替代方案是三元条件运算，因为代码更简洁：

```jsx
<div> 
  {isLoggedIn ? <LogoutButton /> : <LoginButton />} 
</div>
```

再来看看更复杂情况下的最佳方案。例如，我们需要检查多个变量才能判断是否要渲染组件：

~~~jsx
<div> 
  {dataIsReady && (isAdmin || userHasPermissions) && 
 		<SecretData /> 
  } 
</div>
~~~

上述示例中的行内条件语句的写法很好，但可读性受到了很大影响。此时可以在组件内编写一个辅助函数来检验 JSX 的条件语句：

```jsx
canShowSecretData() { 
  const { dataIsReady, isAdmin, userHasPermissions } = this.props 
  return dataIsReady && (isAdmin || userHasPermissions) 
}
<div> 
  {this.canShowSecretData() && <SecretData />} 
</div>
```

修改后的代码大大提升了可读性，条件语句也更直观。

如果不喜欢用函数，那么可以利用对象的 getter 方法使代码更优雅。

```jsx
get canShowSecretData() { 
  const { dataIsReady, isAdmin, userHasPermissions } = this.props 
  return dataIsReady && (isAdmin || userHasPermissions) 
} 

<div> 
  {this.canShowSecretData && <SecretData />} 
</div>
```

还有一些方案需要用到外部依赖。为了尽量小化应用包体积，最好避免引入外部依赖，不过当前这种特殊情况值得这样做，因为改进模板的可读性有很大好处。

第一项方案是 render-if 库：

```jsx
const { dataIsReady, isAdmin, userHasPermissions } = this.props 
const canShowSecretData = renderIf( 
  dataIsReady && (isAdmin || userHasPermissions) 
) 

<div> 
  {canShowSecretData(<SecretData />)} 
</div>
```

我们将条件语句封装进 renderIf 函数。这个工具函数的返回值也是一个函数，可以接收 JSX 标记作为参数，当条件为 true 时显示。

**始终牢记，不要在组件内添加过多逻辑。有些组件可能需要这样做，但我们应该尽可能保持组件简洁易懂，这样便于定位和修复问题。**

至少应该保持 renderIf 函数简洁，为了实现这个目的，可以使用另一个工具库 react-only-if，有了它之后，可以通过高阶组件来设置条件函数，只需要按照条件为真的情况编写组件即可：

~~~jsx
const SecretDataOnlyIf = onlyIf( 
  ({ dataIsReady, isAdmin, userHasPermissions }) => { 
 		return dataIsReady && (isAdmin || userHasPermissions) 
  } 
)(SecretData) 

<div> 
  <SecretDataOnlyIf 
 		dataIsReady={...} 
 		isAdmin={...} 
 		userHasPermissions={...} 
  /> 
</div>
~~~

在以上代码中，组件内部不包含任何逻辑。

将条件语句作为 onlyIf 函数的第一个参数传入，满足条件时就渲染组件。用于校验条件的函数可以接收组件的属性、状态以及上下文环境。这样就可以避免条件语句对组件造成污染，有助于我们更轻松地理解并探究组件的代码。

### 4.循环

开发 UI 时经常需要展示列表。将 JavaScript 作为模板语言来展示列表非常方便。

如果在 JSX 模板中编写一个函数并返回数组，那么数组的每一项都会编译为一个元素。

针对给定对象的数组生成元素数组，最常用的做法是使用 map 方法。

```jsx
<ul> 
  {users.map(user =><li>{user.name}</li>)} 
</ul>
```

### 5.次级渲染

我们总是希望组件可以足够小，渲染方法也要简单明了。

然而，实现这个目的并不简单，尤其是迭代开发应用时，我们无法在第一次迭代过程中准确地判断如何将组件拆分得更小。

那么当渲染方法的代码量多到难以维护时，应该做什么呢？一种方案是将其拆分成更小的方法，同时又将所有逻辑都保留在原有组件内部。

```jsx
renderUserMenu() { 
 // JSX 用于用户菜单
} 
renderAdminMenu() { 
 // JSX 用于管理员菜单
} 
render() { 
  return ( 
    <div> 
      <h1>Welcome back!</h1> 
      {this.userExists && this.renderUserMenu()} 
      {this.userIsAdmin && this.renderAdminMenu()} 
    </div> 
  ) 
}
```

这种方案并不总是可以当作最佳实践，因为显然拆分组件的做法更好。有时这样做只是为了保持渲染方法简洁。

## 函数式编程与 UI 

最后需要学习的就是如何用函数式编程构建 UI，这也正是使用 React 的目的。可以将 UI 看作传入应用状态的函数，如下所示：

```jsx
UI = f(state)
```

我们希望这是一个幂等函数，即传入相同的应用状态时会返回同样的 UI。

使用 React 时，可以将创建 UI 的组件看作函数。

组件可以组合形成最后的 UI，这也正是函数式编程的特性之一。



## 函数式组件

函数式组件就是一个普通函数，**其参数是一个对象，在被调用时就是传入的 props** ，配合函数参数的解构使用起来非常优雅。函数式组件的属性默认值和属性类型只能通过函数的属性定义。

```jsx
const Button = ({ text }) => <button>{text}</button> 
Button.propTypes = { 
  text: React.PropTypes.string, 
}
```

无状态函数式组件与状态组件的一项区别在于，this 在无状态函数式组件的执行过程中不指向组件本身。

因为无状态函数式组件不能访问组件实例，所以如果要使用 ref 或者事件处理器，需要按以下方式来定义。

```jsx
() => { 
  let input 
  const onClick = () => input.focus() 
  return ( 
    <div>
      <input ref={el => (input = el)} /> 
      <button onClick={onClick}>Focus</button> 
    </div> 
  ) 
}
```



> 占坑。函数式组件查看另外一个文档。





## 复用组件

现在我们来看一个真实示例，研究如何将一个不可复用的组件改成接口清晰通用的可复用组件。

假设组件从 API 路径加载一个消息集合，并在屏幕上显示列表。

```jsx
class PostList extends React.Component {
  constructor(props) { 
    super(props) 
    // 一个空数组被赋给消息，以表示初始状态
    this.state = { 
      posts: [], 
    } 
  } 
  // 调用 componentDidMount 时会触发 API 调用，取回的数据将保存到状态中
  componentDidMount() { 
    // 辅助类 Posts 用来与 API 通信，它的获取方法会返回一个 Promise 对象，请求成功后会返回消息列表
    Posts.fetch().then(posts => { 
      this.setState({ posts }) 
    }) 
  }
  // 显示消息列表
  render() { 
    return ( 
      <ul> 
        // 我们在 render 方法内遍历了消息，并将其中的每条消息都映射为li元素
        {this.state.posts.map(post => ( 
          <li key={post.id}> 
            <h1>{post.title}</h1> 
            {post.excerpt && <p>{post.excerpt}</p>} 
          </li> 
        ))} 
      </ul> 
    ) 
  }
}
```

现在，假设我们需要渲染一个类似的列表，不过这次想要显示的是从 props 而不是状态中获取的用户列表（以明确表示我们能应对不同场景）：

```jsx
const UserList = ({ users }) => ( 
  <ul> 
    {users.map(user => ( 
      <li key={user.id}> 
        <h1>{user.username}</h1> 
        {user.bio && <p>{user.bio}</p>} 
      </li> 
    ))} 
  </ul> 
)
```

传入用户集合，上述代码会渲染与消息示例类似的无序列表。不同之处在于标题（heading），本例中的标题是用户名，而非之前的消息标题；还有可选部分要换成用户的简历属性，如果存在，就显示出来。

如何复用上面的组件呢？

第一步先创建可复用的列表组件，通过定义通用的集合属性，对该列表组件做一些抽象并与显示的数据解耦。最主要的需求在于，消息列表要显示标题和摘要属性，而用户列表要显示用户名和简历属性。

为了实现这个需求，我们创建两个 prop：titleKey 用于指定需要显示的属性名，textKey 则用于指定可选部分。

可复用的新 List 的 prop 如下所示：

```js
List.propTypes = { 
  collection: React.PropTypes.array, 
  textKey: React.PropTypes.string, 
  titleKey: React.PropTypes.string, 
}
```

由于 List 组件不会包含任何状态或函数，可以将其写为无状态函数式组件：

```jsx
const List = ({ collection, textKey, titleKey }) => ( 
  <ul> 
    {collection.map(item => 
			<Item 
				key={item.id} 
				text={item[textKey]} 
				title={item[titleKey]} 
			/> 
	  )} 
  </ul> 
)
```

List 组件接收 prop，并对集合进行迭代，将所有数据项映射为（将要创建的）另一个组件。子组件传入了标题和文本这两个 prop，分别表示主属性和可选属性的值。

Item 组件非常简洁：

```jsx
const Item = ({ text, title }) => ( 
  <li> 
    <h1>{title}</h1> 
    {text && <p>{text}</p>} 
  </li> 
) 
Item.propTypes = { 
  text: React.PropTypes.string, 
  title: React.PropTypes.string, 
}
```

至此，我们创建了两个接口清晰的组件，可以用它们来显示消息、用户以及任何其他类型的列表。

修改 PostList 组件的渲染方法，如下所示：

```jsx
render() { 
  return ( 
    <List 
      collection={this.state.posts} 
      textKey="excerpt" 
      titleKey="title" 
      /> 
  ) 
}
```

UserList 组件同理：

```jsx
const UserList = ({ users }) => ( 
  <List 
    collection={users} 
    textKey="bio" 
    titleKey="username" 
    /> 
)
```

我们用 prop 创建通用清晰的接口，使得一个面向单一需求的组件变得可复用。现在可以在应用中多次复用这个组件了。有了 prop 类型的帮助后，每个开发人员都能轻易理解它的实现。













