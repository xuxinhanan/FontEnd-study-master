HTTP 有以下安全性问题：

- 使用明文进行通信，内容可能会被窃听；（**信息加密**）
- 无法证明报文的完整性，报文有可能遭篡改（**校验机制**）
- 不验证通信方的身份，通信方的身份有可能遭遇伪装（**身份证书**）



### HTTPS

HTTPS 并不是新协议，而是让 HTTP 先和 SSL（Secure Sockets Layer）通信，再由 SSL 和 TCP 通信。

通过使用 SSL，HTTPS 具有了**「加密」**（防窃听）、**「认证」**（防伪装）和**「完整性保护」**（防篡改）。

![img](https://cs-notes-1256109796.cos.ap-guangzhou.myqcloud.com/ssl-offloading.jpg)

### HTTPS 的缺点

- 因为需要进行加密解密等过程，因此速度会更慢
- 需要支付证书授权的高额费用

