# Hooks

## 理解Hooks

### 1.React的本质

**React组件的本质上就是函数，用来做Model到View的映射，其中，Model是输入参数，函数的执行结果是DOM树。**

![image-20220430111033219](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220430111033219.png)

在React中，我们只需要通过JSX，根据Model的数据用声明的方式去描述UI的最终展现即可，React框架会帮助我们把声明式的代码转换成命令式的DOM操作。

![image-20220501201727454](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220501201727454.png)

同时因为所有的UI都是声明出来的，不用处理细节的变化过程。因此，通过函数去描述一个组件才是最为自然的方式。

只是之前有一个局限，函数组件无法存在内部状态，必须是纯函数，而且也无法提供完整的生命周期机制。这就极大限制了函数组件的大规模使用。

现在我们知道了函数更适合去描述 State => View 这样的一个映射，但是函数组件又没有State，也没有生命周期方法。如何改进呢？



### 2.Hooks是如何诞生的？

其实顺着函数组件的思路继续思考，就会发现，如果我们想要让函数组件更有用，目标就是给函数组件加上状态。

简单想一下，函数和对象不同，并没有一个实例的对象能够在多次执行之间保存状态。

**那么势必需要一个函数之外的空间来保存这个状态，而且要能够检测其变化，从而能够触发函数组件的重新渲染。**

因此，我们**需要这样一个机制，能够把一个外部的数据绑定到函数的执行。当数据变化时，函数能够自动重新执行。**

这个机制就是Hooks。

在React中，Hooks就是把某个目标结果钩到某个可能会变化的数据源或者事件源上，那么当被钩到的数据或事件发生变化时，产生这个目标结果的代码会重新执行，产生更新后的结果。

对于函数组件，这个”源“是返回的DOM树；对于useCallback、useMemo这样与缓存相关的组件，这个”源“是依赖项。所以Hooks的结构可以如图所示：

![image-20220430140749844](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220430140749844.png)

从图中可以看到，传统意义的State，或者URL，甚至可以是窗口的大小与一个执行过程（如函数组件本身）绑定在一起。这样当State、URL、窗口大小发生变化时，都会重新执行某个函数，产生更新后的结果。

当然，既然我们的初衷是为了实现UI组件的渲染，那么在React中，其实所有的Hooks最终结果都是导致UI的变化。

另外，Hooks中被钩的对象，不仅可以是某个独立的数据源，也可以是另一个Hook执行的结果，这就带来了Hooks的最大好处：**逻辑复用。**



### 3.Hooks带来的最大好处：逻辑复用

以刚才提到的绑定窗口大小的场景为例。如果有多个组件需要在用户调整浏览器窗口大小时，重新调整布局，那么我们只需要把逻辑提取成一个公共的模块供多个组件使用。

