**CSS 过渡的理念非常简单，我们只需要定义某一个属性以及如何动态地表现其变化。当属性变化时，浏览器将会绘制出相应的过渡动画。**

也就是说：**我们只需要改变某个属性( css )，然后所有流畅的动画都由浏览器生成。**



------

CSS 提供了四个属性来描述一个过渡：

- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`

--------

## [transition-property](https://zh.javascript.info/css-animations#transitionproperty)

在 `transition-property` 中我们可以列举要设置动画的所有属性，如：`left、margin-left、height `和`color`。

不是所有的 CSS 属性都可以使用过渡动画，但是它们中的 **大多数** 都是可以的。`all` 表示应用在所有属性上。

## [transition-duration](https://zh.javascript.info/css-animations#transitionduration)

`transition-duration` 允许我们指定动画持续的时间。时间的格式参照 [CSS 时间格式](http://www.w3.org/TR/css3-values/#time)：单位为秒 `s` 或者毫秒 `ms`。

## [transition-timing-function](https://zh.javascript.info/css-animations#transitiontimingfunction)

时间函数描述了动画进程在时间上的分布。它是先慢后快还是先快后慢？

这个属性接受两种值：一个贝塞尔曲线（Bezier curve）或者阶跃函数（steps）。我们先从贝塞尔曲线开始，这也是较为常用的。

CSS 中设置一贝塞尔曲线的语法为：`cubic-bezier(x2, y2, x3, y3)`。这里我们只需要设置第二个和第三个值，因为第一个点固定为 `(0,0)`，第四个点固定为 `(1,1)`。

为了方便，CSS 提供几条内建的曲线：`linear`、`ease`、`ease-in`、`ease-out` 和 `ease-in-out`。他们分别是以下贝塞尔曲线的简写：

| `ease`*                  | `ease-in`             | `ease-out`          | `ease-in-out`          |
| :----------------------- | :-------------------- | :------------------ | :--------------------- |
| `(0.25, 0.1, 0.25, 1.0)` | `(0.42, 0, 1.0, 1.0)` | `(0, 0, 0.58, 1.0)` | `(0.42, 0, 0.58, 1.0)` |

-----------

例子：设置偏移动画

~~~htmL
<!doctype html>
<html>

<head>
  <meta charset="UTF-8">
  <style>
    #digit {
    width: .5em;
    overflow: hidden;
    font: 32px monospace;
    cursor: pointer;
    }

    #stripe {
    display: inline-block;
    }

    #stripe.animate {
    transform: translate(-90%);
    transition-property: transform;
    transition-duration: 9s;
    transition-timing-function: linear;
    }
  </style>
</head>

<body>

  Click below to animate:

  <div id="digit"><div id="stripe">0123456789</div></div>

  <script>
    stripe.onclick = function() {
        stripe.classList.add('animate');
    };
  </script>
</body>

</html>
~~~









