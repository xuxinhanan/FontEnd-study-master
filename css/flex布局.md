## flex布局

CSS3中的 flex 属性，使得我们对**多个元素之间**的布局排列变得十分灵活。



### **flex示例**

默认文档流中，在一个父容器里放置多个块级的子元素，那么，这些子元素会默认从上往下排列。

![img](http://img.smyhvae.com/20191009_1555.png)

在此基础之上，如果我给父容器仅仅加一个 `display: flex`属性，此时，子元素们会**在水平方向上，从左至右排列**：

![img](http://img.smyhvae.com/20191009_1600.png)



### **flex 布局的优缺点**

1. **flex 布局的子元素不会脱离文档流**。

但你如果用 float 来做布局，float 属性的元素会脱离文档流，而且会涉及到各种 BFC、清除浮动的问题。

2. 兼容性

flex不支持低版本的 IE 浏览器。



**相关概念**

- **弹性盒子**：指的是使用 `display:flex` 或 `display:inline-flex` 声明的**父容器**。

- **子元素**：指的是父容器里面的子元素们（父容器被声明为 flex 盒子的情况下）。

- 主轴：flex容器的主轴，默认是水平方向，从左向右。
- 侧轴：与主轴垂直的轴称作侧轴，默认是垂直方向，从上往下。





### 弹性盒子

1. disply: flex 声明一个父容器为弹性盒子。

2. flex - direction 确定主轴方向。

| 属性值 | 描述                             |
| :----- | :------------------------------- |
| row    | 从左到右水平排列子元素（默认值） |
| column | 从上到下垂直排列子元素           |

3.  justify - content 指定主轴对齐方式。

| 属性值        | 描述          |
| :------------ | ------------- |
| center        | 居中对齐      |
| space-between | 两端对齐 平分 |

4. align - items 指定侧轴对齐方式。

| 属性值 | 描述     |
| :----- | -------- |
| center | 中间对齐 |

5. 通过 **flex - wrap** 规定一行排不下的时候的**换行方式**。



### 子元素

- flex: 1：flex-items 具有伸缩的能力，flex-basis设置为零。
- flex-grow, flex-shrink 和 flex-basis的简写，等同于 flex: 1 1 0。



+ 通过设置 flex-grow 确定子元素的伸展情况，默认值为0，即如果存在剩余空间，也不放大。**如果设为1的话，即自适应布局。**
+ 通过设置 flex-shrink，确定子元素的缩小情况，默认值为1，即如果空间不足，该项目将缩小。**如果设为1的话，即自适应布局。**
+ flex-basis，元素在flex-grow和flex-shrink生效前的尺寸，默认值为 auto 。



**flex-basis设置为0 与设置成auto有何区别？**

+ `flex-basis: auto` 表示项目的本来大小，当设置为 `auto` 时会根据主轴方向检索该 `flex-item` 的 `width` 或 `height` 值作为 `flex-basis` 的值。如果 `width` 或 `height` 值为 `auto`，则 `flex-basis` 设置为 `content`，也就是基于 flex 的元素的内容自动调整大小。

- `flex-basis: 0` 相当于指定了宽度或高度（由主轴方向决定）为 0。

 



![img](http://img.smyhvae.com/20190821_2101.png)

