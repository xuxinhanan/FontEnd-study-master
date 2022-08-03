### MVC

MVC 模式，将数据和视图进行分离，在涉及到一些复杂的项目时，能够大大减轻项目的耦合度，使得程序易于维护。

![img](https://static001.geekbang.org/resource/image/4c/a6/4c03b5882878dcce2df01c1e2e8db8a6.png?wh=1142*617)



通过上图可以发现，MVC 的整体结构由模型、视图和控制器组成，**其核心思想就是将数据和视图分离**，也就是说视图和模型之间是不允许直接通信的，它们之间的通信都是通过控制器来完成的。

通常情况下的通信路径是视图发生了改变，然后通知控制器，控制器再根据情况判断是否需要更新模型数据。

当然还可以根据不同的通信路径和控制器不同的实现方式，基于 MVC 又能衍生出很多其他的模式，如 MVP、MVVM 等，不过万变不离其宗，它们的基础骨架都是基于 MVC 而来。



### MVVM

MVVM 是 Model-View-ViewModel 缩写，**也就是把 MVC 中的 Controller 演变成 ViewModel（Vue 对象 就是 ViewModel）**。

+ Model 层代表数据模型
+ View 代表 UI 组件
+ ViewModel 是 View 和 Model 层的桥梁，数据会绑定到 viewModel 层并自动将数据渲染到页面中，视图变化的时候会通知 viewModel 层更新数据，达到数据的双向绑定



### MVC 和 MVVM 区别

MVC 的思想：一句话描述就是 Controller 负责将 Model 的数据用 View 显示出来，换句话说就是在 Controller 里面把 Model 的数据赋值给 View，解耦。

MVVM 与 MVC 最大的区别就是：**它实现了 View 和 Model 的自动同步，也就是当 Model 的属性改变时，我们不用再自己手动操作 Dom 元素，来改变 View 的显示，而是改变属性后该属性对应 View 层显示会自动改变**（对应 Vue 数据驱动的思想）



为什么官方要说 Vue 没有完全遵循 MVVM 思想呢？
严格的 MVVM 要求 View 不能和 Model 直接通信，而 Vue 提供了$refs 这个属性，让 Model 可以直接操作 View，违反了这一规定，所以说 Vue 没有完全遵循 MVVM。