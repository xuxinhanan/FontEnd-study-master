

## JWT鉴权

**允许登录用户访问受保护的非登录用户无法访问的路由。**

优势：

+ 简单
+ 无状态，不需要在服务端存储状态（契合RESTfulAPI，因为RESTfulAPI也是无状态的）[^4]



==JWT必须通过HTTPS通信，否则任何人都可以窃取到JWT。==

==JWT设置过期时间，作为用户注销一段时间后的安全措施。[^5]==



==JWT只存储在设置了 HTTPOnly 的 COOKIE 中。目的是防止XSS攻击==





## 存储方式

+ 存储在localStorage中：每次请求需要添加头部Authorization进行传递，**这种存储方式有效避免了 CSRF 攻击**（因为，即使你点击了非法链接发送了请求到服务端，这个非法请求是不会携带 token 的，所以这个请求将是非法的）

+ 存储在cookie中：每次访问接口url后，浏览器自动带上cookie，因此jwt自动发送，后端只需要解析cookie拿到jwt即可，**这种存储方式有效避免了 XSS 攻击**（黑客将脚本注入我们的页面以运行他的恶意代码，而黑客脚本可以读取本地存储。这就是为什么我们应该将JWT存储在COOKIE中，而不是存储在localStorage）



## 什么是JWT



JWT实际上是一个编码字符串，由三部分组成：header、payload（我们编码进JWT的数据）、验证签名。









## JWT使用方式

一、登陆：服务端验证身份，根据算法，将用户标识符打包生成 token, 并且返回给浏览器

~~~
登录具体流程如下：
1.检查账号是否存在
2.账号存在&&检查密码是否正确
3.创建jwt并发送给客户端
~~~

二、访问JWT保护的资源：浏览器发起请求获取用户资料，把刚刚拿到的 token 一起发送给服务器
服务器发现数据中有 token，验明正身后服务器返回该用户的用户资料

~~~
访问JWT保护的资源的流程如下：
1.从请求头的authorization中获取token
2.检查token
3.检查用户是否存在（针对用户的帐户被删除的场景）
4.检查密码是否被修改（针对修改密码的场景）
~~~

![image-20221012154517423](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221012154517423.png)



~~~js
exports.protect = catchAsync(async (req, res, next) => {
  // 1.从请求头的authorization中获取token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2.检查token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) 检查用户是否存在（针对用户的帐户被删除的场景）
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) 检查密码是否被修改（针对修改密码的场景）
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});
~~~







----------------

## Token 认证常见问题

### 1.JWT被篡改的问题

![image-20221012163910696](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221012163910696.png)



### 2.修改密码场景下 token 还有效的问题

加入时间戳校验，记录修改密码的时间并与 token 签发的时间（默认情况下 payload 也会携带令牌的签发时间`iat`）比较[^3]

~~~~
具体流程：
1.在修改密码后保存数据库的逻辑中加入前置钩子
2.前置钩子中保存修改密码的时间（该数据默认不存在）
3.然后在访问受jwt保护的接口时，通过比较jwt签发时间和密码修改时间（如果存在）来判断token是否有效
4.无效则需要重新登录
~~~~



~~~js
if (currentUser.changedPasswordAfter(decoded.iat)) {
  return next(
    new AppError('用户最近更改了密码！请重新登录。', 401)
  );
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};
~~~



















### 3.注销登录等场景下 token 还有效的问题

与之类似的具体相关场景有：
退出登录;
服务端修改了某个用户具有的权限或者角色；
用户的帐户被删除/暂停。
用户由管理员注销；

-----

退出登录的时候，一般都是前端删掉保存的 token 即可，但这这意味着这个token其实还是可以用的，一旦泄露就很危险了，此时我们应该如何处理呢？要知道`token 一旦派发出去，如果后端不增加其他逻辑的话，它在失效之前都是有效的。`

此时就需要借助第三方的方式 —— redis，来让token“过期”[^1]。



1. **redis 黑名单机制**

   **注销登录时**，缓存JWT至Redis，且 **缓存有效时间设置为JWT的有效期**，请求资源时判断是否存在缓存的黑名单中，存在则拒绝访问。