~~~jsx
const getSize = () => {
  return window.innerWidth > 1000 ? "large" : "small";
}
const useWindowSize = () => {
  const [size, setSize] = useState(getSize());
  useEffect(() => {
  const handler = () => {
      setSize(getSize())
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);
  
  return size;
};
~~~

这样，我们在组件中使用窗口大小就会非常简单：

~~~jsx
const Demo = () => {
  const size = useWindowSize();
  if (size === "small") return <SmallComponent />;
  else return <LargeComponent />;
};
~~~

可以看到，窗口大小是一个外部的数据状态， 我们通过Hooks的方式对其进行封装从而变成一个可绑定的数据源。这样当窗口大小发生变化时，使用这个Hook的组件就都会重新渲染。并且代码也更加简洁和直观，不会产生额外的组件节点。



### 4.Hooks的另一大好处：有助于关注分离

在过去的Class组件中，不得不把同一个业务逻辑的代码分散在类组件的不同生命周期的方法中。通过Hooks的方式，可以把业务逻辑清晰地隔离开，能够让代码更加容易理解和维护。

![image-20220430145307028](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220430145307028.png)



### 5.理解hooks的依赖

如前面所说，Hooks提供了让你监听某个数据变化的能力。在数据变化之后可能会触发组件的刷新，或者时创建一个effect，又或者是刷新一个缓存等等。

那么如何定义要监听哪些数据变化的机制？其实就是指定Hooks的依赖项。

值得注意的是，依赖项并不是内置Hooks的一个特殊机制，而可以认为是一种设计模式。

这一块和vue中的响应式原理类似，在vue中，我们通过给数据设置getter，setter来监听数据变化，通过把effect包装成watcher类并在getter触发时收集依赖，在数据变化时执行依赖进行视图更新。

在定义依赖项时，我们需要注意：

1. 依赖项一定是回调函数中用到的变量，否则声明依赖项没有意义。

2. React中使用浅比较来对比依赖项是否发生了变化，所以要注意object类型。如果你是每次创建一个新对象，即使和之前的值是等价的，也会被认为是依赖项发生了变化。如下案例：

   ~~~jsx
   function Sample() {
     // 这里在每次组件执行时创建了一个新数组
     const todos = [{ text: 'Learn hooks.'}];
     useEffect(() => {
       console.log('Todos changed.');
     }, [todos]);
   }
   ~~~

   这里代码原意可能是在todos变化的时候去产生一些副作用，但是这里的todos变量是在函数内创建的，实际上每次都产生了一个新数组。所以在作为依赖项的时候进行引用的比较，实际上被认为是发生了变化的。



### 6.理解hooks下的生命周期



**忘掉class组件的生命周期**

为了理解函数组件的执行过程，我们不妨思考下 React 的本质：**从 Model 到 View 的映射。**假设状态永远不变，那么实际上函数组件就相当于是一个模板引擎，只执行一次。但是 React 本身正是为动态的状态变化而设计的，而可能引起状态变化的原因基本只有两个：

1. 用户操作产生的事件，比如点击了某个按钮。
2. 副作用产生的事件，比如发起某个请求正确返回了。

这两种事件本身并不会导致组件的重新渲染，但我们在这两种事件处理函数中，一定是因为改变了某个状态，这个状态可能是 State 或者 Context，从而导致了 UI 的重新渲染。

在 Class 组件中，我们可能会在例如componentDidUpdate的生命周期中执行state变化后的副作用。

而在函数组件中不再有生命周期的概念，而是提供了 useEffect 这样一个 Hook 专门用来执行副作用。

因此，在函数组件中思考的方式永远是：**当某个状态发生变化时，我要做什么。**而不再是在 Class 组件中的某个生命周期方法中我要做什么。



**重新思考组件的生命周期**

在传统的类组件中，有专门定义的生命周期方法用于执行不同的逻辑，那么它们在函数组件的存在的形式又是什么样的呢？

**构造函数**

在类组件中有一个专门的方法叫 constructor，也就是构造函数，在里面我们会做一些初始化的事情，比如设置 State 的初始状态，或者定义一些类的实例的成员。

而在函数组件中，它只是一个函数，没有构造函数的说法，这时我们应该如何做一些初始化的事情呢？

答案是： Hooks 自己会负责自己的初始化。比如 useState 这个 Hook，接收的参数就是定义的 State 初始值。而在过去的类组件中，你通常需要在构造函数中直接设置 this.state ，也就是设置某个值来完成初始化。

虽然这种方式几乎能覆盖大部分初始化的需求，但对于部分在类组件的构造函数中不是初始化State的逻辑，应该如何在函数组件中实现呢？

这时候我们不妨思考下类组件的构造函数的本质，其实就是：**在所以其它代码执行之前的一次性初始化工作。**

虽然没有直接的机制可以做到这点，但是利用 useRef 这个Hook我们还是可以实现这个需求。

比如以下案例，我们可以实现一个useSingleton 这样的一次性执行某段代码的自定义 Hook：

~~~jsx
import { useRef } from 'react';

// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}
~~~

然后在函数组件中，通过调用这个自定义Hook来执行一次性的初始化逻辑：

~~~jsx
import useSingleton from './useSingleton';

const MyComp = () => {
  // 使用自定义 Hook
  useSingleton(() => {
    console.log('这段代码只执行一次');
  });

  return (
    <div>My Component</div>
  );
};
~~~

代码中可以看到，useSingleton 这个 Hook 的核心逻辑就是定义只执行一次的代码。而是否在所有代码之前执行，则取决于在哪里调用，可以说，它的功能其实是包含了构造函数的功能的。



> 在日常开发中，无需去将功能映射到传统的生命周期的构造函数的概念，而是要从函数的角度出发，去思考功能如何去实现。比如在这个例子中，我们需要的其实就是抓住某段代码只需要执行一次这样一个本质的需求，从而能够更自然地用 Hooks 解决问题。



**三种常用的生命周期方法**

在类组件中，componentDidMount，componentWillUnmount，和 componentDidUpdate 这三个生命周期方法可以说是日常开发最常用的。

而在函数组件中，这几个生命周期方法可以统一到 useEffect 这个 Hook。

我们通过提供空依赖项数组让effect每次render后都执行来替代componentDidMount；通过返回一个函数来替代 componentWillUnmount；通过传入依赖项的更新来替代 componentDidUpdate。











## 使用Hooks

想要用好 React Hooks，很重要的一点，就是要能够从 Hooks 的角度去思考问题。

要做到这一点其实也不难，就是在遇到一个功能开发的需求时，首先问自己一个问题：这个功能中的哪些逻辑可以抽出来成为独立的 Hooks？

这么问的目的，是为了让我们尽可能地把业务逻辑拆成独立的 Hooks ，这样有助于实现代码的模块化和解耦，同时也方便后面的维护。





### useState：让函数组件具有维持状态的能力

在前面，我们已经知道了state是React组件的一个核心机制。而useState这个Hook就是用来管理state的，它可以让函数组件具有维持状态的能力。也就是说，在一个函数组件的多次渲染之间，这个state是共享的。

下面这个例子显示了useState的用法：

~~~jsx
import React, { useState } from 'react';

function Example() {
  // 创建一个保存 count 的 state，并给初始值 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  );
}
~~~

在这个例子中，我们声明了一个名为count的state，并得到了设置这个count值的函数setCount。当调用setCount时，count这个state就会被更新，并触发组件的刷新。

使用方法：

1. 通过传参创建 state 的初始值，可以是任意类型，比如数字、对象、数字等。

2. useState() 的返回值是一个数组。第一个数组元素用来读取 state 的值，第二个则是用来设置这个 state 的值。

   + 注意：state 的变量是只读的，我们必须通过第二个数组元素 setCount 来设置它的值。

   + 为什么返回值使用数组而不是变量？

     答案是：返回数组的话使用者通过解构赋值获取时可以对数组元素命名，而解构对象时变量必须与返回的对象属性同名。



使用 useState，需要遵循一个原则：state 中永远不要保存可以通过计算得到的值。

不过，state虽然便于维护状态，但也有自己的弊端：一旦组件有自己的状态，意味着组件如果重新创建，就需要有恢复状态的过程，这通常会让组件变得更复杂。







### useEffect：执行副作用

按字面理解，组件在每次render后执行一个副作用。

什么是副作用呢？通常来说，副作用是指一段和当前执行结果无关的代码。比如说要修改函数外部的某个变量，要发起一个请求等等。也就是说，在函数组件的当次执行过程中，useEffect中代码的执行是不影响渲染出来的UI的。



**使用方法**

~~~
  useEffect(callback, dependencies)
~~~

第一个为要执行的函数callback，第二个是可选的依赖项数组dependencies。根据传入的具体依赖项，useEffect执行情况不同，具体如下：

1. 每次 render 后执行：不提供依赖项参数。
2. 仅第一次 render 后执行：提供一个空数组作为依赖项。对应到类组件就是componentDidMount。
3. 第一次以及依赖项发生变化后执行：提供依赖项数组。
4. 组件 unmount 后执行：返回一个回调函数。对应到类组件就是componentWillUnmount。用于在组件销毁的时候做一些清理的操作，比如移除事件的监听。



**使用规则**

Hooks本身作为纯粹的JavaScript函数，不是通过某个特殊的API去创建的，而是直接定义一个函数。

它在降低学习和使用成本的同时，需要遵循一定的规则才能正常工作。

1. **Hooks 不能出现在条件语句或者循环中，也不能出现在 return 之后**

   Hooks不能在循环、条件判断或者嵌套函数内执行，而必须在顶层。同时Hooks在组件的多次渲染之间，必须按顺序被执行。因为在React组件内部，其实是维护了一个对应组件的固定Hooks执行列表的，以便在多次渲染之间保持Hooks状态，并做对比。

   ~~~jsx
   function MyComp() {
     const [count, setCount] = useState(0);
     if (count > 10) {
       // 错误：不能将 Hook 用在条件判断里
       useEffect(() => {
         // ...
       }, [count])
     }
     
     // 这里可能提前返回组件渲染结果，后面就不能再用 Hooks 了
     if (count === 0) {
       return 'No content';
     }
   
     // 错误：不能将 Hook 放在可能的 return 之后
     const [loading, setLoading] = useState(false);
     
     //...
     return <div>{count}</div>
   }
   ~~~

2. **Hooks只能在函数组件或者其他Hooks中使用**

   Hooks作为专门为函数组件设计的机制，使用的情况只有两种，一种是在函数组件内，另外一种则是在自定义的Hooks里面。











### useCallback：缓存回调函数

先看一个案例：

~~~jsx
function Counter() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => setCount(count + 1);
  // ...
  return <button onClick={handleIncrement}>+</button>
}
~~~

我们在button按钮上定义了一个事件处理函数，用来让计数器加1。但是因为定义是在函数组件内部，因此在多次渲染之间，是无法重用 handleIncrement 方法的。

但是，我们不妨思考下，每次组件状态发生变化的时候，函数组件实际上都会重新执行一遍。在每次执行的时候，实际上都会创建一个新的事件处理函数 handleIncrement。

（同时这个事件处理函数中包含了 count 这个变量的闭包，以确保每次能够得到正确的结果）

然而，有时即使 count 没有发生变化，函数组件也会因为其他状态发生变化而重新渲染，这种写法也会每次创建一个新的函数，从而导致额外的开销。同时，更重要的是：**每次创建新函数的方式会让接收事件处理函数的组件，需要重新渲染。**

比如上面的例子的button组件，接收了handleIncrement并作为一个属性。如果每次都是一个新的，那么React就会认为这个组件的props发生了变化，从而必须重新渲染。因此，**我们需要一个缓存机制：只有当count发生变化时，才重新创建一个回调函数。**而这正是useCallback的作用。



**使用方法**

~~~jsx
  useCallback(fn, deps)
~~~

这里fn是定义的回调函数，deps是依赖的变量数组。只有当某个依赖变量发生变化时，才会重新声明 fn 这个回调函数。







### useMemo：缓存计算的结果

除了 useCallback，useMemo 也是为了缓存而设计的。只不过，useCallback 缓存的是一个函数，而 useMemo 缓存的是计算的结果。

~~~
  useMemo(fn, deps);
~~~

这里的 fn 是产生所需数据的一个计算函数。通常来说，fn 会使用 deps 中声明的一些变量来生成一个结果，用来渲染出最终的 UI。

这个场景应该很容易理解：**如果某个数据是通过其它数据计算得到的，那么只有当用到的数据，也就是依赖的数据发生变化的时候，才应该需要重新计算。**



可以参考以下案例，对于一个显示用户信息的列表，现在需要对用户名进行搜索，且 UI 上需要根据搜索关键字显示过滤后的用户，那么这样一个功能需要有两个状态：

1. 用户列表数据本身：来自某个请求。
2. 搜索关键字：用户在搜索框输入的数据。

无论是两个数据中的哪一个发生变化，都需要过滤用户列表以获得需要展示的数据。那么如果不使用 useMemo 的话，就需要用这样的代码实现：

~~~jsx
import React, { useState, useEffect } from "react";

export default function SearchUserList() {
  const [users, setUsers] = useState(null);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    const doFetch = async () => {
      // 组件首次加载时发请求获取用户数据
      const res = await fetch("https://reqres.in/api/users/");
      setUsers(await res.json());
    };
    doFetch();
  }, []);
  let usersToShow = null;

  if (users) {
    // 无论组件为何刷新，这里一定会对数组做一次过滤的操作
    usersToShow = users.data.filter((user) =>
      user.first_name.includes(searchKey),
    );
  }

  return (
    <div>
      <input
        type="text"
        value={searchKey}
        onChange={(evt) => setSearchKey(evt.target.value)}
      />
      <ul>
        {usersToShow &&
          usersToShow.length > 0 &&
          usersToShow.map((user) => {
            return <li key={user.id}>{user.first_name}</li>;
          })}
      </ul>
    </div>
  );
}
~~~

