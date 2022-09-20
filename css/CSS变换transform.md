变换包括`2D变换`与`3D变换`。`2D变换`在平面中操作，`3D变换`在空间中操作。变换可理解为将 DOM 节点复制一份并生成新图层，原节点隐藏，在新图层中使用新的 DOM 节点进行变换操作。



---------

### 2D、3D切换

声明`transform-style`可实现`2D变换`与`3D变换`间的切换，`transform-style`在父节点中声明，即发生变换的节点的父节点。

-  **flat**：所有变换效果在平面中呈现(`默认`)
-  **preserve-3d**：所有变换效果在空间中呈现

-------------

### transform 的五大函数值

`transform`包括五大函数，每个函数包括以下参数。



#### translate()：位移

- 默认：XYZ轴不声明默认是`0`
- 单位：`Length`长度，可用任何长度单位，允许负值
- 正值：沿X轴向右位移/沿Y轴向上位移/沿Z轴向外位移
- 负值：沿X轴向左位移/沿Y轴向下位移/沿Z轴向内位移
- 函数：
  -  **translate(x,y)**：2D位移
  -  **translate3d(x,y,z)**：3D位移
  -  **translateX(x)**：X轴位移，等同于`translate(x,0)`或`translate3d(x,0,0)`
  -  **translateY(y)**：Y轴位移，等同于`translate(0,y)`或`translate3d(0,y,0)`
  -  **translateZ(z)**：Z轴位移，等同于`translate3d(0,0,z)`



#### scale()：缩放

- 默认：XYZ轴不声明默认是`1`或`100%`
- 单位：`Number`数值或`Percentage`百分比，允许负值
- 正值：`0<(x,y,z)<1`沿X轴缩小/沿Y轴缩小/沿Z轴变厚，`(x,y,z)>1`沿X轴放大/沿Y轴放大/沿Z轴变薄
- 负值：`-1<(x,y,z)<0`翻转沿X轴缩小/沿Y轴缩小/沿Z轴变厚，`(x,y,z)<-1`翻转沿X轴放大/沿Y轴放大/沿Z轴变薄
- 函数：
  -  **scale(x,y)**：2D缩放
  -  **scale3d(x,y,z)**：3D缩放
  -  **scaleX(x)**：X轴缩放，等同于`scale(x,1)`或`scale3d(x,1,1)`
  -  **scaleY(y)**：Y轴缩放，等同于`scale(1,y)`或`scale3d(1,y,1)`
  -  **scaleZ(z)**：Z轴缩放，等同于`scale3d(1,1,z)`



#### rotate()：旋转

- 默认：XYZ轴不声明默认是`0`
- 单位：`Angle`角度或`Turn`周
- 正值：2D旋转时顺时针旋转
- 负值：2D旋转时逆时针旋转
- 函数：
  -  **rotate()**：2D旋转
  -  **rotate3d(x,y,z,a)**：3D旋转，`[x,y,z]`是一个向量，数值都是`0~1`
  -  **rotateX(a)**：X轴旋转，等同于`rotate(1,0,0,a)`，正值时沿X轴向上逆时针旋转，负值时沿X轴向下顺时针旋转
  -  **rotateY(a)**：3D Y轴旋转，等同于`rotate(0,1,0,a)`，正值时沿Y轴向右逆时针旋转，负值时沿Y轴向左顺时针旋转
  -  **rotateZ(a)**：3D Z轴旋转，等同于`rotate(0,0,1,a)`，正值时沿Z轴顺时针旋转，负值时沿Z轴逆时针旋转



#### skew()：扭曲

- 默认：XY轴不声明默认是`0`
- 单位：`Angle`角度或`Turn`周
- 正值：沿X轴向左扭曲/沿Y轴向下扭曲
- 负值：沿X轴向右扭曲/沿Y轴向上扭曲
- 函数：
  -  **skew(x,y)**：2D扭曲
  -  **skewX(x)**：X轴扭曲，等同于`skew(x,0)`
  -  **skewY(y)**：Y轴扭曲，等同于`skew(0,y)`

 



#### perspective()：视距

- 默认：`0`
- 单位：`Length`长度，可用任何长度单位