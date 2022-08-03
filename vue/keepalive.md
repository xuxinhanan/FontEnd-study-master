LRU（ least recently used）根据数据的历史记录来淘汰数据，重点在于**保护最近被访问/使用过的数据，淘汰现阶段最久未被访问的数据**

> LRU的主体思想在于：如果数据最近被访问过,那么将来被访问的几率也更高

![fifo对比lru原理](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c22e701db7f49d8b8957e76efef0e8e~tplv-k3u1fbpfcp-zoom-1.image)

经典的 LRU 实现一般采用**双向链表 + Hash表**。借助Hash表快速映射到对应的链表节点，然后进行插入和删除操作。这样既解决了hash表无固定顺序的缺点，又解决了链表查找慢的缺点。



![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b15a724eb4e044768044879587bcf9bb~tplv-k3u1fbpfcp-watermark.image?)

**但实际上在 js 中无需这样实现，可以参考文章第四部分。先看 vue 的 keep-alive 实现。**

## 1. keep-alive
keep-alive 是 vue 中的内置组件，**使用 KeepAlive 后，被包裹的组件在经过第一次渲染后的 vnode 会被缓存起来，然后再下一次再次渲染该组件的时候，直接从缓存中拿到对应的 vnode 进行渲染，并不需要再走一次组件初始化，render 和 patch 等一系列流程，减少了 script 的执行时间，性能更好。**








## 2. vue2的实现 
**实现原理：
通过 keep-alive 组件插槽，获取第一个子节点。根据 include、exclude 判断是否需要缓存，通过组件的 key，判断是否命中缓存。利用 LRU 算法，更新缓存以及对应的 keys 数组。根据 max 控制缓存的最大组件数量。**

先看 vue2 的实现：


```js
export default {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted () {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },

  render () {
    const slot = this.$slots.default
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```

可以看到 `<keep-alive>` 组件的实现也是一个对象，注意它有一个属性 `abstract` 为 true，是一个抽象组件，它在组件实例建立父子关系的时候会被忽略，发生在 `initLifecycle` 的过程中：

```js
// 忽略抽象组件
let parent = options.parent
if (parent && !options.abstract) {
  while (parent.$options.abstract && parent.$parent) {
    parent = parent.$parent
  }
  parent.$children.push(vm)
}
vm.$parent = parent
```

然后在 `created` 钩子里定义了 `this.cache` 和 `this.keys`，用来缓存已经创建过的 `vnode`。

`<keep-alive>` 直接实现了 `render` 函数，执行 `<keep-alive>` 组件渲染的时候，就会执行到这个 `render` 函数，接下来我们分析一下它的实现。

首先通过插槽获取第一个子元素的 `vnode`：

```js
const slot = this.$slots.default
const vnode: VNode = getFirstComponentChild(slot)
```

`<keep-alive>` 只处理第一个子元素，所以一般和它搭配使用的有 `component` 动态组件或者是 `router-view`。

然后又判断了当前组件的名称和 `include`、`exclude` （白名单、黑名单）的关系：

```js
// check pattern
const name: ?string = getComponentName(componentOptions)
const { include, exclude } = this
if (
  // not included
  (include && (!name || !matches(include, name))) ||
  // excluded
  (exclude && name && matches(exclude, name))
) {
  return vnode
}

function matches (pattern: string | RegExp | Array<string>, name: string): boolean {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  return false
}
```

组件名如果不满足条件，那么就直接返回这个组件的 `vnode`，否则的话走下一步缓存：

```js
const { cache, keys } = this
const key: ?string = vnode.key == null
  ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
  : vnode.key
if (cache[key]) {
  vnode.componentInstance = cache[key].componentInstance
  // make current key freshest
  remove(keys, key)
  keys.push(key)
} else {
  cache[key] = vnode
  keys.push(key)
  // prune oldest entry
  if (this.max && keys.length > parseInt(this.max)) {
    pruneCacheEntry(cache, keys[0], keys, this._vnode)
  }
}
```

如果命中缓存，则直接从缓存中拿 `vnode` 的组件实例，并且重新调整了 key 的顺序放在了最后一个；否则把 `vnode` 设置进缓存，如果配置了 `max` 并且缓存的长度超过了 `this.max`，还要从缓存中删除第一个。

**这里的实现有一个问题：判断是否超过最大容量应该放在 put 操作前。为什么呢？我们设置一个缓存队列，都已经满了你还塞进来？最好先删一个才能塞进来新的。** 

继续看删除缓存的实现：

```js
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const cached = cache[key]
  if (cached && (!current || cached.tag !== current.tag)) {
    cached.componentInstance.$destroy()
  }
  cache[key] = null 
  remove(keys, key)
}
```

除了从缓存中删除外，还要判断如果要删除的缓存的组件 `tag` 不是当前渲染组件 `tag`，则执行删除缓存的组件实例的 `$destroy` 方法。

————————————

可以发现，vue 实现 LRU 算法是通过 Array + Object，数组用来记录缓存顺序，Object用来模仿Map的功能进行vnode的缓存（`created` 钩子里定义的 `this.cache` 和 `this.keys`）
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b7e45d992bed4db8a60b2130a698d21f~tplv-k3u1fbpfcp-watermark.image?)

## 3. vue3的实现

vue3 实现思路基本和 vue2 类似，这里不再赘述。主要看 LRU 算法的实现。

vue3 通过 set + map 实现 LRU 算法：

```js
const cache: Cache = new Map()
const keys: Keys = new Set()
```

并且在判断是否超过缓存容量时的实现比较巧妙：

```js
if (max && keys.size > parseInt(max as string, 10)) {
  pruneCacheEntry(keys.values().next().value)
}
```

这里巧妙的利用 Set 是可迭代对象的特点，通过 keys.values() 迭代器方法获得可迭代对象，并通过 next().value 获得可迭代对象的第一个元素，然后通过`pruneCacheEntry()`方法进行删除。

## 4. 借助vue3的思路实现LRU算法

[Leetcode 题目—— LRU 缓存](https://leetcode.cn/problems/lru-cache/)

```js
var LRUCache = function(capacity) {
  this.map = new Map();
  this.capacity = capacity;
};

LRUCache.prototype.get = function(key) {
  if (this.map.has(key)) {
    let value = this.map.get(key);
    // 删除后，再 set ，相当于更新到 map 最后一位
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }
  return -1;
};

LRUCache.prototype.put = function(key, value) {
  // 如果已经存在，那就要更新，即先删了再进行后面的 set
  if (this.map.has(key)) {
    this.map.delete(key);
  } else { //如果 map 中不存在，要先判断是否超过最大容量
    if (this.map.size === this.capacity) {
      this.map.delete(this.map.keys().next().value);
    }
  }
  this.map.set(key, value);
};
```

这里我们直接通过 Map 来就可以直接实现了。

而 keep-alive 的实现因为缓存的内容是 vnode，直接操作 Map 中缓存的位置代价较大，通过 Set(vue3) / Array(vue2) 记录缓存 vnode 的 key 来模拟缓存顺序的变化。