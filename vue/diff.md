### diff算法

当新旧 vnode 的子节点都是一组节点时，为了以最小的性能开销完成（**即尽可能少的操作DOM**）更新操作，需要比较两组子节点，比较两组子节点所用的算法就是 diff 算法。

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



# 序

为什么需要 diff ? 

复用 DOM 比直接替换（移除旧 DOM，创建新 DOM ）性能好的多。

diff 原则？

原地复用 > 移动后复用 >> 暴力替换



# vue2——双端diff算法

**原理：首先进行首尾对比，这样找到的一定是性能最优，即原地复用 DOM 节点，不需要移动。首尾对比完交叉对比。然后对剩余结点对比寻找可复用 DOM，为了快速对比，于是创建一个 map 记录 key，然后通过 key 查找旧的 DOM，时间复杂度为O(1)。**

具体来说就是新旧 VNode 节点的左右头尾两侧都有一个指针，用来遍历对比新旧 VNode 列表。

<img src="https://camo.githubusercontent.com/25512af67dc2d9ffbacc876598509eb77b804572d045805c0195555038dd511d/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32382f353961343031356262323736352e706e67" alt="img" style="zoom:50%;" />

1. 当新老 VNode 节点的 start 或者 end 满足同一节点时，将该 vnode 对应的真实 DOM 进行 patch 即可。

   <img src="https://camo.githubusercontent.com/c5be36bb8b6bff3a09200eefe210b3cf2332f236f3ff30048fde9de1f51773b4/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32382f353961343063313263313635352e706e67" alt="img" style="zoom:50%;" />

   ~~~js
   else if (sameVnode(oldStartVnode, newStartVnode)) {
     patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
     oldStartVnode = oldCh[++oldStartIdx]
     newStartVnode = newCh[++newStartIdx]
   } else if (sameVnode(oldEndVnode, newEndVnode)) {
     patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
     oldEndVnode = oldCh[--oldEndIdx]
     newEndVnode = newCh[--newEndIdx]
   }
   ~~~

2. 如果直接对比不符合，那么进行交错对比，即 oldStart 与 newEnd，oldEnd 与 newStart。对比发现是同一个节点的话，进行 patch 并且将该 VNode 对应的真实 DOM 移动到正确的位置。

   <img src="https://camo.githubusercontent.com/f20fc12ad620ef93d5b442c88d8ba1f80f1a0ff5c79beb60ffa578eefaea8bc9/68747470733a2f2f6f6f6f2e306f302e6f6f6f2f323031372f30382f32382f353961343231343738343937392e706e67" alt="img" style="zoom: 33%;" />

   <img src="https://camo.githubusercontent.com/8735f850e213c66aa23f3d026bd4075613213c489d8d7ab33fdbfde08574fe4f/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961346337303638356431322e706e67" alt="img" style="zoom: 50%;" />

   ~~~js
   lse if (sameVnode(oldStartVnode, newEndVnode)) {
     // 移动之前先进行patch打补丁
     patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
     // 以 oldStartVnode 为锚点，通过 insertBefore 移动真实 DOM
     canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
     // 移动指针，后续继续比较
     oldStartVnode = oldCh[++oldStartIdx]
     newEndVnode = newCh[--newEndIdx]
   } else if (sameVnode(oldEndVnode, newStartVnode)) {
     // 移动之前先进行patch打补丁
     patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
     // 以 oldEndVnode 为锚点，通过 insertBefore 移动真实 DOM
     canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
     oldEndVnode = oldCh[--oldEndIdx]
     newStartVnode = newCh[++newStartIdx]
   }
   ~~~

   

