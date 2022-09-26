

有时在不同状态间 **"切换属性"** 会显得很生硬，此时 `transition` 就派上用场了，它能让状态间的切换变得更丝滑。

transition 的理念非常简单，我们只需要定义某一个属性以及如何动态地表现其变化。当属性变化时，浏览器将会绘制出相应的过渡动画。

也就是说：给属性设置了 transition 后，我们改变属性，然后所有流畅的动画都由浏览器生成。



------

transition 属性是一个简写属性，用于设置四个过渡属性：

- `transition-property`
- `transition-duration`
- `transition-timing-function`
- `transition-delay`

**注释：**请始终设置 `transition-duration` 属性，否则时长为 0，就不会产生过渡效果。

| 默认值：          | all 0 ease 0                         |
| ----------------- | ------------------------------------ |
| 继承性：          | no                                   |
| 版本：            | CSS3                                 |
| JavaScript 语法： | *object*.style.transition="width 2s" |

--------

## transition-property：属性

- `all`：全部属性过渡 ( `默认` ) (`表示应用在所有属性上`)
- `String`：某个属性过渡（如：`left、margin-left、height `和`color`)
- `none`：无属性过渡

`transition-property` 用来指定需要过渡动画的属性。

----------

## transition-duration：持续时间

- `Time`：单位是秒或毫秒 (默认`0`)

`transition-duration` 允许我们指定动画持续的时间。

------------------

## transition-timing-function：缓动函数

- `ease`：逐渐变慢，等同于`cubic-bezier(.25,.1,.25,1)`(`默认`)
- `linear`：匀速，等同于`cubic-bezier(0,0,1,1)`
- `ease-in`：加速，等同于`cubic-bezier(.42,0,1,1)`
- `ease-out`：减速，等同于`cubic-bezier(0,0,.58,1)`
- `ease-in-out`：先加速后减速，等同于`cubic-bezier(.42,0,.58,1)`
- `cubic-bezier`：贝塞尔曲线，`(x1,y1,x2,y2)`四个值指定曲线中的点`P1`与`P2`，所有值需在`[0,1]`区域内

---------------

## **transition-delay**：等待时间

- `Time`：单位是秒或毫秒(默认`0`)



----------------

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









