#### RESTful架构

原则：

1. ==将API划分成逻辑资源==
2. ==暴露API，通过结构化的、基于资源的url进行访问==
3. ==对资源进行CRUD操作时，API应该使用正确的HTTP方法而不是URL==
4. ==发送给客户端的数据应该是JSON格式==
5. ==服务器端无状态==



rest 需要抽象资源，将我们想分享的所有数据资源划分成逻辑资源API（例如聊天室项目中的聊天记录数据messages）



对资源进行CRUD操作时，API应该使用正确的HTTP方法而不是URL。例如：

| bad API            | Good API                     |            |
| ------------------ | ---------------------------- | ---------- |
| /addNewTour        | POST        /tours           | Create操作 |
| /getTour           | GET           /tours/7       | Read操作   |
| /updateTour        | PUT           /tours/7       | Update操作 |
|                    | PATCH      /tours/7          |            |
| /deleteTour        | DELETE     /tours/7          | Delete操作 |
|                    |                              |            |
| /getToursByUser    | GET           /users/3/tours |            |
| /deleteToursByUser | DELETE     /users/3/tours/9  |            |



以JSend形式发送数据给客户端：

### ![image-20221017133357721](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221017133357721.png)

API返回的数据格式不推荐使用纯文本，而应该返回标准化的结构化数据，如JSON格式的数据。因此，在服务器响应的HTTP头中，将Content-Type的属性设为application/json。

当然，客户端请求时也要明确告诉服务器可以接受JSON数据的格式，即在请求的HTTP头中将ACCEPT属性设为application/json。









[^1]: 一个对象或某物的表示，并有一些与之相关的数据。（比如文章、评论等）。因此，所有可以命名的数据都可以是资源。