在这个例子中，无论组件为何要进行一次重新渲染，实际上都需要进行一次过滤的操作。但其实你只需要在 users 或者 searchKey 这两个状态中的某一个发生变化时，重新计算获得需要展示的数据就行了。

那么，这个时候，我们就可以用 useMemo 这个 Hook 来实现这个逻辑，缓存计算的结果：

~~~jsx
//...
// 使用 userMemo 缓存计算的结果
const usersToShow = useMemo(() => {
    if (!users) return null;
    return users.data.filter((user) => {
      return user.first_name.includes(searchKey));
    }
  }, [users, searchKey]);
//...
~~~

可以看到，通过 useMemo 这个 Hook，可以避免在用到的数据没发生变化时进行的重复计算。

除了避免重复计算之外，useMemo 还有一个很重要的好处：**避免子组件的重复渲染。**

比如在例子中的 usersToShow 这个变量，如果每次都需要重新计算来得到，那么对于 UserList 这个组件而言，就会每次都需要刷新，因为它将 usersToShow 作为了一个属性。而一旦能够缓存上次的结果，就和 useCallback 的场景一样，可以避免很多不必要的组件刷新。

从本质上来说，useCallback和useMemo做了同一件事情：建立了一个绑定某个结果到依赖数据的关系。只有当依赖变了，这个结果才需要被重新得到。





