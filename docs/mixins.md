# 目录

 - [小程序全局分享 onShareAppMessage](#小程序全局分享)
 - [路由参数](#路由参数)

# 小程序全局分享
通过 mixin 定义了 [onShareAppMessage](../src/mixins/index.js#L5)，全局生效

页面自定义分享时，声明 onShareAppMessage 即可，会覆盖 mixin 的

mixin 提供了 $mergeShareAppMessage 的方法
```javascript
this.$mergeShareAppMessage({ title, path, imageUrl }) // return { title, path, imageUrl }
```
参数参考 https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onShareAppMessage-Object-object

没有传的参数会使用默认的, 页面自定义分享时可使用

# 路由参数
路由参数添加到 $query 属性上。功能如下
1. h5 不能通过 props 接收路由参数，在非 onLoad 函数下可通过 $query 获取参数
2. 小程序二维码进入页面，参数需要单独解码，$query 里已包含解码的参数
