### 为什么v-if和v-for不能同时使用？



在**vue2中**，**v-for的优先级是高于v-if**，把它们放在一起，输出的渲染函数中可以看出会先执行循环再判断条件，哪怕我们只渲染列表中一小部分元素，也得在每次重渲染的时候遍历整个列表，这会比较浪费；

另外需要注意的是在**vue3中则完全相反，v-if的优先级高于v-for**，所以 v-if 执行时，它调用的变量还不存在，就会导致异常。


![image-20220210104854185](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c265563dcbf4dbab2b889ac72d8f654~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