### useRef：在多次渲染之间共享数据

在类组件中，我们可以定义类的成员变量，以便能在对象上通过成员属性去保存一些数据。但是在函数组件中，是没有这样一个空间去保存数据的。因此，React 让 useRef 这样一个 Hook 来提供这样的功能。

~~~
  const myRefContainer = useRef(initialValue);
~~~

我们可以把 useRef 看作是在函数组件之外创建的一个容器空间。在这个容器上，我们可以通过唯一的 current 属设置一个值，从而在函数组件的多次渲染之间共享这个值。

注意，使用 useRef 保存的数据一般是和 UI 的渲染无关的，因此当 ref 的值发生变化时，是不会触发组件的重新渲染的，这也是 useRef 区别于 useState 的地方。

除了存储跨渲染的数据之外，useRef 还有一个重要的功能，就是**保存某个 DOM 节点的引用。**我们知道，在 React 中，几乎不需要关心真实的 DOM 节点是如何渲染和修改的。但是在某些场景中，我们必须要获得真实 DOM 节点的引用，所以结合 React 的 ref 属性和 useRef 这个 Hook，我们就可以获得真实的 DOM 节点，并对这个节点进行操作。

比如说，你需要在点击某个按钮时让某个输入框获得焦点，可以通过下面的代码来实现：

