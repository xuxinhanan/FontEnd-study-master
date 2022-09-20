BFC（Block Formatting Context），即块级格式化上下文。

----------

> 规则

- DOM 节点在垂直方向上按顺序排列
- 对于同一个BFC的俩个相邻的盒子的margin会发生重叠
- DOM 节点的 `margin-left/right` 与父节点的`左边/右边`相接触，即使处于浮动也如此，除非自行形成`BFC`
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- `BFC`是一个隔离且不受外界影响的独立容器



> 成因

+ **根元素**，即HTML中在最顶端的，没有父节点的元素！（如body）
+ **浮动元素**：设置了 float: left / right 属性
+ **overflow** ：hidden 、auto 、scroll，不为 visible
+ **被定义为块级的非块级节点**：设置了 display ：inline - block 属性
+ **绝对定位、固定定位节点**：设置了 position ：absolute 、fixed 属性



> 场景

- 清除浮动
- 已知宽度水平居中
- 防止浮动节点被覆盖
- 防止垂直`margin`合并

##### 防止 margin 重叠（塌陷）

```html
<style>
    p {
        color: #f55;
        background: #fcc;
        width: 200px;
        line-height: 100px;
        text-align:center;
        margin: 100px;
    }
</style>
<body>
    <p>Haha</p >
    <p>Hehe</p >
</body>
```

上面讲到，根元素<body>会触发BFC，BFC里面有一个规则：同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。

因此在p外面包裹一层容器，并且使该容器触发BFC，那么两个p就不属于同一个BFC，则不会出现 margin 重叠。

```html
<body>
    <p>Haha</p >
    <div class="wrap">
        <p>Hehe</p >
    </div>
</body>
```



##### 清除内部浮动

```html
<style>
    .par {
        border: 5px solid #fcc;
        width: 300px;
    }
 
    .child {
        border: 5px solid #f66;
        width:100px;
        height: 100px;
        float: left;
    }
</style>
<body>
    <div class="par">
        <div class="child"></div>
        <div class="child"></div>
    </div>
</body>
```

页面显示如下：

![img](https://static.vue-js.com/ec5d4410-9511-11eb-85f6-6fac77c0c9b3.png)

上面讲到，BFC有一个规则：计算BFC的高度时，浮动子元素也参与计算。

因此，给盒子触发BFC可以清除浮动的影响。

```css
.par {
    overflow: hidden;
}
```

实现效果如下：

![img](https://static.vue-js.com/f6487b20-9511-11eb-ab90-d9ae814b240d.png)



##### 自适应多栏布局

这里举个两栏的布局：

```html
<style>
    body {
        width: 300px;
        position: relative;
    }
 
    .aside {
        width: 100px;
        height: 150px;
        float: left;
        background: #f66;
    }
 
    .main {
        height: 200px;
        background: #fcc;
    }
</style>
<body>
    <div class="aside"></div>
    <div class="main"></div>
</body>
```

效果图如下：

![img](https://static.vue-js.com/ffb95210-9511-11eb-ab90-d9ae814b240d.png)

前面讲到，BFC有个规则：每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此。

而根元素body触发了BFC，通过给 main 元素触发BFC，可以达到互不干扰，自动变窄的效果。

```css
.main {
    overflow: hidden;
}
```

效果如下：

![img](https://static.vue-js.com/0a5f2690-9512-11eb-ab90-d9ae814b240d.png)

