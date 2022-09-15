JavaScript 动画可以处理 CSS 无法处理的事情。例如，沿着具有与 Bezier 曲线不同的时序函数的复杂路径移动，或者实现画布上的动画。

-------------

## [使用 setInterval](https://zh.javascript.info/js-animation#shi-yong-setinterval)

**从 HTML/CSS 的角度来看，动画是 style 属性的逐渐变化。**例如，将 `style.left` 从 `0px` 变化到 `100px` 可以移动元素。

如果我们用 `setInterval` 每秒做 50 次小变化，看起来会更流畅。电影也是这样的原理：每秒 24 帧或更多帧足以使其看起来流畅。



--------

## [使用 requestAnimationFrame](https://zh.javascript.info/js-animation#shi-yong-requestanimationframe)

假设我们有几个同时运行的动画。

如果我们单独运行它们，每个都有自己的 `setInterval(..., 20)`，那么浏览器必须以比 `20ms` 更频繁的速度重绘。

每个 `setInterval` 每 `20ms` 触发一次，但它们相互独立，因此 `20ms` 内将有多个独立运行的重绘。

这几个独立的重绘应该组合在一起，以使浏览器更加容易处理。