3. 经过以上步骤处理完双端后，对剩余节点的处理原则是：尽量寻找可复用的 DOM 节点。

   这样做比简单的创建新节点、移除旧节点性能好的多。

   因此接下来的目标是寻找可复用的节点，并移动到正确的位置，然后在不存在可复用节点时新增节点。

   为了得到更优的时间复杂度，创建一个`{ key: oldVnode }`的映射表（oldKeyToIdx）来方便查找（查找时间复杂度是 O（1），即以空间换时间）。

   然后从这个映射表中查找旧 vnode 列表是否存在可复用的节点，如果有，进行 patch 并且将该 VNode 对应的真实 DOM 移动到正确的位置。否则，新建一个节点。

   <img src="https://camo.githubusercontent.com/c9520d25ba2f2a2beba98d80d274c244c6879959800d923ed40378381bcd302b/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961346437353532643239392e706e67" alt="img" style="zoom:50%;" />

   ~~~js
   else {
     // 创建一个 { key: oldVnode } 的映射表
     if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
     // 查找这个表，如果 newStartVnode 中有 key，则直接去映射表中查；否则通过 findIdxInOld 查
     idxInOld = isDef(newStartVnode.key)
       ? oldKeyToIdx[newStartVnode.key]
       : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
     if (isUndef(idxInOld)) {
       // 如果没找到，那么新建节点
       createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
     } else {
       vnodeToMove = oldCh[idxInOld]
       // 相同节点的话
       if (sameVnode(vnodeToMove, newStartVnode)) {
         // 进行patch
         patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
         // 因为该位置对应的节点处理完毕，因此，将该位置设置为 undefined，后续指针遍历进来后可以直接跳过遍历下一个
         oldCh[idxInOld] = undefined
         // 后移动对应的真实DOM
         canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
       } else {
         // 不是相同节点的话，那么需要新建节点
         createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
       }
     }
     newStartVnode = newCh[++newStartIdx]
   }
   ~~~

   

4. 接下来等diff主流程结束后，进行善后动作，即移除多余的节点或者新增节点。

   <img src="https://camo.githubusercontent.com/e353d3ab573edbb6b9c6c777094f87f9bcd6bf746ebedb8b476b819c0f2ab3e7/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961353039663064313738382e706e67" alt="img" style="zoom:50%;" />

   <img src="https://camo.githubusercontent.com/fce894a85bba4a74939f30c602bae42deb0d9e34342c7786f2eac9da58c767b1/68747470733a2f2f692e6c6f6c692e6e65742f323031372f30382f32392f353961346633383962393863622e706e67" alt="img" style="zoom:50%;" />

   ~~~js
   // 按照算法处理完旧节点列表中最后一个节点（oldStartIdx === oldEndIdx）后，要么 oldStartIdx++，要么 oldEndIdx--，因此此时会出现 oldStartIdx > oldEndIdx
   if (oldStartIdx > oldEndIdx) {
     refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
     addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
   // // 按照算法处理完新节点列表中最后一个节点（newStartIdx === newEndIdx）后，要么 newStartIdx++，要么 newEndIdx--，因此此时会出现 newStartIdx > newEndIdx
   } else if (newStartIdx > newEndIdx) {
     removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
   }
   ~~~





## **完整源码**

~~~js
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
  let oldStartIdx = 0
  let newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx, idxInOld, vnodeToMove, refElm

  // removeOnly is a special flag used only by <transition-group>
  // to ensure removed elements stay in correct relative positions
  // during leaving transitions
  const canMove = !removeOnly

  if (process.env.NODE_ENV !== 'production') {
    checkDuplicateKeys(newCh)
  }

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (isUndef(oldStartVnode)) {
      oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
    } else if (isUndef(oldEndVnode)) {
      oldEndVnode = oldCh[--oldEndIdx]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
      patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
      patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
      canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
      idxInOld = isDef(newStartVnode.key)
        ? oldKeyToIdx[newStartVnode.key]
        : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
      if (isUndef(idxInOld)) { // New element
        createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
      } else {
        vnodeToMove = oldCh[idxInOld]
        if (sameVnode(vnodeToMove, newStartVnode)) {
          patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
          oldCh[idxInOld] = undefined
          canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
        } else {
          // same key but different element. treat as new element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        }
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  if (oldStartIdx > oldEndIdx) {
    refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
~~~





# 快速diff算法前置知识

[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)

![image-20220521153925256](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220521153925256.png)

[1]: https://leetcode.cn/problems/longest-increasing-subsequence/solution/dong-tai-gui-hua-er-fen-cha-zhao-tan-xin-suan-fa-p/	"贪心+二分查找"





# vue3——快速diff算法

原理：首先进行首尾对比，这样找到的一定是性能最优，即原地复用 DOM 节点，不需要移动。然后创建一个新节点在旧的 dom 中的位置的映射表，这个映射表中不为空的元素即可复用。然后计算出最长递增子序列，这个序列中的结点代表可复用且原地不需要移位。然后移动剩下的新结点到正确的位置即递增序列的间隙中。(可能是移动也可能是新建)

## 1.头部节点对比

~~~js
// i为遍历新 vnode 列表的指针, el: 旧 vnode 的尾部索引, e2: 新 vnode 尾部索引
while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = (c2[i] = optimized
                ? cloneIfMounted(c2[i] as VNode)
                : normalizeVNode(c2[i]))
    // 如果节点相同, 那么 patch
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
        break // 节点不同，直接跳出循环
    }
    i++ // 到这里表示走的是节点相同的逻辑，那么头部索引后移，继续比较剩余节点
}
~~~



## 2.尾部节点对比

~~~js
while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = (c2[e2] = optimized
                ? cloneIfMounted(c2[e2] as VNode)
                : normalizeVNode(c2[e2]))
    // 如果节点相同, 那么 patch
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
        break // 节点不同，直接跳出循环
    }
    e1-- // 到这里表示走的是节点相同的逻辑，那么尾部索引前移，继续比较剩余节点
    e2--
}
~~~