~~~jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // current 属性指向了真实的 input 这个 DOM 节点，从而可以调用 focus 方法
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
~~~

可以看到 ref 这个属性提供了获得 DOM 节点的能力，并利用 useRef 保存了这个节点的应用。这样的话，一旦 input 节点被渲染到界面上，那我们通过 inputEl.current 就能访问到真实的 DOM 节点的实例了。





### useContext：定义全局状态

React 组件之间的状态传递只有一种方式，那就是通过 props。这就意味着这种传递关系只能在父子组件之间进行。

如果要进行跨层次，或者同层组件之间进行数据共享，那么就涉及到：**全局状态管理。**

为此，React提供了Context这样一个机制，能够为以某个组件开始的组件树创建一个Context。这样这个组件树上的所有组件，就都能访问和修改这个 Context 了。

在函数组件里，我们就可以使用 useContext 这样一个 Hook 来管理 Context。

~~~
  const value = useContext(MyContext);
~~~

正如刚才提到的，一个 Context 是从某个组件为根组件的组件树上可用的，所以我们需要有 API 能够创建一个 Context，这就是 React.createContext API，如下：

~~~
 const MyContext = React.createContext(initialValue);
~~~

例如一个主题的切换机制：

~~~jsx
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};
// 创建一个 Theme 的 Context

