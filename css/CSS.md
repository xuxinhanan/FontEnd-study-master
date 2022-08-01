## 



## 2.CSS选择器有哪些？优先级？哪些属性可以继承？

#### 选择器

它是元素和其他部分组合起来告诉浏览器哪个HTML元素应当是被选为应用规则中的CSS属性值的方式。

常用的CSS选择器有：

+ id选择器（#box），选择id为box的元素
+ 类选择器（.one），选择类名为one的所有元素
+ 标签选择器（div），选择标签为div的所有元素
+ 后代选择器（#box div），选择id为box元素内部所有的div元素
+ 子选择器（.one>one_1），选择父元素为.one的所有.one_1的元素
+ 群组选择器（div,p），选择div、p的所有元素
+ 伪类选择器
+ 属性选择器：希望选择有某个属性的元素，而不论属性值是什么。



#### 优先级

!important>行间样式>id>属性选择器/类选择器>标签选择器>通配符

正无穷>1000>100>10>1>0





## 3.浮动

### 标准文档流

标准文档流的特性

1. 空白折叠现象

无论多少个空格、换行、tab，都会折叠为一个空格。

因此，如果要消除空隙，标签必须紧密连接：

```text
<img src="images/0.jpg" /><img src="images/1.jpg" /><img src="images/2.jpg" />
```



2. 高矮不齐，底边对齐

