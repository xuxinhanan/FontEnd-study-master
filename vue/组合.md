### 数学中的组合

先回顾一下数学中的组合：假设我们有两个函数。一个函数是 y = 2 * x，它的参数加倍。另一个函数是 y = x + 10，它的参数加 10。

如果我们将它们放在一起，以便将一个函数的输出传递给另一个函数（作为输入），我们得到 y = (2 * x) + 10。

这是组合的一个例子——我们已经从另外两个函数中“组合”了这个函数功能。



### 函数组合

假设有一些简单的四则运算方法：

```js
const times = (y) =>  (x) => x * y  
const plus = (y) => (x) => x + y
const subtract = (y) => (x) => x - y
const divide = (y) => (x) => x / y
```

如果我们想要实现`1 * 2 * 3`的运算，可以：

~~~js
const curr =  times(1)(2)
const result = times(curr)(3)
~~~

**这段代码有一些重复。并且不具备复用能力。**

我们可以更进一步，**去掉重复，并且实现复用**，完成`x * 2 * 3`运算。首先将步骤提取出来：

~~~js
let steps = [
  times(2),
  times(3)
]
~~~

然后我们编写一个名为 runSteps 的函数，逐个应用每个步骤：

~~~js
function runSteps(steps, x) {
  let result = x;
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    result = step(result);
  }
  return result;
}
~~~

有了这个函数，我们原来的代码就变成了：

~~~js
runSteps(steps, x);
~~~

现在假设我们可以从程序的不同位置、不同的时间执行这些步骤。为此我们可以编写一个函数来为我们做这件事：

~~~js
function composition(x) {
  runSteps([
    times(2),
    times(3)
  ], x);
}

// 现在我们可以任意调用它
composition(1);
composition(2);
~~~

或者我们可以有一个函数——管道函数，来生成我们的函数，进一步提高抽象性：

```js
// 现在我们不仅可以任意调用它，还可以任意替换步骤
let composition = pipe([times(2), times(3)]);

composition(1);
composition(2);
```

这段代码使我们不必显式地实现 composition。它把 runSteps 藏在管道里：

~~~js
function pipe(...steps) {
  function runSteps(x) {
    let result = x;
    for (let i = 0; i < steps.length; i++) {
      let step = steps[i];
      result = step(result);
    }
    return result;
  }
}
~~~

通过这个函数，我们就不用按顺序一个一个地手动调用函数，只需指定步骤。



### 简洁干净的组合

从上面案例中发现，我们不必手动调用我们的函数了。

与此相反，我们将函数提供给另一个函数，它会给我们一个函数来调用提供的函数！

这对于理解函数组合的思想很重要。本质上，这意味着当我们有 doX(doY(doZ(thing))) 时，我们可以先组合 doX、doY 和 doZ，然后使用结果函数。

通过函数组合，**将程序本身的结构（一系列步骤）变成我们的代码可以操作的东西，我们提高了抽象级别。**

在像上面这样的琐碎情况下，直接调用函数带来更多的麻烦。

但如果问题更具挑战性，直接调用的方式也许是合适的。也许，我们希望每一步骤都被记住。也许，每个步骤都是异步发生的，控制流程更复杂。在某些情况下，我们希望在每一步之前或之后发生一些事情，而不是到处重复这种逻辑。

我们因牢记这一点，不需要每次想要将两个函数放在一起时都通过函数组合的方式。我们不需要向计算机证明我们很聪明。通常，**在简单的函数调用中使用就足够了。**





### Composition API

理解了函数组合的思想，我们再来看看 vue.js 3 的 Composition API。先看官方文档的示例：

```js
// 选项式API的写法

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { 
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // 使用 `this.user` 获取用户仓库
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

经过 Composition API 改造后（我们不需要深入了解实现细节）：

```js
// src/components/UserRepositories.vue
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch } from 'vue'

export default function useUserRepositories(user) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

```js
// src/composables/useRepositoryNameSearch.js

import { ref, computed } from 'vue'

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(repository => {
      return repository.name.includes(searchQuery.value)
    })
  })

  return {
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

可以看到，利用组合式API，我们可以很轻松的将一个个逻辑关注点相同的函数组合到一个 Hooks 里。

这种做法有助于**提高代码的抽象级别**，但相应的，使我们的代码相较于选项式 API 的书写范式来说，**变得不那么直接。**

组合式 API 的书写范式”干净“、”漂亮“，但与此同时也需要付出代码不那么直观的代价。