const ThemeContext = React.createContext(themes.light);

function App() {
  // 使用 state 来保存 theme 从而可以动态修改
  const [theme, setTheme] = useState("light");

  // 切换 theme 的回调函数
  const toggleTheme = useCallback(() => {
    setTheme((theme) => (theme === "light" ? "dark" : "light"));
  }, []);

  return (
    // 使用 theme state 作为当前 Context
    <ThemeContext.Provider value={themes[theme]}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <Toolbar />
    </ThemeContext.Provider>
  );
}
~~~

可以看到，Context提供了一个方便再多个组件之间共享数据的机制。

不过需要注意的是，它的灵活性也是一柄双刃剑。你或许已经发现，Context 相当于提供了一个定义 React 世界中全局变量的机制，而全局变量则意味着两点：

1. 会让调试变得困难，因为你很难跟踪某个 Context 的变化究竟是如何产生的。
2. 让组件的复用变得困难，因为一个组件如果使用了某个 Context，它就必须确保被用到的地方一定有这个 Context 的 Provider 在其父组件的路径上。

Context 更多的是**提供了一个强大的机制，让 React 应用具备定义全局的响应式数据的能力。**

很多状态管理框架，比如 Redux，正是利用了 Context 的机制来提供一种更加可控的组件之间的状态管理机制。



## 自定义Hooks

自定义Hooks在形式上其实非常简单，就是**声明一个名字以use开头的函数**，比如 useCounter。这个函数在形式上和普通的 JavaScript 函数没有任何区别，你可以传递任意参数给这个 Hook，也可以返回任何值。

但是要注意，Hooks 和普通函数在语义上是有区别的，就在于函数中有没有用到其它 Hooks。

什么意思呢？就是说如果你创建了一个 useXXX 的函数，但是内部并没有用任何其它 Hooks，那么这个函数就不是一个 Hook，而只是一个普通的函数。但是如果用了其它 Hooks ，那么它就是一个 Hook。

那么什么情况下可以使用自定义Hooks呢？

下面介绍几个典型使用场景。

### 1.抽取业务逻辑

例如在简单计数器的实现中，可以把业务逻辑提取出来成为一个Hook。

~~~jsx
import { useState, useCallback }from 'react';
 
