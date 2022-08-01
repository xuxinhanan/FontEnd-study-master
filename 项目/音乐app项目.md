**pc端切到移动端轮播图不滚动的问题？**

pc端切到移动端后BScroll没有再去监听移动端事件，因此就不能滚动了。需要重新刷新来支持滚动。

不用管PC切到移动端后也要支持滚动，因此实际场景中没有用户这么干的。





# 项目的目录结构



- Assets —— 存放静态文件
  + scss
    + variables.scss：定义常量
    + mixin.scss：定义通用的 css
    + 

+ Components —— 存放基础组件
+ Router —— 存放路由相关文件
+ Store —— vuex 相关文件
+ service —— 存放封装好的与后端交互的逻辑
+ views —— 存放一级路由的组件，即视图组件





# App应用架构

~~~vue
<template>
  <m-header></m-header>
  <tab></tab>
	/* 路由组件占位符 */
  <router-view></router-view>
  <player></player>
</template>
~~~



## Tab组件

承载导航路由。点击跳转到相应的路由组件。



下面是路由组件，包括推荐页组件、歌手页组件、排行页组件、搜索页组件。

# 1.一级路由 —— 推荐首页

~~~html
<div class="recommend">
  <scroll>
  	<div class="包裹">
      <slider class="轮播图"></slider>
      <div class="recommend-list">
      	<h1 class="标签"></h1>
        <ul class="列表">
          <li v-for></li>
        </ul>
      </div>
    </div>
  </scroll>
</div>
~~~





## 轮播图组件

利用第三方库实现。并且监听切换事件，拿到 currentPageIndex，然后相应更改下方的圆圈的样式。



## 推荐列表

根据从请求到的数据 v-for 相应渲染即可。



## 歌单列表跳转功能

占坑。



# 2.一级路由 —— 歌手列表

~~~vue
<div class="singer">
  <div class="fixed"></div>
  <div class="singer-list"></div>
  <div class="shortcut"></div>
</div>
~~~



## 歌手列表组件

歌手列表的 DOM 结构实际上是，ul -> li（按首字母分类的歌手组合），而每个 li 里又嵌套了 ul -> li 结构，在这一层的 li 里才是真实的渲染每一个歌手。



### 歌手跳转功能

这里注意组件通信。点击歌手 DOM 后，发出事件，让 singer 组件进行路由跳转。

~~~js
selectSinger(singer) {
  this.selectedSinger = singer;
  this.cacheSinger(singer);
  this.$router.push({
    path: `/singer/${singer.mid}`,
  });
},
~~~

注意，这里是由一级路由跳转到二级路由。因此，视图应该是这样的：

<img src="C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220630220924348.png" alt="image-20220630220924348" style="zoom:50%;" />

而这显然是不符合我们的预期的，我们希望的是这个页面全屏显式。如何做到呢？

可以借助 CSS 的固定定位来实现全屏效果。

~~~css
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
~~~



并且此时会存在一个问题：歌手详情页刷新时报错。

原因是：通过歌手页（一级路由）跳转到歌手详情页（二级路由）时传入的 props：singer 对象的数据来渲染歌手详情页，一旦页面进行刷新后，内存中的数据都会丢失，并且没有经过路由跳转，不知道点击的是哪个歌手，就不能去请求对应的歌曲数据。

我们希望刷新页面的时候仍然能获取到 singer 对象数据，为此，可以将数据保存到浏览器存储中。考虑到用localStorage太重，用sessionStorage即可。（在本次会话中一直有效，刷新后仍有效）通过路由参数 id 与 歌手 mid 进行匹配，以正确显示。

~~~js
cacheSinger(singer) {
  storage.session.set(SINGER_KEY, singer);
},
~~~







## 顶部固定标题栏功能

首先可以知道，标题栏的文字是响应式数据，根据数据变化而动态变化。

~~~vue
<div class="fixed-title">
  {{ fixedTitle }}
</div>
~~~

而这个标题数据怎么动态变化呢？

我们可以先求得 DOM 中每个歌手分组 li 的高度。然后根据滚动的距离计算出目前落入的区间。