### 是否需要新增节点

头尾处理完毕后，理想的情况是新、旧节点列表中有一方已经遍历完毕。那么首先判断是否需要新增节点

~~~js
// el 是旧节点的尾索引，当 i > e1 时，说明经过前面步骤的处理，所有的旧节点都处理完毕，没有可以复用的 DOM 了，那么考虑是否需要新增节点
if (i > e1) {
    // 此时如果 i <= e2，那么说明新节点中仍然有未被处理的节点，需要新增。
    if (i <= e2) {
        // 锚点的索引
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
~~~



### 是否需要移除节点

~~~js
// i > e2 表示新节点列表已经处理完毕
else if (i > e2) {
    // 此时，如果 i <= e1，那么表示旧节点列表有多余元素，需要移除相应的真实 DOM
    while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true)
        i++
    }
}
~~~

## 3.剩余节点中寻找可复用节点

当新、旧节点列表都有剩余元素，那么需要判断剩余节点中是否存在可复用节点，并判断是否需要进行 DOM 移动操作。

### 寻找可复用节点

为此，创建`newIndexToOldIndexMap`数组，用来存储新节点数组中的剩余节点在旧节点数组上的索引，后面将使用它计算出一个最长递增子序列。并初始化数组。

~~~js
const newIndexToOldIndexMap = new Array(toBePatched)
// 相当于 newIndexToOldIndexMap.fill(0);
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
~~~

然后遍历旧节点数组，寻找可复用节点并填充`newIndexToOldIndexMap`数组。