![img](http://img.smyhvae.com/20170729_1508_2.png)



3. 一行写不满，自动换行



### 行内、块级元素

标准文档流等级森严。标签分为两种等级：

- 行内元素：p、span、a、b、i、u、em。
- 块级元素：div、h系列、li、dt、dd。

标准元素和块级元素的区别：

行内元素：

- 与其他行内元素并排；
- 不能设置宽、高。默认的宽度，就是文字的宽度。

块级元素：

- 独占一行；
- 能接受宽、高。如果不设置宽度，那么宽度将默认变为父亲的100%。















### 3.BFC的理解

#### 是什么

BFC（Block Formatting Context），即块级格式化上下文。

它是页面中的一块渲染区域，并且有一套属于自己的渲染规则：

- 内部的盒子会在垂直方向上一个接一个的放置
- 对于同一个BFC的俩个相邻的盒子的margin会发生重叠，与方向无关。
- 每个元素的左外边距与包含块的左边界相接触（从左到右），即使浮动元素也是如此
- BFC的区域不会与float的元素区域重叠
- 计算BFC的高度时，浮动子元素也参与计算
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然

BFC目的是形成一个相对于外界完全独立的空间，让内部的子元素不会影响到外部的元素。



#### 触发BFC

+ 根元素，即HTML中在最顶端的，没有父节点的元素！（body）
+ 浮动元素
+ overflow ：hidden 、auto 、scroll，不为 visible
+ display ：inline - block
+ position ：absolute 、fixed



#### 应用场景

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



### 4.水平居中与垂直居中

#### 一、背景

在开发中经常遇到这个问题，即让某个元素的内容在水平和垂直方向上都居中，内容不仅限于文字，可能是图片或其他元素

居中是一个非常基础但又是非常重要的应用场景，实现居中的方法存在很多，可以将这些方法分成两个大类：

- 居中元素（子元素）的宽高已知
- 居中元素宽高未知



#### 二、实现方式

+ **利用定位+margin:auto**

```html
<!-- 1.子绝父相 -->
<!-- 2.相对定位 relative 就是正常定位，绝对定位 absolute 就是相对它第一个position不为static的祖先元素来进行定位的 -->
<style>
    .father{
        width:500px;
        height:300px;
        border:1px solid #0a3b98;
        position: relative;
    }
    .son{
        width:100px;
        height:40px;
        background: #f0a238;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin:auto;
    }
</style>
<div class="father">
    <div class="son"></div>
</div>
```







## 4.定位



### 相对定位

让元素相对于自己原来的位置，进行位置调整（可用于盒子的位置微调）。

使用格式：

~~~css
	position: relative;
	left: 50px;/*横坐标：正值表示向右偏移，负值表示向左偏移*/
	top: 50px;/*纵坐标：正值表示向下偏移，负值表示向上偏移*/
~~~

相对定位的定位值：

- left：盒子右移
- right：盒子左移
- top：盒子下移
- bottom：盒子上移

PS：负数表示相反的方向。



#### 相对定位不脱标

也就是说，相对定位的真实位置还在原处。



#### 相对定位的用途

（1）微调元素

（2）做绝对定位的参考，子绝父相



### 绝对定位

定义横纵坐标。原点在父容器的左上角或右下角。

使用格式：

```css
	position: absolute;  /*绝对定位*/
	left: 10px;  /*横坐标*/
	top/bottom: 20px;  /*纵坐标*/
```



#### 绝对定位脱标

因此绝对定位之后，标签就不区分所谓的行内元素、块级元素了，可以直接设置宽、高了。

绝对定位的参考点

（1）如果用**top描述**，那么参考点就是**页面的左上角**，而不是浏览器的左上角

![img](http://img.smyhvae.com/20180115_2120.png)

（2）如果用bottom描述，那么参考点就是浏览器**首屏**窗口尺寸，对应页面的左下角：

![img](http://img.smyhvae.com/20180115_2121.png)



#### 以定位元素为参考点

一个绝对定位的元素，如果**父辈元素中也出现了已定位**（无论是绝对定位、相对定位，还是固定定位）的元素，那么**将以父辈这个元素为参考点**。

如下：（子绝父相）

![img](http://img.smyhvae.com/20180115_2210.png)

注：

1. 以最近的已经定位的祖先元素为参考，不一定是父亲，可能是爷爷：

```css
<div class="box1">        相对定位
	<div class="box2">    没有定位
		<p></p>           绝对定位，将以box1为参考，因为box2没有定位，box1就是最近的父辈元素
	</div>
</div>
```

2. 绝对定位的儿子，无视参考的那个盒子的padding：

![img](http://img.smyhvae.com/20180116_0812.png)





**工程应用**

1. **子绝父相**：这样可以保证父元素没有脱标，子元素脱标，并且在父元素的范围里面移动。于是，工程上经常这样做：

> 父亲浮动，设置相对定位（零偏移），然后让儿子绝对定位一定的距离。



绝对定位非常适合做”压盖“效果。

如下：”多套餐“那个小图以及下方黑色背景的文字都是通过”子绝父相“的方式盖在大海报image上方的。

![img](http://img.smyhvae.com/20180116_1335.png)



2. **让绝对定位的盒子在父元素里居中**

如果想让一个标准流中的盒子在父元素里居中（水平方向看），可以将其设置 margin: 0 auto 属性。

可如果盒子是绝对定位的，此时已经脱标了，如果还想让其居中，可以这样做：

我们先让这个宽度为600px的盒子，左边线居中，然后向左移动宽度（600px）的一半，就达到效果了。

```css
	div {
		width: 600px;
		height: 60px;
		position: absolute;  绝对定位的盒子
		left: 50%;           首先，让左边线居中
		top: 0;
		margin-left: -300px;  然后，向左移动宽度（600px）的一半
	}
```

![img](http://img.smyhvae.com/20180116_1356.png)



### 固定定位

就是相对浏览器窗口进行定位。无论页面如何滚动，这个盒子显示的位置不变。



#### 固定定位的用途

1. 网页右下角的”返回到顶部“

比如我们经常看到的网页右下角显示的“返回到顶部”，就可以固定定位。

```css
	<style type="text/css">
		.backtop{
			position: fixed;
			bottom: 100px;
			right: 30px;
			width: 60px;
			height: 60px;
			background-color: gray;
			text-align: center;
			line-height:30px;
			color:white;
			text-decoration: none;   /*去掉超链接的下划线*/
		}
	</style>
```



2. 顶部导航栏

我们经常能看到固定在网页顶端的导航条，可以用固定定位来做。

需要注意的是，假设顶部导航条的高度是60px，那么，为了防止其他的内容被导航条覆盖，我们要给body标签设置60px的padding-top。



### z-index属性

表示谁压着谁。数值大的压盖住数值小的。

有如下特性：

（1）属性值大的位于上层，属性值小的位于下层。

（2）z-index值没有单位，就是一个正整数。默认的z-index值是0。

（3）如果大家都没有z-index值，或者z-index值一样，那么在HTML代码里谁写在后面，谁就在上层。定位了的元素，永远能够压住没有定位的元素。

（4）只有定位了的元素，才能有z-index值。也就是说，不管相对定位、绝对定位、固定定位，都可以使用z-index值。而**浮动的元素不能用**。

![img](http://img.smyhvae.com/2015-10-03-css-32.png)

![img](http://img.smyhvae.com/2015-10-03-css-33.png)