~~~js
const listHeights = ref([]);
// 计算方法
function calculate() {
  const list = groupRef.value.children;
  const listHeightsVal = listHeights.value;

  let height = 0;
  listHeightsVal.length = 0;
  listHeightsVal.push(height);

  for (let i = 0; i < list.length; i++) {
    height += list[i].clientHeight;
    listHeightsVal.push(height);
  }
}
~~~

什么时候去执行计算拿到区间高度呢？

我们知道整个列表由歌手页请求到数据后传递给当前组件，然后渲染出相应的歌手列表。于是我们可以监听数据传递 props ，当 props 变化后，进行计算求值，并且我们是通过直接获取 DOM 的方式来计算的，而根据 vue 渲染原理，需要在下一个 tick 才能拿到最新的 DOM 数据。于是：

~~~js
watch(
  () => props.data,
  async () => {
    await nextTick();
    calculate();
  }
);
~~~

现在我们计算好 [分区高度] 了。接下来需要监听滚动，计算得到落入的分区。首先监听滚动，动态获取当前滚动坐标：

~~~js
<scroll @scroll="onScroll" />

function onScroll(pos) {
  // 拿到滚动的y坐标，因为better-scroll给出的是负值，因此需要取反
  scrollY.value = -pos.y;
}
~~~

接下来监听滚动坐标这个响应式数据，动态修改当前分区。具体做法是，根据计算得到的分区高度数据，判断当前滚动对应的区间：

~~~js
const distance = ref(0);

watch(scrollY, (newY) => {
  // 获取所有分组高度的数据
  const listHeightsVal = listHeights.value;
  for (let i = 0; i < listHeightsVal.length - 1; i++) {
    // 获取每个分组的高度
    const heightTop = listHeightsVal[i];
    const heightBottom = listHeightsVal[i + 1];
    // 进而判断落入的区间
    if (newY >= heightTop && newY <= heightBottom) {
      currentIndex.value = i;
      /* 计算当前分区底部与容器顶部的距离，用于后续上推优化 */
      distance.value = heightBottom - newY;
      // 判断完毕即退出循环，提高性能
      break;
    }
  }
});
~~~

得到了当前滚动落入的区间位置，那么就可以相应的修改固定标题栏需要的响应式数据了。

~~~js
const fixedTitle = computed(() => {
  // 根据区间位置从后台返回来的数据中获取 title 值
  const currentGroup = props.data[currentIndex.value];
  return currentGroup ? currentGroup.title : "";
});
~~~

现在已经基本完成固定标题栏的功能了。接下来做一些细节的优化：

如果初始往上滚动不应该显示'热'，而是显示' '（空），并将整个固定标题栏的 DOM用 v-show，直接不展示固定标题栏。为此，我们在`fixedTitle`计算属性中加入：

~~~js
if (scrollY.value < 0) {
  return "";
}
~~~

并且：

~~~vue
<div class="fixed" v-show="fixedTitle" :style="fixedStyle">
~~~

接着继续做优化，往上滚动的时候，固定标题栏的视觉效果是将标题栏慢慢顶上去。这一点，只需要动态设置固定标题栏的偏移量即可：

~~~js
const fixedStyle = computed(() => {
  const distanceVal = distance.value;
  const diff =
        distanceVal > 0 && distanceVal < TITLE_HEIGHT
  ? distanceVal - TITLE_HEIGHT
  : 0;
  return {
    transform: `translate3d(0, ${diff}px, 0)`,
  };
});
~~~



## shortcut功能

首先整个 DOM 来说，是通过歌手数据的 title 属性组成一个集合。并渲染这个集合数据。 

~~~js
const shortcutList = computed(() => {
  return props.data.map((group) => {
    return group.title;
  });
});
~~~

然后有了基本的 DOM 结构后，先完成点击跳转功能。通过`touchstart`事件，用户触摸时触发，我们可以通过`e.target`拿到触发事件的 DOM 元素，并根据其上的标记，得到对应的歌手 DOM 的位置，然后通过 Better-sroll 进行跳转即可。

~~~vue
// 监听 touchstart 事件，并通过.stop.prevent阻止其默认行为
<div @touchstart.stop.prevent="onShortcutTouchStart"></div>
~~~