function useCounter() {
  // 定义 count 这个 state 用于保存当前数值
  const [count, setCount] = useState(0);
  // 实现加 1 的操作
  const increment = useCallback(() => setCount(count + 1), [count]);
  // 实现减 1 的操作
  const decrement = useCallback(() => setCount(count - 1), [count]);
  // 重置计数器
  const reset = useCallback(() => setCount(0), []);
  
  // 将业务逻辑的操作 export 出去供调用者使用
  return { count, increment, decrement, reset };
}
~~~

然后在组件中使用它：

~~~jsx
import React from 'react';

function Counter() {
  // 调用自定义 Hook
  const { count, increment, decrement, reset } = useCounter();

  // 渲染 UI
  return (
    <div>
      <button onClick={decrement}> - </button>
      <p>{count}</p>
      <button onClick={increment}> + </button>
      <button onClick={reset}> reset </button>
    </div>
  );
}
~~~

在这个案例中，我们把原来在函数组件中实现的逻辑提取了出来，成为一个单独的 Hook，**一方面能让这个逻辑得到重用，另外一方面也能让代码更加语义化，并且易于理解和维护。**



### 2.监听浏览器状态：useScroll

有时我们会有以下需求：

+ 界面需要根据窗口大小变化来重新布局
+ 在页面滚动时，需要根据滚动条位置，来决定是否显示一个“返回顶部”的按钮

正如 Hooks 的字面意思是“钩子”，它带来的一大好处就是：**可以让 React 的组件绑定在任何可能的数据源上。这样当数据源发生变化时，组件能够自动刷新。**

对应到滚动条位置这个场景就是：通过在组件中使用自定义Hook useScroll 把数据源——浏览器滚动条的位置数据，绑定到组件上。

~~~jsx
import { useState, useEffect } from 'react';

// 获取横向，纵向滚动条位置
const getPosition = () => {
  return {
    x: document.body.scrollLeft,
    y: document.body.scrollTop,
  };
};
const useScroll = () => {
  // 定一个 position 这个 state 保存滚动条位置
  const [position, setPosition] = useState(getPosition());
  useEffect(() => {
    const handler = () => {
      setPosition(getPosition(document));
    };
    // 监听 scroll 事件，更新滚动条位置
    document.addEventListener("scroll", handler);
    return () => {
      // 组件销毁时，取消事件监听
      document.removeEventListener("scroll", handler);
    };
  }, []);
  return position;
};
~~~

有了这个 Hook，你就可以非常方便地监听当前浏览器窗口的滚动条位置了。比如下面的代码就展示了“返回顶部”这样一个功能的实现：

~~~jsx
import React, { useCallback } from 'react';
import useScroll from './useScroll';

function ScrollTop() {
  const { y } = useScroll();

  const goTop = useCallback(() => {
    document.body.scrollTop = 0;
  }, []);

  const style = {
    position: "fixed",
    right: "10px",
    bottom: "10px",
  };
  // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
  if (y > 300) {
    return (
      <button onClick={goTop} style={style}>
        Back to Top
      </button>
    );
  }
  // 否则不 render 任何 UI
  return null;
}
~~~

通过这个例子，我们看到了如何将浏览器状态变成可被 React 组件绑定的数据源，从而在使用上更加便捷和直观。当然，除了窗口大小、滚动条位置这些状态，还有其它一些数据也可以这样操作，比如 cookies，localStorage, URL，等等。你都可以通过这样的方法来实现。





### 3.拆分复杂组件

当某个组件功能越来越复杂的时候，组件代码很容易变得特别长，这就变得非常难维护了。

为此，要尽量采用**“保持每个函数的短小”**这样通用的最佳实践。

那么现在的关键问题就是，怎么才能让函数组件不会太过冗长呢？

做法很简单，就是尽量将相关的逻辑做成独立的 Hooks，然后在函数组中使用这些 Hooks，通过参数传递和返回值让 Hooks 之间完成交互。

这里需要注意一点，拆分逻辑的目的不一定是为了重用，而可以是仅仅为了业务逻辑的隔离。

