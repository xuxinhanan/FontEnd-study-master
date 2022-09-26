> :white_check_mark: **vue 是异步更新的，因此不能直接拿到更新后的 DOM，需要通过 nextTick() 来获取。**



 `nextTick()`的逻辑很简单，把传入的回调函数 `cb` 压入 `callbacks` 数组，后续依次取出并执行。并且会根据环境检测结果来决定回调在微任务中还是宏任务中执行。优先实现为 promise.then() 中执行。



- 为什么使用 `callbacks` 而不是直接在 `nextTick` 中执行回调函数？

  原因是保证在同一个 tick 内多次执行 `nextTick`，不会开启多个异步任务，而把这些异步任务都压成一个同步任务，在下一个 tick 执行完毕。
  
- 为什么优先实现为微任务版本？

  根据 HTML Standard，在每个 “宏任务” 运行完以后，UI 都会重渲染，那么在 “微任务” 中就完成数据更新，当前 “宏任务” 结束就可以得到最新的 UI 了。如果新建一个 “宏任务” 来做数据更新，那么渲染就会进行两次。

```js
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
```