在很多情况下，触摸事件和鼠标事件会一起触发（以使非触摸专用的代码仍然可以与用户交互）。而本项目为移动端项目，只需使用触摸事件，于是通过阻止默认行为来取消鼠标事件。

~~~js
function onShortcutTouchStart(e) {
  // 通过 e.target.dataset.index 拿到当前 touch 位置对应的 li 元素的在整个列表 DOM 中的下标索引
  const anchorIndex = Number(e.target.dataset.index);
  touch.y1 = e.touches[0].pageY;
  touch.anchorIndex = anchorIndex;
  // 歌手列表滚动到触点的 DOM 元素相应的歌手区域
  scrollTo(anchorIndex);
}

function scrollTo(index) {
  if (isNaN(index)) {
    return;
  }
  index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
  const targetEl = groupRef.value.children[index];
  // 通过 scroll 组件拿到 better-scroll 实例
  const scroll = scrollRef.value.scroll;
  // 接着就可以调用实例里面的 scrollToElement 方法滚动到目标元素
  scroll.scrollToElement(targetEl, 0);
}
~~~

注意这里的`Math.max(0, Math.min(shortcutList.value.length - 1, index))`，为什么写呢？因为是 index 是根据触点在页面中的位置计算得到的，而如果拖拽出指定区域仍然计算，这个时候就会出错了，因此进行限制。



接着继续完成拖拽功能。拖拽对应的事件是`touchmove`，在回调函数中，计算出拖拽位置与原始触摸位置的偏移量，根据偏移量计算出对应歌手列表需要滚动到的位置。

~~~js
function onShortcutTouchMove(e) {
  // 屏幕中的第一个触点在页面上的位置
  touch.y2 = e.touches[0].pageY;
  // 估算出拖拽了多少个 li 的身位
  const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0;
  // 然后歌手列表就可以相应定位到对应的位置
  const anchorIndex = touch.anchorIndex + delta;
  scrollTo(anchorIndex);
}
~~~





# 3.一级路由 —— 排行榜单

DOM 结构：

~~~vue
<scroll>
	<ul>
    <li v-for>
      <div>
      	<img />
      </div>
      <ul>
        <li v-for></li>
      </ul>
    </li>
  </ul>
</scroll>
~~~

这个页面没有特别的地方，只需搭好 DOM 结构，然后渲染数据即可。





# 4.一级路由 —— 搜索页面

DOM结构：

~~~vue
<div>
  <div class="search-input-wrapper"></div>
  <scroll class="search-content">
  	<div class="hot-keys"></div>
    <div class="search-history"></div>
  </scroll>
</div>
~~~

## 搜索框组件

组件状态：

~~~
query
~~~

交互：

+ 搜索框内有输入则显示搜索结果。
+ 搜索框中，有输入时，会有 icon 图标展示，点击则清空数据。

<img src="C:\Users\64554\Desktop\笔记\项目\动画\搜索框.gif" alt="搜索框" style="zoom: 80%;" />

可以看到，两个组件都需要这份状态。根据组件通信方式知，这种情况只能用 props 或者 全局状态。这种小范围内使用状态最好不要使用全局状态。并且因为子组件会修改状态，因此可使用 v-model 进行组件间通信。





### 搜索栏添加防抖时踩的坑 — this指向

最开始将防抖写在 watch 内部，然后发现防抖功能没有生效。

~~~js
watch: {
  query(newQuery) {
    debounce(300, () => {
      this.$emit("update:modelValue", newQuery.trim());
    });
  }
}
~~~

经过排查之后，发现是在数据改变之后，我们只执行了debounce方法，实际上需要执行的是debounce 方法返回的函数。于是，我改成 handler 的写法，把 debounce 函数调用写成 handler 的属性值，以此拿到 debounce 返回的函数：

~~~js
watch: {
  query: {
    handler: debounce(300, () => {
      this.$emit("update:modelValue", newQuery.trim());
    }),
  },
},
~~~

但这时候虽然防抖功能可以正常运行了，但又出现了新的问题，控制台中报错说不能读取到 undefined 属性：

![image-20220701212041812](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220701212041812.png)

接着我尝试打印 `this`，发现打印出来的是 undefined：

