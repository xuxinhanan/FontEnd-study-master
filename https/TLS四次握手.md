## 对称加密+非对称加密=安全层四次握手

![img](https://static001.geekbang.org/resource/image/77/af/77c852ff2202b2b7bb3299a96a0f4aaf.png?wh=1668*1160)



加密流程是这样的：

### :white_check_mark: 第一次握手

在 TCP 建立连接之后，浏览器会首先发一个“Client Hello”消息，也就是跟服务器“打招呼”。里面有**TLS版本号**、**支持的密码套件列表**[^1]，还有一个**随机数 Client Random**，用于后续生成会话密钥。

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/https/clienthello.png)

------

### :white_check_mark:第二次握手

服务器保存随机数 client-random，选择对称加密和非对称加密的套件，然后生成随机数 service-random，向浏览器发送选择的加密套件、service-random 和数字证书；

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/https/serverhello.png)

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/https/certificate.png)

------

### :heavy_exclamation_mark: 浏览器验证数字证书

详情见另一文档。

--------

### :white_check_mark: 第三次握手

并生成随机数 pre-master，然后利用公钥对 pre-master 加密，并向服务器发送加密后的数据；

![img](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost4@main/%E7%BD%91%E7%BB%9C/https/clietnkeyexchange.png)

-------

### :white_check_mark: 第四次握手

最后服务器拿出自己的私钥，解密出 pre-master 数据，并返回确认消息。



----------



到此为止，服务器和浏览器就有了共同的 client-random、service-random 和 pre-master，**然后服务器和浏览器会使用这三组随机数生成对称密钥**，因为服务器和浏览器使用同一套方法来生成密钥，所以最终生成的密钥也是相同的。

有了对称加密的密钥之后，双方就可以使用对称加密的方式来传输数据了。

需要特别注意的一点，**pre-master 是经过公钥加密之后传输的，所以黑客无法获取到 pre-master，这样黑客就无法生成密钥，也就保证了黑客无法破解传输过程中的数据了。**



[^1]: 这里的加密套件是指加密的方法，加密套件列表就是指浏览器能支持多少种加密方法列表。
