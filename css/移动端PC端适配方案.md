根据用户设备不同返回不同样式的站点，**以前经常使用的是纯前端的自适应布局，但无论是复杂性和易用性上面还是不如分开编写的好**，比如我们常见的淘宝、京东......这些大型网站就都没有采用自适应，而是用分开制作的方式，根据用户请求的 `user-agent` 来判断是返回 PC 还是 H5 站点。

----------



首先在 `/usr/share/nginx/html` 文件夹下 `mkdir` 分别新建两个文件夹 `PC` 和 `mobile`，`vim` 编辑两个 `index.html` 随便写点内容。

```bash
cd /usr/share/nginx/html
mkdir pc mobile
cd pc
vim index.html   # 随便写点比如 hello pc!
cd ../mobile
vim index.html   # 随便写点比如 hello mobile!
复制代码
```

然后和设置二级域名虚拟主机时候一样，去 `/etc/nginx/conf.d` 文件夹下新建一个配置文件 `fe.sherlocked93.club.conf` ：

```nginx
# /etc/nginx/conf.d/fe.sherlocked93.club.conf

server {
  listen 80;
	server_name fe.sherlocked93.club;

	location / {
		root  /usr/share/nginx/html/pc;
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPod|BlackBerry)') {
      root /usr/share/nginx/html/mobile;
    }
		index index.html;
	}
}
```

配置基本没什么不一样的，主要多了一个 `if` 语句，然后使用 `$http_user_agent` 全局变量来判断用户请求的 `user-agent`，指向不同的 root 路径，返回对应站点。

在浏览器访问这个站点，然后 F12 中模拟使用手机访问：

![62haogU3DtwMRiZ](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/29/171c4e97062c5124~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

可以看到在模拟使用移动端访问的时候，Nginx 返回的站点变成了移动端对应的 html 了。