![image-20220701212549790](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220701212549790.png)

而我期望的是`this`指向的是当前组件的实例对象。根据 this 指向的知识进行分析，函数内的 this 一般是指向的是调用当前函数的对象，而这个对象即使在作用域最外层也会打印出 **window** 对象。但是在严格模式下，作用域的最外层的 **this** 打印出来的是`undefined`。同时 vue 的代码经过 babel 编译转化为 ES5 代码的时候会添加 `use strict`，声明为严格模式。

因此，可以判断出这个函数应该是处于全局作用域下的调用的。

判断出原因后马上就发现自己写的代码为了精简使用了箭头函数，而箭头函数因为没有自己的执行上下文也就没有自己的 this 指针，如果在箭头函数中访问 this，那么就会在外层找，因此就找到了 全局对象，（ 比如`vue.() => { this }`类似这种调用，最终会找到了全局对象 ），并且在严格模式下变成了 undefined。

debounce 方法实际上是调用定时器来执行回调，因此回调异步执行，最终在vue实例的上下文中调用。

因此，最终将回调由箭头函数的形式修改成匿名函数的形式解决了这个问题。

~~~js
watch: {
  query: {
    handler: debounce(300, function (newQuery) {
      this.$emit("update:modelValue", newQuery.trim());
    }),
  },
  modelValue(newVal) {
    this.query = newVal;
  },
},
~~~

---------------

按官网的说法，在 created 生命周期里添加防抖函数：

~~~js
created() {
  this.$watch(
    "query",
    debounce(300, (newQuery) => {
      this.$emit("update:modelValue", newQuery.trim());
    })
  );
  this.$watch("modelValue", (newVal) => {
    this.query = newVal;
  });
},
~~~







## 搜索内容组件

该组件分成两个部分：

+ 渲染热词
+ 渲染搜索历史

组件状态：

~~~
# 搜索热词：hotKeys
# 搜索历史：searchHistory
~~~

交互：

+ 点击热词时搜索栏添加对应的字段（触发搜索结果展示）
+ 点击历史记录时搜索栏添加对应字段（触发搜索结果展示）
+ 点击历史记录的 delete-icon 删除该记录
+ 点击历史记录的 清空-icon ，删除所有记录 



## 搜索结果组件

该组件即数据的渲染。

组件状态：

~~~
# 歌手：singer
# 歌曲：songs
~~~

交互：

+ 点击歌手跳转到歌手详情页 —— 二级路由跳转
+ 点击歌曲跳转到歌曲播放页 —— 点击事件中派发 action 改变状态即可

优化：（未完成）

+ 搜索结果上拉加载更多数据
+ 分页请求数据时如果数据不满足一屏，那么继续请求数据，填充满一屏（如果不足一屏，用户会认为没有更多数据，然后就不会再继续请求了）







### 搜索结果的上拉加载，分页请求数据

利用 BScroll 的 pullingUp 事件，每次底部上拉都请求数据，并且将请求到的数据和之前的拼接在一起。





## 搜索历史

首先在全局状态中添加 searchHistory 数据。并且在点击事件中将点击对象（歌曲、歌手）存储在本地和全局状态中。并将数据传递给搜索历史组件进行渲染，没有搜索历史数剧则不渲染。





# 换肤功能

定义一整套样式变量体系，通过修改样式变量来达到一键换肤的功能，修改样式的方式是通过定义另一套样式来一键更换所有样式变量。

实现：主题作为状态，在更改状态的 actions 中修改样式变量。

组件状态：

~~~
# 主题：theme
~~~

交互：

+ 点击 icon 切换 icon 和 相应主题





# 项目优化

1. 搜索框加防抖。
2. 滑动上拉时分页加载。
3. 用户体验优化：分页请求数据时如果数据不满足一屏，那么继续请求数据，填充满一屏。如果不足一屏，用户会认为没有更多数据，然后就不会再继续请求了。
4. 
5. keep-alive组件。
6. 路由异步加载。
6. 给项目使用缓存，二次编译速度提高80%。



初始打包时间 13.83secs

![image-20220714152206207](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220714152206207.png)



优化方式，路由懒加载





优化后：

![image-20220714151519422](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220714151519422.png)