所以在这个场景下，我们不一定要把 Hooks 放到独立的文件中，而是可以和函数组件写在一个文件中。这么做的原因就在于，这些 Hooks 是和当前函数组件紧密相关的，所以写到一起，反而更容易阅读和理解。

比如以下案例：我们需要展示一个博客文章的列表，并且有一列要显示文章的分类。同时，我们还需要提供表格过滤功能，以便能够只显示某个分类的文章。

这时候，如果按照直观的思路去实现，通常都会把逻辑都写在一个组件里，比如类似下面的代码：

~~~jsx
function BlogList() {
  // 获取文章列表...
  // 获取分类列表...
  // 组合文章数据和分类数据...
  // 根据选择的分类过滤文章...
  
  // 渲染 UI ...
}
~~~

此时我们没有意识到 Hooks 就是普通的函数，因此通常不会这么去做隔离，而是习惯于一路写下来，这就会造成某个函数组件特别长。

而**改变这个状况的关键在于开发思路的转变。我们要真正把 Hooks 就看成普通的函数，能隔离的尽量去做隔离，从而让代码更加模块化，更易于理解和维护。**比如：

~~~jsx
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { Select, Table } from "antd";
import _ from "lodash";
import useAsync from "./useAsync";

const endpoint = "https://myserver.com/api/";
const useArticles = () => {
  // 使用上面创建的 useAsync 获取文章列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/posts`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);
  // 返回语义化的数据结构
  return {
    articles: data,
    articlesLoading: loading,
    articlesError: error,
  };
};
const useCategories = () => {
  // 使用上面创建的 useAsync 获取分类列表
  const { execute, data, loading, error } = useAsync(
    useCallback(async () => {
      const res = await fetch(`${endpoint}/categories`);
      return await res.json();
    }, []),
  );
  // 执行异步调用
  useEffect(() => execute(), [execute]);

  // 返回语义化的数据结构
  return {
    categories: data,
    categoriesLoading: loading,
    categoriesError: error,
  };
};
const useCombinedArticles = (articles, categories) => {
  // 将文章数据和分类数据组合到一起
  return useMemo(() => {
    // 如果没有文章或者分类数据则返回 null
    if (!articles || !categories) return null;
    return articles.map((article) => {
      return {
        ...article,
        category: categories.find(
          (c) => String(c.id) === String(article.categoryId),
        ),
      };
    });
  }, [articles, categories]);
};
const useFilteredArticles = (articles, selectedCategory) => {
  // 实现按照分类过滤
  return useMemo(() => {
    if (!articles) return null;
    if (!selectedCategory) return articles;
    return articles.filter((article) => {
      console.log("filter: ", article.categoryId, selectedCategory);
      return String(article?.category?.name) === String(selectedCategory);
    });
  }, [articles, selectedCategory]);
};

const columns = [
  { dataIndex: "title", title: "Title" },
  { dataIndex: ["category", "name"], title: "Category" },
];

export default function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  // 获取文章列表
  const { articles, articlesError } = useArticles();
  // 获取分类列表
  const { categories, categoriesError } = useCategories();
  // 组合数据
  const combined = useCombinedArticles(articles, categories);
  // 实现过滤
  const result = useFilteredArticles(combined, selectedCategory);

  // 分类下拉框选项用于过滤
  const options = useMemo(() => {
    const arr = _.uniqBy(categories, (c) => c.name).map((c) => ({
      value: c.name,
      label: c.name,
    }));
    arr.unshift({ value: null, label: "All" });
    return arr;
  }, [categories]);

  // 如果出错，简单返回 Failed
  if (articlesError || categoriesError) return "Failed";

  // 如果没有结果，说明正在加载
  if (!result) return "Loading...";

  return (
    <div>
      <Select
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        options={options}
        style={{ width: "200px" }}
        placeholder="Select a category"
      />
      <Table dataSource={result} columns={columns} />
    </div>
  );
}
~~~











