`animation`可声明的两种动画，每种动画各有自身特性。

-  **关键帧动画**：在时间轴的关键帧中绘制关键状态并使之有效过渡组成动画
-  **逐帧动画**：在时间轴的每帧中绘制不同内容并使之连续播放组成动画



--------

### 关键帧动画

关键帧动画必须通过`animation`与`@keyframes`声明，`@keyframes` 会**指定某个动画的名称以及相应的规则**：哪个属性，何时以及何地渲染动画。然后使用 `animation` 属性把动画绑定到相应的元素上，并为其添加额外的参数。

> 关键帧动画声明步骤

- 在`@keyframes`中声明动画名称与动画每个关键帧的状态
- 动画名称不能重复否则会被覆盖，关键帧通过百分比分割出每个关键帧并声明相应状态
- 在指定节点中声明`animation`调用动画

形如：

~~~css
@keyframes animation-name {
	from {}
	to {}
}
~~~

关键帧的取值必须是`from`、`to`或`Percentage`。`from`可用`0%`代替，`to`可用`100%`代替，若开始或结束的关键帧无相应状态，无需声明`from`或`to`。

后面声明的关键帧状态会覆盖前面声明的关键帧状态，动画结束后会回到`animation-fill-mode`声明的状态。

----------

例如：

~~~html
<div class="progress"></div>

<style>
  @keyframes go-left-right {        /* 指定一个名字："go-left-right" */
    from { left: 0px; }             /* 从 left: 0px 开始 */
    to { left: calc(100% - 50px); } /* 移动至 left: 100%-50px */
  }

  .progress {
    animation: go-left-right 3s infinite alternate;
    /* 把动画 "go-left-right" 应用到元素上
       持续 3 秒
       持续次数：infinite
       每次都改变方向
    */

    position: relative;
    border: 2px solid green;
    width: 50px;
    height: 20px;
    background: lime;
  }
</style>
~~~



-----------

`animation`包括八个子属性，每个子属性包括以下参数。

### animation-name：名称

- `none`：无动画(`默认`)
- `String`：动画名称

#### animation-duration：持续时间

- `Time`：秒或毫秒(默认`0`)

####  animation-timing-function：缓动函数

- `ease`：逐渐变慢，等同于`cubic-bezier(.25,.1,.25,1)`(`默认`)
- `linear`：匀速，等同于`cubic-bezier(0,0,1,1)`
- `ease-in`：加速，等同于`cubic-bezier(.42,0,1,1)`
- `ease-out`：减速，等同于`cubic-bezier(0,0,.58,1)`
- `ease-in-out`：先加速后减速，等同于`cubic-bezier(.42,0,.58,1)`
- `cubic-bezier`：贝塞尔曲线，`(x1,y1,x2,y2)`四个值指定曲线中的点`P1`与`P2`，所有值需在`[0,1]`区域内
- `steps([,[start|end]]?)`：把动画平均划分成`n等分`，直到平均走完该动画
- `step-start`：等同于`steps(1,start)`，把动画分成一步，动画执行时以左侧端点`0%`为开始
- `step-end`：等同于`steps(1,end)`，把动画分成一步，动画执行时以右侧端点`100%`为开始



#### animation-delay：等待时间

- `Time`：秒或毫秒(默认`0`)



#### animation-iteration-count：播放次数

- `Number`：数值(默认`1`)
- `infinite`：无限次



#### animation-direction：轮流反向播放(播放次数为一次则该属性无效果)

- `normal`：正常播放(`默认`)
- `alternate`：轮流反向播放，奇数次数正常播放，偶数次数反向播放



#### animation-play-state：播放状态

- `running`：正在播放(`默认`)
- `paused`：暂停播放



#### animation-fill-mode：播放前后其效果是否可见

- `none`：不改变默认行为(`默认`)
- `backwards`：在等待时间内或在动画开始前应用开始属性(`在第一个关键帧中定义`)
- `forwards`：在动画结束后保持最后一个属性(`在最后一个关键帧中定义`)
- `both`：向前与向后填充模式都被应用

