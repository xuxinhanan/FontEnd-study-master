# Redux架构思想

> Redux 的第一个哲学理念：Single source of truth. 

这里表达的是数据来源的单一。不论是Web app 简单还是复杂，我们都使用 JavaScript 对象来表述整个状态机的全部状态，并存储在 store 中，这个 store 一定是唯一的，它就是 React 组件依赖的“Single source of truth”。这个哲学理念让我们的关注点变得非常直接和简单。



> Redux 的第二个哲学理念：State is read-only. 

这里的“只读”并不是“保护一个对象不受改变 ”，而是当页面需要新的数据状态时再生成一棵全新的状态数据树，使得 `store.getState` 返回一个全新的 JavaScript 对象。

Redux 对生成一个全新的页面状态数据对象进行了拆解，它规定： 当页面需要展现新的数据状态时 ，我们只需要 dispatch （派发）一个 action （动作）即可。这个 action 其实也是一个 JavaScript 对象，就像页面状态数据树这个 JavaScript 对象描述了整个页面的状态一样， action 则描述了这个动作单元变化的所有信息。



> Redux 的第三个哲学理念：changes are made with pure functions called reducer. 

使用 reducer 数来接收 action ，并执行页面状态数据树的变更。

reducer 并不直接更改页面状态数据树，而是根据当前的页面状态数据树，结合描述改变信息的 action ，产生一棵新的页面状态数据树。

所以这个函数的处理可以抽象表达出来：

```
(previousState, action) => newState 
```



注：

1. reducer 函数的命名由来。

   Redux 源码 GitHub 仓库中：`“It’s called a reducer because it’s the type of function you would pass to Array.prototype.reduce(reducer, ?initia!Value ).” `

2. reduce 方法

   数组的 reduce 方法是一种运算合成，它通过遍历、变形、累积，将数组的所有成员“累积”为一个值。 MDN 中的描述更加直接：对累加器及数组中的每个值（从左到右）应用一个函数，以将其减少为单个值。



