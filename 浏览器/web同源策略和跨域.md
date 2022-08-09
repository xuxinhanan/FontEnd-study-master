

## 跨域问题

在前后端分离的项目中，实际上会运行在不同的域名上。

如果是在本地开发， 前后端也会分别部署在不同的端口。

这个时候，前端直接请求后端接口，由于浏览器的同源策略的作用，就会出现所谓的跨域问题。浏览器触发保护机制，拦截该请求的响应结果。



如下：前端项目的域名是vue.mayikt.com，浏览器访问这个地址后向api.mayikt.com发送ajax请求，由此出现跨域问题。

![image-20220222103338129](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20220222103338129.png)





## 同源策略

![图片](https://mmbiz.qpic.cn/mmbiz_png/TdGLaSU675g4DAZVKvyibzSibMa3kMOspnmNibvAjsvE13fQJicIQmKvvrcDcib1OibkxvIcCXktPTnsxetoaBKbWbhw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)



:heavy_exclamation_mark: **同源是指页面具有相同的协议、域名、端口号，有一项不同就不是同源 。**

-----

浏览器默认两个相同的源之间是可以相互访问资源和操作 DOM 的。两个不同的源之间若想要相互访问资源或者操作 DOM，那么会有一套基础的安全策略的制约。 

具体来讲，同源策略主要表现在以下三个方面：

:one: **DOM 层面**：同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。

:two: **数据层面**：同源策略限制了不同源的站点读取当前站点的 Cookie、indexDB、LocalStorage 等数据。

:three: **网络层面**：不同源，则会发生跨域的问题。浏览器触发保护机制，拦截该请求的响应结果。(如在 A URL 下的页面发起对 B URL的请求，如果 A、B 不同源就会发生跨域问题）





## JSONP跨域

**原理：利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP请求一定需要对方的服务器做支持才可以。**

但是由于`script`、`img`这些带`src`属性的标签，在引入外部资源时，使用的都是`GET`请求。所以`JSONP`也只能使用`GET`发送请求，这也是这种方式已经逐渐被淘汰的原因。



## 代理跨域

代理跨域的实现原理：**同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。**

既然跨域问题是浏览器自己的一种保护措施，那么实际上能够通过在前后端之间加一道代理层来变相进行跨域请求。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/1/17/1685c5bed77e7788~tplv-t2oaga2asx-watermark.awebp)



### nginx反向代理

**反向代理**

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/3/22/170ffd97d0b1cf15~tplv-t2oaga2asx-zoom-in-crop-mark:1304:0:0:0.awebp)

+ **正向代理** 就是客户端向代理服务器发送请求，并且指定目标服务器，之后代理向目标服务器转交并且将获得的内容返回给客户端。服务器并不知道是谁发的请求，比如翻墙。
+ **反向代理** 代理的是服务器，代理会判断请求走向何处，并将请求转交给客户端，客户端只会觉得这个代理是一个真正的服务器。Nginx就是性能非常好的反向代理服务器，用来做负载均衡。



使用nginx反向代理实现跨域，是最简单的跨域方式。只需要修改nginx的配置即可解决跨域问题，支持所有浏览器，支持session，不需要修改任何代码，并且不会影响服务器性能。





### Webpack Server代理

在 webpack 中可以通过配置 proxy 来在浏览器和服务端之间添加代理服务器。本质还是代理跨域。

![图片](https://mmbiz.qpic.cn/mmbiz_png/TdGLaSU675g4DAZVKvyibzSibMa3kMOspnV0aLvp2Eu5E9VkvEuf4ZdNXO1tK0Nchib9rBt9651q8ZCqkmaRmCicSA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

可在前端`webpack.config.js`配置代理：

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

> :heavy_exclamation_mark::heavy_exclamation_mark: **跨源资源共享是浏览器同源策略的一道后门，这个机制允许服务器标识哪些源站有权通过浏览器访问它的资源。**



客户端发起跨源请求时标记自己的源：如`Origin: https://foo.example`；服务器返回的响应带上 Access-Control-Allow-Origin 服务器用来声明哪些源站有权通过浏览器访问资源；如果响应头没有 Access-Control-Allow-Origin 字段，服务器就会拦截本次请求的响应结果，并抛出错误。



发送请求时出现两种情况，分别为简单请求和复杂请求。

### **简单请求**

不会触发 CORS 预检请求视为简单请求。需要满足下列条件：

1. 请求方法为 GET、POST 、HEAD



2. 请求头可以设置的字段: 

​		Accept（用来告知（服务器）客户端可以处理的内容类型）、

​		Accept-Language（用来声明客户端可以理解的自然语言）、

​		Content-Language（用于指定页面的目标受众语言方式）、

​		Content-Type (POST 请求提交的内容编码类型限制为名称/值对，或者一条消息，或者纯文本三者方式)



3. 请求中的任意 XMLHttpRequest 对象均没有注册任何事件监听器



:white_check_mark: 响应：

~~~
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2
Access-Control-Allow-Origin: *  声明哪些源站有权通过浏览器访问资源
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml
~~~



<img src="https://mmbiz.qpic.cn/mmbiz_png/TdGLaSU675g4DAZVKvyibzSibMa3kMOspnfXZ8x7UDBCzYVMlJ8sETayDz7Lib3Opcicek9b5z1vC0qfiaZWj8VmRzA/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1" alt="图片" style="zoom: 50%;" />





### **非简单请求**

不满足简单请求的条件的请求即为非简单请求。非简单请求是那种可能对服务器数据产生副作用的 HTTP 请求方法。比如请求方法是 PUT 、DELETE，或者 POST 请求的 Content-Type 字段的类型是 application/json。这时浏览器必须首先使用 OPTIONS 方法发起一个**预检请求**，以获知服务端是否允许该跨源请求。可以避免跨域请求对服务器的用户数据产生未预期的影响。



### 预检

:white_check_mark: 预检请求：

~~~
OPTIONS /doc HTTP/1.1    使用 OPTIONS 方法发起预检请求
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
~~~

:white_check_mark: 服务器响应：

```
HTTP/1.1 204 No Content
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
```