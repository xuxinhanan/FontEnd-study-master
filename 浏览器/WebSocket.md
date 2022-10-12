## [建立 WebSocket](https://zh.javascript.info/websocket#jian-li-websocket)

当 `new WebSocket(url)` 被创建后，它将立即开始连接。

在连接期间，浏览器（使用 header）问服务器：“你支持 WebSocket 吗？”如果服务器回复说“我支持”，那么通信将以 WebSocket 协议进行。

![image-20221012133917884](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221012133917884.png)

`new WebSocket("wss://javascript.info/chat")` 发出的请求的浏览器 header 示例。

~~~
GET /chat
Host: javascript.info
Origin: https://javascript.info
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Key: Iv8io/9s+lYFgZWcXczP8Q==
Sec-WebSocket-Version: 13
~~~



## [聊天示例](https://zh.javascript.info/websocket#liao-tian-shi-li)



在前端中，我们主要做三件事：

1. 打开连接。
2. 在表单提交中 —— `socket.send(message)` 用于消息。
3. 对于服务器推送的消息 —— 将其附加到页面上。





在后端中，我们主要做三件事：

1. 创建 `clients = new Set()` —— 一系列 socket。

2. 对于每个被接受的 WebSocket，将其添加到 `clients.add(socket)`集合中，并为其设置 `message` 事件侦听器以获取其消息。

3. 当接收到消息：遍历客户端，并将消息发送给所有人。

   









