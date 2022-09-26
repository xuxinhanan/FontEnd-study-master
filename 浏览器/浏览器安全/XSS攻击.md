> XSS（Cross Site Scripting）“跨站脚本”，是指 **黑客往 HTML 文件中或者 DOM 中注入恶意脚本，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。**



如果页面被注入了恶意 JavaScript 脚本，恶意脚本能做以下几件事情：

+ **可以窃取 Cookie 信息。**恶意 JavaScript 可以通过“document.cookie”获取 Cookie 信息，然后通过 XMLHttpRequest 或者 Fetch 加上 CORS 功能将数据发送给恶意服务器；恶意服务器拿到用户的 Cookie 信息之后，就可以在其他电脑上模拟用户的登录，然后进行转账等操作。
+ 可以**监听用户行为。**恶意 JavaScript 可以使用“addEventListener”接口来监听键盘事件，比如可以获取用户输入的信用卡等信息，将其发送到恶意服务器。黑客掌握了这些信息之后，又可以做很多违法的事情。
+ 可以通过**修改 DOM** 伪造假的登录窗口，用来欺骗用户输入用户名和密码等信息。
+ 还可以**在页面内生成浮窗广告**，这些广告会严重地影响用户体验。

------

## 恶意脚本注入方式

通常情况下，主要有**存储型 XSS 攻击**、**反射型 XSS 攻击** 和 **基于 DOM 的 XSS 攻击**三种方式来注入恶意脚本。

### 1. 持久型 XSS 攻击

将脚本植入到服务器上，从而导致每个访问的用户都会执行。

常见的场景是留言评论区提交一段脚本代码，如果前后端没有做好转义的工作，那评论内容存到了数据库，在页面渲染过程中直接执行, 相当于执行一段未知逻辑的 JS 代码。



### 2. 非持久型 XSS 攻击

对用户某url参数进行攻击。恶意脚本是通过作为网络请求的参数，经过服务器，然后再反射到HTML文档中，并解析执行。

比如：http://baidu.com?q=<script>alert("你完蛋了")</script>



--------

## 阻止 XSS 攻击

1. 服务器对输入脚本进行过滤或转码

### 2.使用 HttpOnly 属性

由于很多 XSS 攻击都是来盗用 Cookie 的，因此可以通过使用 HttpOnly 属性来保护 Cookie 的安全。

服务器通过 HTTP 响应头来设置 HttpOnly：

~~~http
set-cookie: NID=189=M8q2FtWbsR8RlcldPVt7qkrqR38LmFY9jUxkKo3-4Bi6Qu_ocNOat7nkYZUTzolHjFnwBw0izgsATSI7TZyiiiaV94qGh-BzEYsNVa7TZmjAYTxYTOM9L_-0CN9ipL6cXi8l6-z41asXtm2uEwcOC5oh9djkffOMhWqQrlnCtOI; expires=Sat, 18-Apr-2020 06:52:22 GMT; path=/; domain=.google.com; HttpOnly
~~~

在cookie中设置 HttpOnly 属性后， js 脚本无法读取到 cookie 信息。

