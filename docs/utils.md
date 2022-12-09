# 目录
 - [storage](#storage)
 - [检查并调用手机权限](#检查并调用手机权限)
 - [保存图片或视频到本地相册](#保存图片或视频到本地相册)
 - [nav](#nav)
 - [Poster 生成海报图片](#poster生成海报图片)

### storage
支持对象和数组存储，使用作用域区分不同存储数据

普通对象式存储示例代码
``` javascript
// duration 过期时间，单位毫秒，为空表示不会自动过期清除
const storage = new Storage('存储作用域名称'， duration);
storage.set(key, data)             // 添加存储数据
storage.get(key)                   // 获取对应存储数据
storage.remove(key)                // 删除对应存储数据
storage.clear()                    // 情况当前存储作用域下，所有存储数据
storage.checkOverdue()             // 手动清除本地存储的过期数据，返回已过期数据
storage.overdueData                // new Storage 时，过期了的数据
```

数组存储实例代码
``` javascript
// maxLength 数组最大长度，默认 Infinity，超过最大长度的部分不会被存储
// duration 过期时间，单位毫秒，为空表示不会自动过期清除
// isRepeat 是否保存重复数据，默认 true
const storage = new ArrayStorage('存储作用域名称'， { maxLength, duration, isRepeat });
storage.get()                      // 获取整个数组数据

// 修改数据请使用以下方法，不要直接修改数据，清空数据请使用 splice 方法
storage.push()                     // 对应数组原型方法
storage.pop()                      // 对应数组原型方法
storage.shift()                    // 对应数组原型方法
storage.unshift()                  // 对应数组原型方法
storage.splice()                   // 对应数组原型方法
storage.sort()                     // 对应数组原型方法
storage.reverse()                  // 对应数组原型方法
storage.checkOverdue()             // 手动清除本地存储的过期数据，返回已过期数据
storage.overdueData                // new ArrayStorage 时，过期了的数据
```

---

### 检查并调用手机权限
说明：使用手机权限每次都要判断用户是否拒绝相关权限，所以统一封装了起来

参数说明：
checkApiAuth(scope, [options], [isAuto]);

| 参数    | 是否必填 | 类型      | 默认值 | 说明                                                         |
| :------ | :------: | :-------- | :----: | :----------------------------------------------------------- |
| scope   |    是    | `String`  |   -    | 需要调用的小程序接口函数                                     |
| options |    否    | `Object`  |   {}   | 调用小程序函数需要传递的参数                                 |
| isAuto  |    否    | `Boolean` |  true  | 是否自动调用，传递`false`只检查权限，不自动调用小程序对应API |

示例代码：
```js
import { checkApiAuth } from '@/utils';


// 操作事件
async handleClick() {
  const res = await checkApiAuth('chooseAddress');
}
```

---

### 保存图片或视频到本地相册
说明：保存图片或视频到本地相册，支持小程序本地链接和网络链接。

参数说明：
saveFiles(urls, [mediumType]);

| 参数        | 是否必填 | 类型             | 默认值 | 说明                                    |
| :---------- | :------: | :--------------- | :----: | :-------------------------------------- |
| urls        |    是    | `String`或`Array` |   -    | 媒体文件本地链接或网络链接              |
| mediumType |    否    | `String`         | image  | `image` 或 `video`，默认`image`保存图片 |

示例代码：
```js
import { saveFiles } from '@/utils';

// 操作事件
async handleClick() {
  await saveFiles('http://xxx.xxx.com/xxx.jpg');
  showToast('保存成功');
}
```

---

### nav
nav 对象把 uni 里路由相关的 api 进行了封装(https://uniapp.dcloud.io/api/router)
参数传递和文档一致

### Poster生成海报图片

示例代码
```js
import { Poster, autoLoading } from '@/utils';

// 获取海报实例
this.poster = new Poster({
  width: this.width,
  height: this.height,
  canvasId: 'create-poster-canvas',
  component: this,
  // dpr: 2, 默认为系统的 dpr，可以不传
});

// 画海报，并生成本地链接地址， config 参照下面 config 配置
// config 建议为1倍图的像素，内部会通过 dpr 做放大
const img = this.poster.createPoster(this.config)
```

#### config配置
```javascript
[
  {
    type: 'draw',                    // 预设的不够用，自己画
    draw: Function: (ctx, config)
  },
  {
    type: 'image',
    top: Number,
    left: Number,
    width: Number,                   // 画到画布图片宽
    height: Number,                  // 画到画布图片高
    url: String,                     // 图片地址
    mode: String                     // 'aspectFill' 图片裁剪
  },
  {
    type: 'text',
    top: Number,
    left: Number,
    text: String || Array,           // 文本
    fontSize: Number,                // 默认 20
    lineHeight: Number,              // 默认 fontSize * 1.5
    color: String,
    textAlign: String,
    baseline: String,
    maxWidth: Number,                // 默认 375, 画布画文本最长长度
    maxRow: Number,                  // 默认 10, 自动折行最大行数
    ellipsis: Boolean,               // 默认true，文本显示不完是否显示'...'
    margin: Number,                  // 文字水平偏移
    fontWeight: String,              // 'bold' 文字加粗
    textDecoration: String           // 'line-through' 文字中划线
    background: String               // 文字背景色
    paddingLeft: Number              // 左边距
    paddingRight: Number             // 右边距
    paddingTop: Number               // 上边距
    paddingBottom: Number            // 下边距
    borderColor: String              // 边框颜色
    borderWidth: Number              // 边框宽度
    borderRadius: Number             // 圆角
  },
  {
    type: 'background',
    top: Number,
    left: Number,
    width: Number,                   // 背景宽
    height: Number,                  // 背景高
    color: String                    // 背景颜色
  },
  {
    type: 'border',
    top: Number,
    left: Number,
    width: Number,                   // 背景宽
    height: Number,                  // 背景高
    color: String                    // 背景颜色
    borderWidth: Number,             // border 线条宽度
    borderRadius: Number,            // 圆角
  },
  {
    type: 'arc',
    left: Number,                    // 圆心x
    top: Number,                     // 圆心y
    r: Number,                       // 圆半径
    color: String                    // 背景颜色
  }
]
```