~~~js
for (i = s1; i <= e1; i++) {
    const prevChild = c1[i]
    
    let newIndex
    if (prevChild.key != null) {
        // 查找可复用节点的在新节点列表中的索引
        newIndex = keyToNewIndexMap.get(prevChild.key)
    } 
	// 填充 newIndexToOldIndexMap 数组，注意未处理节点的索引一般不是从0开始，而是s2开始，因此对应的索引是 newIndex - s2
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    if (newIndex >= maxNewIndexSoFar) {
        maxNewIndexSoFar = newIndex
    } else {
        moved = true
    }
    // 找到可复用节点后还需要打补丁
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
~~~

注：

1. 为了获得高效的查找性能，于是创建新节点列表的`{ key: index }` 映射表。（即方便这个步骤`newIndex = keyToNewIndexMap.get(prevChild.key)`）

~~~js
const keyToNewIndexMap: Map<string | number, number> = new Map()
// 遍历新节点数组来填充好 map 
for (i = s2; i <= e2; i++) {
    const nextChild = (c2[i] = optimized
                       ? cloneIfMounted(c2[i] as VNode)
                       : normalizeVNode(c2[i]))
    if (nextChild.key != null) {
        keyToNewIndexMap.set(nextChild.key, i)
    }
}
~~~

2. 现在找到了这个可复用的节点，并进行了打补丁。那么如何判断节点是否需要移动？方法是新增两个变量。

~~~js
let moved = false
// 代表遍历旧节点列表中发现的可复用节点在新节点列表中的最大索引
let maxNewIndexSoFar = 0
if (newIndex >= maxNewIndexSoFar) {
    maxNewIndexSoFar = newIndex
} else {// 表示索引值不是递增的，那么需要移动 DOM 节点
    moved = true
}
~~~



### 移动可复用节点到正确的位置

为此，我们需要根据`newIndexToOldIndexMap`计算出一个最长递增子序列。

~~~js
const increasingNewIndexSequence = moved
? getSequence(newIndexToOldIndexMap)
: EMPTY_ARR
~~~

最长递增子序列的作用是序列中的 DOM 元素相对位置不变，然后将其他 DOM 元素在它们之间找到正确的位置插入即可。具体看代码：

~~~js
j = increasingNewIndexSequence.length - 1
// i 为新节点数组中剩余未处理节点数组中的最后一个元素索引
for (i = toBePatched - 1; i >= 0; i--) {
    // 表示在新节点数组中的真实索引
    const nextIndex = s2 + i
    const nextChild = c2[nextIndex] as VNode
    // 获得下一个 DOM 元素，作为 insertBefore 的锚点
    const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
    if (newIndexToOldIndexMap[i] === 0) {
        // 没有相应可复用节点，那么挂载它
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
        if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 如果不是最长递增子序列中的元素，那么需要移动到正确位置
            move(nextChild, container, anchor, MoveType.REORDER)
        } else {
            // 最长递增子序列中的元素保持不动，只需让索引前移
            j--
        }
    }
}
~~~







## 完整源码

~~~ts
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
    // 旧子节点数组长度
    let e1 = c1.length - 1 // prev ending index
    // 新子节点数组长度
    let e2 = l2 - 1 // next ending index

    // 1. sync from start
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

    // 2. sync from end
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

    // 3. common sequence + mount
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

    // 4. common sequence + unmount
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

    // 5. unknown sequence
    // 如果是位置的节点序列
    // [i ... e1 + 1]: a b [c d e] f g
    // [i ... e2 + 1]: a b [e d c h] f g
    // i = 2, e1 = 4, e2 = 5
    else {
      const s1 = i // prev starting index
      const s2 = i // next starting index

      // 5.1 build key:index map for newChildren
      const keyToNewIndexMap: Map<string | number, number> = new Map()
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

      // 5.2 loop through old children left to be patched and try to patch
      // matching nodes & remove nodes that are no longer present
      let j
      let patched = 0
      const toBePatched = e2 - s2 + 1
      let moved = false
      // used to track whether any node has moved
      let maxNewIndexSoFar = 0
      // works as Map<newIndex, oldIndex>
      // Note that oldIndex is offset by +1
      // and oldIndex = 0 is a special value indicating the new node has
      // no corresponding old node.
      // used for determining longest stable subsequence
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // all new children have been patched so this can only be a removal
          unmount(prevChild, parentComponent, parentSuspense, true)
          continue
        }
        let newIndex
        if (prevChild.key != null) {
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
        if (newIndex === undefined) {
          unmount(prevChild, parentComponent, parentSuspense, true)
        } else {
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

      // 5.3 move and mount
      // generate longest stable subsequence only when nodes have moved
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



# 总结—— vue2，vue3 对比

vue2、vue3 的 diff 算法实现差异主要体现在：处理完首尾节点后，**对剩余节点的处理方式**。

在 vue2 中是通过对旧节点列表建立一个 `{ key, oldVnode }`的映射表，然后遍历新节点列表的剩余节点，根据`newVnode.key`在旧映射表中寻找可复用的节点，然后打补丁并且移动到正确的位置。

而在 vue3 中是建立一个存储新节点数组中的剩余节点在旧节点数组上的索引的映射关系数组，建立完成这个数组后也即找到了可复用的节点，然后通过这个数组计算得到最长递增子序列，这个序列中的节点保持不动，然后将新节点数组中的剩余节点移动到正确的位置。















