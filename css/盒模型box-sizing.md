#  box-sizing

语法：

> ```css
> box-sizing: content-box|border-box|inherit;
> ```

## CSS盒子模型

当对一个文档进行布局的时候，浏览器的渲染引擎会根据标准之一的CSS基础框盒模型，**将所有元素表示为一个个矩形的盒子。**

一个盒子由四个部分组成：content、padding、border、margin

![image-20211130231358888](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211130231358888.png)



## content-box —— 标准盒子模型，不包内边距和边框

![](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211130231335761.png)



- 盒子总宽度 = width + padding + border + margin;
- 盒子总高度 = height + padding + border + margin

`width/height` 只是内容高度，不包含 `padding` 和 `border`值。

## border-box——怪异盒子模型，包含内边距和边框

![image-20211130231951349](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20211130231951349.png)



- 盒子总宽度 = width + margin;
- 盒子总高度 = height + margin;

`width/height` 包含了 `padding`和 `border`值。