# mean
  一个由 mongodb,express,angularjs,nodejs搭建的一个全栈项目，

**项目中用到了豆瓣电影 Api, 更多 Api请见 [豆瓣Api文档](https://developers.douban.com/wiki/?title=api_v2)**

**安装依赖**

Node.js 转发请求用到了 `express`和`superagent`. [superanget](https://github.com/visionmedia/superagent)是一个 Node.js HTTP client。
操作mongdb用的是moogose,项目前端部分用angular搭建了一个SPA网站，
```
npm install --save
```

**定义接口**

根据前端所需，定义了如下接口：
```moongose接口，获取全部人员
    router.route('/getAllPerson')
    // get all the bears (accessed at GET http://localhost:8080/api/bears)
        .post(function (req, res) {
            Person.find(function (err, Persons) {
                if (err)
                    res.send(err);

                res.json({
                    message: '获取全部成功!',
                    status: true,
                    data: Persons
                });
            });
        });
```代理转发豆瓣接口，正在热映
    router.route('/movie/in_theaters').get(function (req, res) {
            var originalUrl = req.originalUrl.replace("/api","");
            var sreq = request.get(Setting.proxyHOST + originalUrl);
            sreq.pipe(res);
            sreq.on('end', function (error, res) {
                console.log('请求in_theaters成功');
            });
        })
```

**CORS设置**

>跨源资源共享 ( [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS) )机制让Web应用服务器能支持跨站访问控制，从而使得安全地进行跨站数据传输成为可能。
主要是通过设置`Access-Control-Allow-Origin: *`
```javascript
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,accept, authorization, content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
```
**端口监听**

```javascript
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
```
**启动**

```
npm start
或
node serve.js
```

```
启动前端
cd front
gulp
```