Redux 数据流里， reducer 在具备初始状态的情况下，每一次运算其实都是根据之前的状态（previous state ）和现有 action ( current action ）来更新 state 的，这个 state 可以理解为累加器的结果。每次 reducer 被执行时，state action 被传入，这个 state 根据 action 进行累加，进而返回最新的 state。这符合一个典型 reduce 函数的用法和思想。

![image-20220619203202267](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220619203202267.png)





# Redux 基本使用

## 1.store

store 是 Redux 最核心的概念，是 Redux 架构的根本。前面提到过 Redux 一个可预测状态的“容器”，这里所说的容器，其实就是 store 。这个容器体现了前面提到的 Redux 哲学理念，保存着整个页面状态数据树 ，并且为开发者提供了重要的 API。

```js
// store 就是一个 JavaScript 对象
store = { 
  dispatch, // 派发 action
  getState, // 获取当前页面状态数据树
  subscribe, // 订阅页面数据状态
  ……
}
```

如何创建 store 呢？

```js
import { createStore } from 'redux';
const store= createStore(reducer, preloadedState, enhancer);
// reducer 是开发者编写的 reducer 函数，必需
// preloadedState 是页面状态数据树的初始状态，可选
// enhancer 是增强器，函数类型，可选
```

reducer 参数必须存在。也就是说 创建 store 的同时必须定义好 reducer 函数，用来告知 store 数据状态如何根据 action 进行变更。

## 2.action

action 描述了状态变更的信息， 也就是需要页面做出的变化。action 本质上是 JavaScript 对象。为了清楚和统一，Redux 规定 action 对象需要有一个 type 属性，作为描述这个 action 的名称来唯一确定这 action，一般我们采用 JavaScript String 类型。另外， action 往往还需要携带一些数据信息，其中包含了这个 action 的基本内容。

**action creator**

想象这样的场景：action 携带的数据来自用户输入，每个用户都会不同的 data.book ，而我们需要的 type 皆是 READ_REDUX_BOOK，那么我们可以定义这样 action creator 函数：

```js
const learnReduxActionFactory = book => {
  type: 'READ_REDUX_BOOK',
  book
}
```

这种类似于一个工厂模式的生产工具，也算是一种非常常见的“最佳实践”。



## 3.dispatch

dispatch 来自 store 对象暴露的方法，负责派发 action，这个 action 将作为 dispatch 方法的参数。

```js
store.dispatch(action)
```



## 4.reducer

action 描述了一种变化，并携带这种变化的数据信息。真正执行这种变化并生成正确数据状态的是reducer 方法。

在执行 store.dispatch 后， Redux 会“自动”帮我们执行处理变化并更新数据的 reducer 函数。从store.dispatch 到 reducer 这个过程可以认为是由 Redux 内部处理的，但是具体的 action 及 reducer 需要开发者编写。



### 5.合理的拆分 reducer

当业务变得复杂，需要由几个或者几十个甚至更多的 action 来描述不同的变化时， reducer 函数也将变得庞大无比，在函数内部可能就要针对不同的 action 进行不同的逻辑处理。

这样一个庞大的函数，显然不能算是“最佳实践"，为了解决这个问题， Redux 提供了一个工具函数 combineReducers ，借助于它我们可以对 reducer 函数进行拆分，最后再合并为一个完整的 reducer。

```js
let finalReducer = combineReducers({reducers});
```

![image-20220620073155638](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220620073155638.png)



### **编写关键：不可变性**

在 Redux 的 reducer 一次更新过程中， 不应该直接更改原有对象或数组的值。这时就需要新创建一个新对象或数组用来承载新的数据，以保证纯函数的特性。

+ **数组操作**

  1. 增加一项

     使用 push 显然不能满足要求。可以考虑使用 concat 或者 ”...“ 展开运算符。

     ```js
     let a = [0, 1, 2];
     let b = a.concat([3]); // 使用concat
     let c = [...a, 3]; // 展开运算符
     ```

     

  2. 删除一项

     spilce 不能满足要求。可以考虑使用 slice。

     ```js
     let array = [1, 2, 3];
     const removeArrayReducer = (array, index) => {
       return [
         ...array.slice(0, index),
         ...array.slice(index + 1)
       ]
     };
     ```

  3. 更新一项

     直接操作原数组不行。可以按照前面的思路进行：

     ```js
     let array = [1, 2, 3];
     const incrementCounter = (array, index) => {
       return [
         ...array.slice(0, index),
         array[index] + 1,
         ...array.slice(index + 1)
       ]
     };
     ```

​		

+ **对象操作**

  1. 更新一项

     可以使用 ES6 带来的 Object.assign 方法或者 ”...“ 拓展运算符。

     ```js
     let item = {
       id: 0,
       book: 'Learn Redux',
       available: false
     }
     
     const setItemAvailable = function(sourceItem) ( 
       return Object.assign({}, sourceItem, {
         available: true //  使用 Object.assign 方法更新一项
       });
     }
     
     const setItemAlreadyLearned = function(sourceItem) { 
       return {
         ...sourceItem, 
         available: true // 使用 "..." 拓展运算符更新一项
       };
     }
     ```

  2. 增加一项

     可以按照上面的思路进行，使用 Object.assign 方法或者 ”...“ 拓展运算符。

  3. 删除一项

     可以使用 Object.keys 及 reduce 方法，对除需要删除的属性以外的所有属性进行累加拷贝 。

     ```js
     let item = {
       id: 0,
       book: 'Learn Redux',
       available: false,
       note: 13
     }
     
     let newItem = Object.keys(item).reduce((prev, curr) => {
       if (key !== 'note') {
         return {...prev, [key]: item[key]};
       }
       return prev;
     }, {})
     ```

  

+ **多层引用**

  对于多层引用来说，经常会产生一些无法意识到的副作用。比如：

  ~~~js
  const a = [{ val: 1 }]
  const b = a.map(item => item.val = 2)
  
  // 期望：b 的每一个元素的 val 值变为 2，但最终 a 里面每个元素的 val 也变为了 2
  console.log(a[0].val) // 2
  ~~~

  ```js
  let data = { 
    iteml: { 
      id: 0, 
      book: 'Learn Reduxl',
      available: false
  	}
  }
  
  let newData = Object.assign({}, data); // 浅拷贝
  newData.iteml.available = true;
  
  console.log(data teml available); // true， 可以发现原始值被改变了
  ```

  一般来说，我们可以“...”拓展运算符来断开一层引用，简单地实现不可变数据的操作，例如：

  ~~~jsx
  var a = [{ val: 1 }]
  var b = a.map(item => ({ ...item, val: 2 }))
  
  console.log(a[0].val) // 1
  console.log(b[0].val) // 2
  ~~~

  **这在大多数场景下已经足够使用。**但是因为只能断掉一层引用，所以仍然存在风险，比如：

  ~~~js
  // 深层次的对象嵌套，这里 a 里面的元素对象下又嵌套了一个 desc 对象
  var a = [{
      val: 1,
      desc: { text: 'a' }
    }]
  var b = a.map(item => ({ ...item, val: 2 }))
  
  console.log(a[0].desc === b[0].desc) // true
  
  b[0].desc.text = 'b';          // 改变 b 中对象元素对象下的内容
  console.log(a[0].desc.text);   // b （a 中元素的值无意中被改变了）
  ~~~

  这时，我们可以考虑“深拷贝”来避免上面遇到的问题。

  然而''深拷贝''这种方式相对来说开销太大（因为他相当于完全创建了一个新的对象出来，有时候有些 value 我们不会进行赋值操作，所以即使保持引用也没关系）。

  这种情况下，可以通过一些第三方的库来帮助我们操作不可变数据，比如 Immutable、Immer 等等。

  需要注意的是，如果 JavaScript 的 slice filter map reduce 等函数式 API ，再结合 ES6 新特性己经完全可以满足开发要求，那么就没必要再使用类似于 immer.js 类库了，因为这会增加一定的复杂度和学习成本。

​	



## 6.中间件

到目前为止，我们已经掌握了 Redux 的基本用法。但是在实际开发中，需求往往复杂多样，为此 Redux 提供了一套中间件机制。

简单来说，中间件机制可以让你使用一个拦截器在 reducer 处理 action 之前被调用。在这个拦截器中，你可以自由处理获得的 action。无论是把这个 action 直接传递给 reducer，或者构建新的 action 发送到 reducer，都是可以的。

![img](https://static001.geekbang.org/resource/image/b4/3a/b438a3e944c5f15911637868e78cd13a.png?wh=1042*210)

Redux 本身提供了 applyMiddleware 方法用来接入中间件。

```js
const store= createStore(reducer, preloadedState, enhancer);
```

我们可以在 enhancer 参数的位置接入中间件。



## 7.异步逻辑

想象一下，在 Redux 架构下如何处理异步场景呢？

首先来看发送请求获取数据这样一个异步的场景中涉及到Store数据的变化：

1. 请求发送出去时：设置 state.pending = true，用于 UI 显示加载中的状态；
2. 请求响应成功时：设置 state.pending = false，state.data = result。取消 UI 的加载状态，同时将获取的数据放到 store 中用于 UI 的显示；
3. 请求发送失败时：设置 state.pending = false，state.error = error。取消 UI 的加载状态，同时设置错误的状态，用于 UI 显示错误的内容。

因为在 Redux 中，任何对 Store 的修改都是由 action 完成的。因此对于一个异步请求，需要三个 action才能完成。代码逻辑类似如下：

~~~jsx
function DataList() {
  const dispatch = useDispatch();
  // 在组件初次加载时发起请求
  useEffect(() => {
    // 请求发送时
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      // 请求成功时
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      // 请求失败时
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }, []);
  
  // 绑定到 state 的变化
  const data = useSelector(state => state.data);
  const pending = useSelector(state => state.pending);
  const error = useSelector(state => state.error);
  
  // 根据 state 显示不同的状态
  if (error) return 'Error.';
  if (pending) return 'Loading...';
  return <Table data={data} />;
}
~~~

从上面案例不难看出，发送请求获取数据并进行错误处理这个逻辑是不可重用的。假设我们希望在另外一个组件中也能发送同样的请求，就不得不将这段代码重新实现一遍。

那么该怎么做呢？设想一下：如果 dispatch 可以接收一个函数作为参数，在函数体内进行异步操作，并在异步完成后再派发相应的 action，那么便能解决问题了。

这就是 redux-thunk 中间件能解决的问题。**它会进行逻辑判断，如果发现接受到的 action 是一个函数，那么就会执行这个函数，**并把 dispatch 作为参数传给这个函数，从而在这个函数中你可以自由决定何时，如何发送 Action。

![dispatch(action)](C:\Users\64554\Desktop\自动化设置响应式对象\dispatch(action).png)

现在我们利用 redux-thunk 这个中间件来解决异步问题：

~~~jsx
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'

const composedEnhancer = applyMiddleware(thunkMiddleware)
const store = createStore(rootReducer, composedEnhancer)
~~~

~~~jsx
import fetchData from './fetchData';

function DataList() {
  const dispatch = useDispatch();
  // dispatch 了一个函数由 redux-thunk 中间件去执行
  dispatch(fetchData());
}
~~~

~~~jsx
function fetchData() {
  return dispatch => {
    dispatch({ type: 'FETCH_DATA_BEGIN' });
    fetch('/some-url').then(res => {
      dispatch({ type: 'FETCH_DATA_SUCCESS', data: res });
    }).catch(err => {
      dispatch({ type: 'FETCH_DATA_FAILURE', error: err });
    })
  }
}
~~~

可以看到，通过这种方式，我们就实现了异步请求逻辑的重用。





## 8.总结

现在我们来对 Redux 的使用做一个简单的总结。一般使用 Redux 时，我们将整体思路细化为以下几个部分：

+ 确定应用所需的 state
+ 根据交互和业务需求，分析确定 action
+ 根据不同的 action，完成 reducer 函数的编写
+ 根据 reducer 等，创建 store
+ 订阅数据更新，完成视图渲染





# React-Redux库

在 React 应用中使用 Redux，需要获取页面状态数据，并向下进行派发。

然后当页面数据状态得以更新之后，如何促使页面发生 UI 更新呢？实际上就需要使用 store.subscribe（callbackFuncrion）方法订阅数据的更新，并 callbackFunction 完成 UI 更新。在回调逻辑中，使用store.getState() 获取最新数据，完成正确的页面响应。

不过这一部分已经由 react-redux 库进行了封装，这也是 store 数据更新后便可以直接触发相关组件重新渲染的原因。

~~~jsx
import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'

import App from './App'

const rootElement = document.getElementById('root')
ReactDOM.render(
  /* 利用了 React 的 Context 机制把 store 直接集成到 React 应用的顶层 props */
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
~~~

完成了这样的配置之后，在函数组件中使用 Redux 就非常简单了：利用 react-redux 提供的 useSelector 和 useDispatch 这两个 Hooks。

+ useSelector： 从 redux 的 store 对象中提取数据(state)。

  ~~~jsx
  const result: any = useSelector(selector: Function, equalityFn?: Function)
  ~~~

  其中选择器函数以整个 store 的 state 作为入参。

+ useDispatch：在组件中拿到 dispatch，并用来派发 action。

## 示例

以计数器为例，来看如何在React中使用Redux：

~~~jsx
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export function Counter() {
  // 从 state 中获取当前的计数值
  const count = useSelector(state => state.value)

  // 获得当前 store 的 dispatch 方法
  const dispatch = useDispatch()

  // 在按钮的 click 时间中去分发 action 来修改 store
  return (
    <div>
      <button
        onClick={() => dispatch({ type: 'counter/incremented' })}
        >+</button>
      <span>{count}</span>
      <button
        onClick={() => dispatch({ type: 'counter/decremented' })}
        >-</button>
    </div>
  )
}
~~~

同时通过以上案例，我们也可以看到使用Redux的单向数据流：

<img src="https://static001.geekbang.org/resource/image/b6/e0/b6991fd03d27ee987b1cd29ae16552e0.png?wh=752*412" alt="img" style="zoom:50%;" />











# Immer库

## Immer的使用

Immer 可以让我们以更方便的方式使用不可变状态。使用方式如下：

~~~tsx
produce(currentState, recipe: (draftState) => void): nextState
~~~

把所有具有副作用的逻辑放在传入 produce 的第二个参数内部，这样对原来数据的任何操作都不会对原数据产生影响。

~~~js
const produce = require('immer')
const state = {
  done: false,
  val: 'string',
}
// 所有具有副作用的操作，都可以放入 produce 函数的第二个参数内进行
// 最终返回的结果并不影响原来的数据
const newState = produce(state, (draft) => {
  draft.done = true
})
console.log(state.done)    // false
console.log(newState.done) // true
~~~





## Immer的原理

immer 通过设置 proxy 对象来劫持数据并实现自定义行为。

首先在内部维护了一份 state，并定义getter、setter，在内部判断是否有变化从而决定最终返回值。

~~~js
class Store {
  constructor(state) {
    this.modified = false
    this.source = state
    this.copy = null
  }
  get(key) {
    if (!this.modified) return this.source[key]
    return this.copy[key]
  }
  set(key, value) {
    if (!this.modified) this.modifing()
    return this.copy[key] = value
  }
  modifing() {
    if (this.modified) return
    this.modified = true
    // 这里使用原生的 API 实现一层 immutable，
    // 数组使用 slice 则会创建一个新数组。对象则使用解构
    this.copy = Array.isArray(this.source)
      ? this.source.slice()
    : { ...this.source }
  }
}
~~~

对于 proxy 第二个参数的自定义行为，我们只需简单做一层转发：

~~~js
// flag 的目的就在于将来从 proxy 对象中获取 store 实例更加方便
const PROXY_FLAG = '@@SYMBOL_PROXY_FLAG'
const handler = {
  get(target, key) {
    // 如果遇到了这个 flag 我们直接返回我们操作的 target
    if (key === PROXY_FLAG) return target
    return target.get(key)
  },
  set(target, key, value) {
    return target.set(key, value)
  },
}
~~~

最终我们可以完成这个 produce 函数，创建 store 实例后创建 proxy 实例，并把 proxy 实例传给我们传入的对 immutable 数据的操作内容 producer 中。因此，实际上我们操作的都是 proxy 实例。

~~~js
function produce(state, producer) {
  const store = new Store(state)
  const proxy = new Proxy(store, handler)

  // 执行我们传入的 producer 函数，我们实际操作的都是 proxy 实例，所有有副作用的操作都会在 proxy 内部进行判断，是否最终要对 store 进行改动。
  producer(proxy)

  // 处理完成之后，通过 flag 拿到 store 实例
  const newState = proxy[PROXY_FLAG]
  if (newState.modified) return newState.copy
  return newState.source
}
~~~





# Redux源码

## createStore：创建store

~~~js
function createStore(reducer, preloadedState, enhancer) {
  if(enhancer是有效的){  // 应用中间件
    return enhancer(createStore)(reducer, preloadedState)
  } 

  let currentReducer = reducer // 当前store中的reducer
  let currentState = preloadedState // 当前store中存储的状态
  let currentListeners = [] // 回调函数，处理页面组件重新渲染的逻辑
  let nextListeners = currentListeners // 下一次dispatch时的监听函数

  //...

  // 获取state
  function getState() {
    //...
  }

  // 添加一个监听函数，每当dispatch被调用的时候都会执行这个监听函数
  function subscribe() {
    //...
  }

  // 触发了一个action，因此我们调用reducer，得到的新的state，并且执行所有添加到store中的监听函数。
  function dispatch() {
    //...
  }

  //...


  const store = {
    dispatch,
    subscribe,
    getState,
    // 下面两个是主要面向库开发者的方法，暂时先忽略
    // replaceReducer,
    // observable
  } 

  return store
}
~~~

从上面可以看到 createStore 函数的基本雏形。接下来，继续看每一个对外暴露的方法的实现，**实际上就是设计模式中的发布订阅模式的简易实现。**

我们使用 listeners 数组来存储订阅回调函数（观察者），这些回调函数用来处理页面组件重新渲染的逻辑。dispatch 方法需要触发 reducer 函数的执行（Subject 发出事件），进而触发回调函数（观察者更新）。

<img src="C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220620100745699.png" alt="image-20220620100745699" style="zoom:50%;" />

## getState：获取state

~~~js
function getState() {
  return currentState
}
~~~

最简单的state的getter方法。



## subscribe：添加监听器

~~~js
function subscribe(listener) {
  // 添加回调
  nextListeners.push(listener)

  let isSubscribe = true //设置一个标志，标志该监听器已经订阅了
  // 返回取消订阅的函数，即从数组中删除该监听函数
  return function unsubscribe() {
    if(!isSubscribe) {
      return 
    }

    isSubscribe = false
    // 从下一轮的监听函数数组中删除这个监听回调
    const index = nextListeners.indexOf(listener)
    nextListeners.splice(index, 1)
  }
}
~~~

调用subscribe，添加回调函数。并返回的是一个取消订阅的方法。

取消订阅是非常必要的，当添加的监听器没用了之后，应该从store中清理掉。不然每次dispatch都会调用这个没用的监听器。



## dispatch：管理store的state

~~~js
function dispatch(action) {
  //调用 reducer，得到新state
  currentState = currentReducer(currentState, action);

  //更新监听数组
  currentListener = nextListener;
  //调用监听数组中的所有监听函数，用来处理页面组件重新渲染的逻辑
  for(let i = 0; i < currentListener.length; i++) {
    const listener = currentListener[i];
    listener();
  }
}
~~~

接收 action 并调用 Store 中的 reducer 得到的新的 state，并且执行所有添加到 store 中的监听函数。







## combineReducers：合并reducer

前面我们介绍了 combineReducers 方法，它实现了接收多个 reducer 函数，并进行整合，归一化成一个 rootReducer。使用 combineReducers 的好处很明显，开发者可以按照应用状态进行分泊，拆分成多个reducers ，有利于开发和维护。

首先思考下，combineReducers 返回的函数就是一个标准的 reducer，它的参数接收 state 和 action，因此有如下框架：

```js
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    ...
  }
  }
```

然后，我们继续思考 combineReducers 返回的函数的返回值应该是什么？combineReducers 返回的函数是归一化的 rootReducer ，其返回值是经过各个 reducers 计算后的全新页面数据状态，即更新之后的 state。

并且，为了获得参数 state，即所有 reducer 的计算结果，我们使用 Object.keys 对参数 reducers 进行遍历， 返回由参数 reducers 得所有 key 所组成的一个数组。这样我们就可以根据数组的每一项进行 state 的计算。

考虑到最终的返回结果应该是完整 state ，因此需要使用数组的 reduce 方法对 state 进行计算并累加。

在这种情况下，使用一个空对象作为 reduce 方法的计算初始值。于是有了如下函数式实现：

```js
// 函数式实现
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    return Object.keys(reducers).reduce(
      (nextState, key) => {
        nextState[key] = reducers[key](
          state[key],
          action
        );
        return nextState;
      }, {})
  }
}
```

为了方便理解，这里将 reduce 循环计算最终完整 state 的过程展示出来：

| 第几轮循环 | **nextState的值**                                            | **key的值** | **返回的值**                                              |
| ---------- | ------------------------------------------------------------ | ----------- | --------------------------------------------------------- |
| 第一轮循环 | { }                                                          | reducerKey1 | { reducerKey1:  `reducers[key]() `}                       |
| 第二轮循环 | { reducerKey1:  `reducers[reducerKey1]() `}<br />即 nextState | reducerKey2 | { ...nextState，reducerKey2:  `reducers[reducerKey2]() `} |
| 第三轮循环 | ...                                                          | ...         | ...                                                       |



Redu 源码的实现与上述类似 ，但是采用了 for 循环来代替 reduce 遍历：

~~~js
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {} 

  // 从reducers中筛选出有效的reducer
  for(let i = 0; i < reducerKeys.length; i++){
    const key  = reducerKeys[i]

    if(typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key] 
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  // 检查finalReducer中的reducer接受一个初始action或一个未知的action时，是否依旧能够返回有效的值
  let shapeAssertionError
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  // 返回合并后的reducer
  return function combination(state= {}, action){
    let hasChanged = false // 标志state是否有变化
    let nextState = {}
    for(let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      // 得到本次循环的子reducer
      const reducer = finalReducers[key]
      // 得到该子reducer对应的旧状态
      const previousStateForKey = state[key]
      // 调用子reducer得到新状态
      const nextStateForKey = reducer(previousStateForKey, action)
      // 存到nextState中
      nextState[key] = nextStateForKey
      // 边界情况：
      // 如果子reducer不能处理该action，那么会返回previousStateForKey
      // 也就是旧状态，当所有状态都没改变时，我们直接返回之前的state就可以了
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey
    }
    return hasChanged ? nextState : state
  }
} 
~~~







## applyMiddleware：使用中间件

回顾 createStore() 方法：

~~~js
function createStore(reducer, preloadedState, enhancer) {
  if(enhancer是有效的){  
    return enhancer(createStore)(reducer, preloadedState)
  } 
    
  //...
}
~~~

在这里，我们可以看到，enhancer 是一个函数，这个函数接受一个普通的 createStore 函数作为参数。

通过 redux 提供的 applyMiddleware ，我们可以获得 enhancer。

顾名思义， applyMiddleware 就是对各个需要应用的中间件进行糅合。现在来看看 applyMiddleware 是如何实现的。

~~~js
export default function applyMiddleware(...middlewares){
  // applyMiddleware 会返回一个函数，这个函数接收了一个 createStore 参数
  return createStore => {
    const store = createStore(reducer, preloadedState)
    
    // rniddlewareAPI 是第三方中间件需要使用的参数
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    
    // 中间件也是一个高度柯里化的函数，它接收 middlewareAPI 数后的第一层返回结果，并存储到 chain 数组中
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
	
    // chain 数组中的每一项都是对原始 dispatch 的增强，最后返回的 dispatch 函数就是增强后的 dispatch 
    dispatch = compose(...chain)(store.dispatch)
    
    return {
      ...store,
      dispatch
    }
  }
}
~~~



对于 `createStore` 代码， `applyMiddleware` 作为一个三级柯里化的函数，它的执行相当于：

```js
applyMiddleware(...middlewares)(createStore)(reducer, preloadedState)
```

这样做的目的是借用原始的 createStore ，创建一个新的增强版 store。



compose 方法就是把多个中间件串联起来，就像：

```js
middlewareA (middlewareB(middlewareC(store.dispatch)))
```

compose 的具体内容参考函数式编程。



总结一下，applyMiddleware的工作方式是：

1. 调用中间件函数，获取改造函数
2. 把所有改造函数compose成一个改造函数
3. 改造dispatch方法
4. 返回增强后的store和改造后的dispatch





# React-thunk源码

~~~js
function createThunkMiddleware(extraArgument) {
    
    return function({ dispatch, getState }) { // 这是「中间件函数」
        
        return function(next) { // 这是中间件函数创建的「改造函数」
            //参数next是被当前中间件改造前的dispatch
            //因为在被当前中间件改造之前，可能已经被其他中间件改造过了，所以不妨叫next
            
            return function(action) { // 这是改造函数「改造后的dispatch方法」
                if (typeof action === 'function') {
                  //如果action是一个函数，就调用这个函数，并传入参数给函数使用
                  return action(dispatch, getState, extraArgument);
                }
                
                //否则调用用改造前的dispatch方法
                return next(action);
            }
        } 
    }
}
~~~

进行逻辑判断，如果发现接受到的 action 是一个函数，那么就会执行这个函数，否则直接dispatch(action)。



## 写中间件的套路

对以上`applyMiddleware`和`React-thunk`的原理了解之后，自己开发一个中间件也非常简单。事实上，得益于 `Redux`设计思想，所有中间件的编写都是“固定套路”的。

```js
const customMiddleware = store => next => action => {
  // ...
}
```

我们可以应用中间件编写模式，完成一个全新的中间件的开发。设想这样一个场景：应用存在多套主题皮肤可供用户选择切换。这些皮肤在一定时间内往往都是有固定样式的，在初始化整个应用时，使用一套默认的主题皮肤。在用户切换主题的情况下，我们希望用户离开应用后，下次再访问此应用时，仍然可以直接切入上一次切换后的主题，而不是默认主题。

切换一套主题皮肤的 action 如下：

```js
store.dispatch({ 
  type: 'CHANGE_THEME', 
  payload: 'light'
});
```

那么，可以这样定义一个 CHANGE_THEME 中间件：

```js
const CHANGE_THEME = store => next => action => { 
  // 拦截目标 action
  if (action.type === 'CHANGE_THEME') { 
    if (localStorage.getItem('theme') !== action.payload) { 
      localStorage.setItem('theme', action.payload) 
    }
  }
  return next(action);
}
```

在应用这个中间件的情况下，业务的初始化脚本如下：

```js
store.dispatch({ 
  type: 'CHANGE_THEME', 
  payload: localStorage.getItem('theme') || 'dark'
});
```

用户第一次进入应用时，因为无法通过 `localStorage.getltem("theme") `获取先前的主题皮肤，所以 payload 默认为 dark 。当派发 ‘CHANGE_THEME' action 之后，被 CHANGE_THEME 中间件拦截，并设置相应的主题皮肤。





# React-Redux源码

## Provider

react-redux 提供了 Provider 组件，它的作用是让业务组件获得 store 信息。那么， Provider 组件作为 App 组件的父组件，是如何将 store 传递 App 组件的呢？秘密就在于 React 的高级特性——context。

context 用来使 React 子孙组件可以直接“越级” 获取父组件的信息。

~~~js
function Provider({ store, context, children }) {
   /* 利用useMemo，跟据store变化创建出一个contextValue 包含一个根元素订阅器和当前store  */ 
  const contextValue = useMemo(() => {
      /* 创建了一个根 Subscription 订阅器 */
    const subscription = new Subscription(store)
    /* subscription 的 notifyNestedSubs 方法 ，赋值给  onStateChange 方法 */
    subscription.onStateChange = subscription.notifyNestedSubs  
    return {
      store,
      subscription
    } /*  store 改变创建新的contextValue */
  }, [store])
  /*  获取更新之前的state值 ，函数组件里面的上下文要优先于组件更新渲染  */
  const previousState = useMemo(() => store.getState(), [store])

  useEffect(() => {
    const { subscription } = contextValue
    /* 触发trySubscribe方法执行，创建listens */
    subscription.trySubscribe() // 发起订阅
    if (previousState !== store.getState()) {
        /* 组件更新渲染之后，如果此时state发生改变，那么立即触发 subscription.notifyNestedSubs 方法  */
      subscription.notifyNestedSubs() 
    }
    /*   */
    return () => {
      subscription.tryUnsubscribe()  // 卸载订阅
      subscription.onStateChange = null
    }
    /*  contextValue state 改变出发新的 effect */
  }, [contextValue, previousState])

  const Context = context || ReactReduxContext
  /*  context 存在用跟元素传进来的context ，如果不存在 createContext创建一个context  ，这里的ReactReduxContext就是由createContext创建出的context */
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
~~~

Provider实际做的事情：

1 首先创建一个 contextValue ，里面包含一个创建出来的父级 Subscription (订阅器)和redux提供的store。
2 通过react上下文context把 contextValue 传递给子孙组件。





## createSubscription

~~~tsx
export function createSubscription(store: any, parentSub?: Subscription) {
  let unsubscribe: VoidFunc | undefined
  let listeners: ListenerCollection = nullListeners

  /* 负责检测是否该组件订阅，然后添加订阅者也就是listener */
  function addNestedSub(listener: () => void) {
    trySubscribe()
    return listeners.subscribe(listener)
  }
  
  /* 向listeners发布通知 */
  function notifyNestedSubs() {
    listeners.notify()
  }
  
   /* 对于 provide onStateChange 就是 notifyNestedSubs 方法，对于 connect 包裹接受更新的组件 ，onStateChange 就是 负责更新组件的函数 。   */
  function handleChangeWrapper() {
    if (subscription.onStateChange) {
      subscription.onStateChange()
    }
  }

  /* 判断有没有开启订阅 */
  function isSubscribed() {
    return Boolean(unsubscribe)
  }

  /* 开启订阅模式 首先判断当前订阅器有没有父级订阅器 ， 如果有父级订阅器(就是父级Subscription)，把自己的handleChangeWrapper放入到监听者链表中 */
  function trySubscribe() {
    if (!unsubscribe) {
      unsubscribe = parentSub
        ? parentSub.addNestedSub(handleChangeWrapper)
        : store.subscribe(handleChangeWrapper)

      listeners = createListenerCollection()
    }
  }

  /* 取消订阅 */
  function tryUnsubscribe() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = undefined
      listeners.clear()
      listeners = nullListeners
    }
  }

  const subscription: Subscription = {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: () => listeners,
  }

  return subscription
}

~~~



## useSelector

~~~tsx
 return function useSelector<TState, Selected extends unknown>(
    selector: (state: TState) => Selected,
    equalityFn: EqualityFn<Selected> = refEquality
  ): Selected {
    const { store, subscription, getServerState } = useReduxContext()!

    const selectedState = useSyncExternalStoreWithSelector(
      subscription.addNestedSub,
      store.getState,
      getServerState || store.getState,
      selector,
      equalityFn
    )

    useDebugValue(selectedState)

    return selectedState
  }
~~~