2. **redis 白名单机制**

   把JWT存到**Redis中**。注销时，从缓存移除JWT。请求资源添加判断JWT在缓存中是否存在，不存在拒绝访问。

   但是，这样会导致每次使用 token 发送请求都要先从数据库中查询 token 是否存在的步骤，而且违背了 JWT 的无状态原则。

   

白名单和黑名单的实现逻辑差不多，但黑名单**不需每次登录**都将JWT缓存，仅仅在**某些特殊场景下**需要缓存JWT，给服务器带来的压力要**远远小于**白名单的方式。

> 只有主动注销的场景下，才需要缓存JWT 其他情况下如token自动过期，都不需要

黑名单机制，巧妙的解决了存储的问题，而且存储量是远远小于，大多数情况下，登录状态都是token自动过期了，而不是用户主动注销。因此，相比之下黑名单更讨喜~



### 4.token 的续签问题

假设 token 过期，但此时用户正在提交重要信息，填了一大堆信息，按下按钮时，后台拦截器发现token过期，告知前端，前端直接退回登录页，那这次提交就相当于无效了，还得登录后重新填一遍。[^2]



1. 快过期了返回新的token

   类似于 Session 认证中的做法：这种方案满足于大部分场景。假设服务端给的 token 有效期设置为 30 分钟，服务端每次进行校验时，`如果发现 token 的有效期马上快过期了，服务端就重新生成 token 给客户端`。客户端每次请求都检查新旧 token，如果不一致，则更新本地的 token。这种做法的问题是仅仅在快过期的时候请求才会更新 token ,对客户端不是很友好。

   

2. refreshToken刷新机制

   用户登录返回两个 token：第一个是 acessToken ，它的过期时间比较短，比如是1天；另外一个是 refreshToken 它的过期时间更长一点，可以是accessToken的2倍：2天。

   客户端登录后，将 accessToken 和 refreshToken 保存在本地，每次访问将 accessToken 传给服务端。服务端校验 accessToken 的有效性，

   如果过期的话，就将 refreshToken 传给服务端。如果有效，服务端就生成新的 accessToken 给客户端。否则，客户端就重新登录即可。

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/37afd0d62b7b449abad1143b5af015b6~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

该方案的不足是：

1. 需要客户端来配合；
2. 用户注销的时候需要同时保证两个 token 都无效；
3. 重新请求获取 token 的过程中会有短暂 token 不可用的情况（可以通过在**客户端设置定时器**，当 accessToken 快过期的时候，提前去通过 refreshToken 获取新的 accessToken）。



#### 客户端配合refresh机制

~~~js
// 客户端的请求拦截器中添加逻辑：如果accesstoken失效则调用refreshtoken接口，拿到最新的token后重发请求
instance.interceptors.response.use(response => {
    return response
}, error => {
    if (!error.response) {
        return Promise.reject(error)
    }
    if (error.response.status === 401) {
        const { config } = error
        return refreshToken().then(res=> {
            const { access_token } = res.data
            setToken(access_token)
            config.headers.Authorization = `Bearer ${access_token}`
            return instance(config)
        }).catch(err => {
            console.log('抱歉，您的登录状态已失效，请重新登录！')
            return Promise.reject(err)
        })
    }
    return Promise.reject(error)
})
~~~













----------

JWT 最适合的场景是不需要服务端保存用户状态的场景，如果考虑到 token 注销和 token 续签的场景话，没有特别好的解决方案，大部分解决方案都给 token 加上了状态，这就有点类似 Session 认证了。























[^1]: 在 Session 认证方式中，遇到这种情况的话服务端`删除对应的 Session 记录即可`。
[^2]: Session 认证中一般的做法：假如 session 的有效期 30 分钟，如果 30 分钟内用户有访问，就把 session 有效期延长 30 分钟。

[^3]: 另一种方式：`使用用户的密码的哈希值对 token 进行签名`。因此，如果密码更改，则任何先前的令牌将自动无法验证。

[^4]: 用户登录之后不会在服务器上留下任何状态，服务器实际上不会知道哪些用户登录过。但是用户知道，因为他有了JWT（就像访问受保护部分的护照）
[^5]: 如果不给token设置过期时间，意味着将永久有该用户资源的访问权限，从安全性角度其实不是很好

