

## 跨域问题

**在前后端分离的项目中，实际上会运行在不同的域名上。**

**如果是在本地开发， 前后端也会分别部署在不同的端口。**



这个时候，前端直接请求后端接口，由于浏览器的同源策略的作用，就会出现所谓的跨域问题。浏览器触发保护机制，拦截该请求的响应结果。



如下：前端项目的域名是vue.mayikt.com，浏览器访问这个地址后向api.mayikt.com发送ajax请求，由此出现跨域问题。

![image-20220222103338129](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220222103338129.png)







## JSONP跨域

**原理：利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。**

但是由于`script`、`img`这些带`src`属性的标签，在引入外部资源时，使用的都是`GET`请求。所以`JSONP`也只能使用`GET`发送请求，这也是这种方式已经逐渐被淘汰的原因。



## 代理跨域

代理跨域的实现原理：**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。**

既然跨域问题是浏览器自己的一种保护措施，那么实际上能够通过在前后端之间加一道代理层来变相进行跨域请求。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/17/1685c5bed77e7788~tplv-t2oaga2asx-watermark.awebp)



### nginx反向代理

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/22/170ffd97d0b1cf15~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

+ **正向代理**：一般的访问流程是客户端直接向目标服务器发送请求并获取内容，使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转交请求并获得的内容，再返回给客户端。正向代理隐藏了真实的客户端，为客户端收发请求，使真实客户端对服务器不可见；

  

+ **反向代理**： 与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后将请求转发给内部网络上真正进行处理的服务器，得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器收发请求，使真实服务器对客户端不可见。一般在处理跨域请求的时候比较常用。现在基本上所有的大型网站都设置了反向代理。

  



**使用nginx反向代理实现跨域，是最简单的跨域方式，只需要修改nginx的配置即可解决跨域问题。**支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。



```ini
// 配置 nginx
server {
        listen 80;
        server_name local.test;
        location /api {
            proxy_pass http://localhost:8080;
        }
        location / {
            proxy_pass http://localhost:8000;
        }
}
```





### Node正向代理

在 webpack 中可以通过配置 proxy 来在浏览器和服务端之间添加代理服务器。本质还是代理跨域。

![图片](https://mmbiz.qpic.cn/mmbiz_png/TdGLaSU675g4DAZVKvyibzSibMa3kMOspnV0aLvp2Eu5E9VkvEuf4ZdNXO1tK0Nchib9rBt9651q8ZCqkmaRmCicSA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

通过配置 webpack-dev-server 实现：

```js
module.exports = {
  ...
  output: {...},
  devServer: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:3001"
      }
    }
  },
  plugins: []
};
```



## CORS跨源资源共享

:heavy_exclamation_mark::heavy_exclamation_mark: **跨源资源共享是浏览器同源策略的一道后门，这个机制中服务器必须在 HTTP 响应中显式的标识哪些站点有权通过浏览器访问它的资源。**

事实上，跨域请求的访问有多种解决方案，但是其他解决方案都是浏览器的实现 Bug、或者当前还没有考虑到的问题。在HTTP架构中，推荐的是 CORS 这种做法。

实际上，浏览器又把同源策略下的跨域请求分成两种类型，简单请求和复杂请求。

### **简单请求**

简单请求需要满足下列条件：

1. 请求方法为 GET / POST / HEAD

2. 请求发起时仅能使用 CORS 安全的头部（**四种用于内容协商时的头部**）: 

​		Accept（用来告知（服务器）客户端可以处理的内容类型）、

​		Accept-Language（用来声明客户端可以理解的自然语言）、

​		Content-Language（用于指定页面的目标受众语言方式）、

​		Content-Type

3. `Content-Type`（媒体类型）的值仅限于下列三者之一：
   - `text/plain`
   - `multipart/form-data`
   - `application/x-www-form-urlencoded`



:white_check_mark: 简单请求跨域：

+ 请求携带 Origin 头部告知来自哪个域：如`Origin: https://foo.example`；

+ 服务器返回的响应带上` Access-Control-Allow-Origin `表示允许哪些域；如果 Access-Control-Allow-Origin 允许的域名与当前页面的域名不匹配，服务器就会拦截本次请求的响应结果，并抛出错误。

<img src="https://mmbiz.qpic.cn/mmbiz_png/TdGLaSU675g4DAZVKvyibzSibMa3kMOspnfXZ8x7UDBCzYVMlJ8sETayDz7Lib3Opcicek9b5z1vC0qfiaZWj8VmRzA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" alt="图片" style="zoom: 50%;" />





### 复杂请求

不满足简单请求的条件的请求均为复杂请求。复杂请求必须首先使用 OPTIONS 方法发起一个**预检请求**。以获知服务端是否允许该跨源请求。可以避免跨域请求对服务器的用户数据产生未预期的影响。



非简单请求是那种可能对服务器数据产生副作用的 HTTP 请求方法。比如请求方法是 PUT 、DELETE，或者 POST 请求的 Content-Type 字段的类型是 application/json。

### 预检

:white_check_mark: 预检请求头部：

+ Access-Control-Request-Method 告知服务器接下来的请求会使用哪些方法
+ Access-Control-Request-Headers 告知服务器接下来的请求会传递哪些头部

:white_check_mark: 服务器响应：

+ Access-Control-Allow-Methods 告知客户端后续请求允许使用的方法
+ Access-Control-Allow-Headers 告知客户端后续请求允许携带的头部
+ Access-Control-Max-Age 告知客户端该响应的信息可以缓存多久

![img](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/preflight_correct.png)





## Websocket

这种方式本质没有使用了 HTTP 的响应头, 因此也没有跨域的限制，没有什么过多的解释直接上代码吧。

前端部分

```html
<script>
  let socket = new WebSocket("ws://localhost:8080");
  socket.onopen = function() {
    socket.send("秋风的笔记");
  };
  socket.onmessage = function(e) {
    console.log(e.data);
  };
</script>
```

后端部分

```vbscript
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8080 });
server.on("connection", function(socket) {
  socket.on("message", function(data) {
    socket.send(data);
  });
});
```



