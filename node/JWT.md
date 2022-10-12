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





---------------

## Token 认证的优势

1. 无状态
2. 有效避免了 CSRF 攻击(一般会选择存放在 local storage 中。然后我们在前端通过某些方式会给每个发到后端的请求加上这个 token,这样就不会出现 CSRF 漏洞的问题。因为，即使你点击了非法链接发送了请求到服务端，这个非法请求是不会携带 token 的，所以这个请求将是非法的。)
3. 适合移动端应用
4. 单点登录友好



----------------

## Token 认证常见问题以及解决办法

### JWT被篡改的问题

![image-20221012163910696](C:\Users\64554\AppData\Roaming\Typora\typora-user-images\image-20221012163910696.png)

### 注销登录等场景下 token 在 expiredTime 之前还有效，怎么办？

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



### 修改密码场景下 token 还有效，怎么办？

1. 对于修改密码后 token 还有效问题的解决还是比较容易的，说一种我觉得比较好的方式：`使用用户的密码的哈希值对 token 进行签名`。因此，如果密码更改，则任何先前的令牌将自动无法验证。

2. 加入时间戳校验，记录修改密码的时间并与 token 签发的时间（默认情况下 payload 也会携带令牌的签发时间`iat`）比较

   ~~~js
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

   

### token 的续签问题

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

----------

JWT 最适合的场景是不需要服务端保存用户状态的场景，`如果考虑到 token 注销和 token 续签的场景`话，没有特别好的解决方案，`大部分解决方案都给 token 加上了状态，这就有点类似 Session 认证了。`

[^1]: 在 Session 认证方式中，遇到这种情况的话服务端`删除对应的 Session 记录即可`。
[^2]: Session 认证中一般的做法：假如 session 的有效期 30 分钟，如果 30 分钟内用户有访问，就把 session 有效期延长 30 分钟。

