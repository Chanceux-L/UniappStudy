# 目录

 - [兼容iPhoneX底部 button-fixed-bottom](#兼容iphonex底部-button-fixed-bottom)
 - [自定义导航 navbar](#自定义导航)
 - [自定义页面 custom-page](#自定义页面)
 - [添加到我的小程序 add-to-my-miniprogram](#添加到我的小程序)
 - [canvas生成海报 create-poster](#canvas生成海报)
 - [Loading组件 loading-screen](#LoadingScreen)
 - [空列表 empty-view](#EmptyView)
 - [通告栏 notice-bar](#通告栏)
 - [加载更多列表 list-page](#加载更多列表)
 - [加载状态 loading-status](#加载状态)
 - [日期时间选择器](#日期时间选择器)
 - [富文本](#富文本)

### 兼容iPhoneX底部 button-fixed-bottom
- 需要定位在最底部的组件，使用`button-fixed-bottom` 组件包裹起来，自动会在`iPhone X`等设备添加底部保护区域
- 示例代码：
```html
<common-button-fixed-bottom>
  内容
</common-button-fixed-bottom>
```
#### 参数
| props   |  类型  | 默认值 | 描述 |
| :------ | :----: | :----: | :--- |
| bgColor | String |  #fff  | 颜色 |
| zIndex  | Number |   99   | 颜色 |

---

### 自定义导航

- 示例代码：

```html
<common-navbar title="beansmile" />
```

#### 参数

| props                |  类型   | 默认值  | 描述                     |
| :------------------- | :-----: | :-----: | :----------------------- |
| title                | String  |         | 标题                     |
| color                | String  | #141414 | 颜色                     |
| backgroundColor      | String  |  #fff   | 背景色                   |
| fixed                | Boolean |  false  | 是否固定在顶部           |
| placeholder          | Boolean |  true   | 固定在顶部时是否开启占位 |
| statusBarPlaceholder | Boolean |  true   | 是否留出状态栏高度       |
| border               | Boolean |  true   | 是否显示下边框           |
| zIndex               | Number  |  10001  | 层级                     |
| showBackButton       | Boolean |  false  | 是否显示返回             |
| backIcon             | String  |         | 返回按钮图片路径         |

#### 事件

| event  |       参数       | 描述               |
| :----- | :--------------: | :----------------- |
| back   |        /         | 点击返回按钮是触发 |
| ready  |        /         | 组件是否ready      |
| height | (height: Number) | 组件高度           |

---

### 自定义页面
- 示例代码：

```html
<!-- slug 参见不同项目的接口约定 -->
<custom-page-component :slug="slug"/>
```

### 参数

| props      | 类型  | 默认值 | 描述     |
| :--------- | :---: | :----: | :------- |
| components | Array |   []   | 组件列表 |

---

### 添加到我的小程序
- 示例代码：

```html
<common-add-to-my-miniprogram />
```

### 参数

| props        |  类型   |                 默认值                 | 描述                 |
| :----------- | :-----: | :------------------------------------: | :------------------- |
| text         | String  | 点击添加「我的小程序」，下次访问更便捷 | 引导提示             |
| duration     | Number  |                  6000                  | 弹层显示时间         |
| customNavbar | Boolean |                 false                  | 页面使用了自定义导航 |

### canvas生成海报
注：推荐直接使用 [Poster](./utils.md#poster生成海报图片)，后续考虑去掉此组件
- 示例代码：

```html
<common-create-poster
  :width="300"
  :height="300"
  :config="config"
  @success="handleCreatePosterSuccess"
>
  <button>生成海报</button>
</common-create-poster>
```

### 参数

| props  |  类型  | 默认值 | 描述                         |
| :----- | :----: | :----: | :--------------------------- |
| width  | Number |  200   | 画布宽                       |
| height | Number |  200   | 画布高                       |
| config | Array  |   []   | 海报配置（详见[Poster](./utils.md#poster生成海报图片)配置） |

#### 事件

| event   |           参数            | 描述         |
| :------ | :-----------------------: | :----------- |
| success | (图片临时路径 (本地路径)) | 生成图片完成 |

---

### 参数

| props           |  类型   | 默认值 | 描述               |
| :-------------- | :-----: | :----: | :----------------- |
| withCredentials | Boolean | false  | 是否带上登录态信息 |
| disabled        | Boolean | false  | 禁用状态           |
| onlyBtn         | Boolean | false  | 是否只渲染button。用在不改变元素结构上，需要保证父节点是相对定位|

#### 事件

| event   |                                             参数                                              | 描述         |
| :------ | :-------------------------------------------------------------------------------------------: | :----------- |
| success | { userInfo, rawData, signature, encryptedData, iv, code: 如果withCredentials = true会有code } | 获取信息完成 |

---

### LoadingScreen

#### 简介
全屏覆盖的 loading 组件，可以通过 css 调整 position 的相关坐标。
默认自动请求 settings api

- 示例代码：

```html
<div>
  <div>text</div>
  <common-loading-screen :onFetch.reference="onFetch"/>
</div>
```

```javascript
export default {
   methods: {
     onFetch() {}
   }
}
```

#### 参数

| props         |   类型   | 默认值 | 描述                                                                                                    |
| :------------ | :------: | :----: | :------------------------------------------------------------------------------------------------------ |
| onFetch       | Function |   -    | fetch 函数 [参考](./plugins.md#prop支持传递函数和对象)                                                  |
| usedCustomNav | Boolean  | false  | 页面如果使用了自定义导航的话，需要传 true                                                               |
| auth          | Boolean  |  true  | 是否需要获取用户信息（静默登录）。`引导页/首页/信息展示页`等这类一般不需要该信息的页面，请设置为`false` |

---

### EmptyView

#### 简介
空列表时展示

- 示例代码：

```html
<div>
  <common-empty-view v-if="list.isEmpty"/>
</div>
```

#### 参数

| props |  类型  |   默认值   | 描述     |
| :---- | :----: | :--------: | :------- |
| text  | String | '暂无数据' | 提示文本 |

### 通告栏
- 示例代码：

```html
<common-notice-bar
  text="在代码阅读过程中人们说脏话的频率是衡量代码质量的唯一标准。"
/>
```

### 参数

| props           |  类型  | 默认值  | 描述            |
| :-------------- | :----: | :-----: | :-------------- |
| text            | String |   ''    | 文字内容        |
| delay           | Number |    1    | 动画延迟时间(s) |
| speed           | Number |   50    | 滚动速率(px/s)  |
| color           | String | #ed6a0c | 文本颜色        |
| backgroundColor | String | #fffbe8 | 滚动条背景      |

---

### 加载更多列表

集成列表页下拉刷新和滚动加载更多，减少列表页面这部分的重复代码

示例代码：
```html
<!-- template -->
<common-list-page :store.reference="store">
  <div>列表显示的主要内容</div>
  <div slot="empty">empty</div>
  <div slot="staticMore">上滑加载更多</div>
  <div slot="loadingMore">加载中...</div>
  <div slot="noMore">没有更多了</div>
</common-list-page>
```
```js
// js
import { Collection } from '@/stores';

class ListPage extends Vue {
  store = Collection.create({
    fetch() {
      // ....
    }
  })
}
```

##### 说明

Props

| props                 |       类型        |     默认值     | 描述                                                                                      |
| :-------------------- | :---------------: | :------------: | :---------------------------------------------------------------------------------------- |
| store.reference       |       store       |       -        | 必填，需要继承了 `Collection` 的 `store`，详情看示例代码。                                |
| emptyText             | [String, Boolean] |   '暂无数据'   | 同[加载状态 loading-status](#加载状态)                                                    |
| loadingMoreText       | [String, Boolean] |  '加载中...'   | 同[加载状态 loading-status](#加载状态)                                                    |
| noMoreText            | [String, Boolean] | '没有更多了 ~' | 同[加载状态 loading-status](#加载状态)                                                    |
| staticText            | [String, Boolean] | '上滑加载更多' | 同[加载状态 loading-status](#加载状态)                                                    |
| errorText             | [String, Boolean] | '上滑加载更多' | 同[加载状态 loading-status](#加载状态)                                                    |
| refresherEnabled      |      Boolean      |     false      | 开启自定义下拉刷新                                                                        |
| refresherThreshold    |      Number       |       45       | 设置自定义下拉刷新阈值                                                                    |
| refresherDefaultStyle |      String       |    'black'     | 设置自定义下拉刷新默认样式，支持设置 `black`、`white`、`none`， `none` 表示不使用默认样式 |
| refresherBackground   |      String       |     '#FFF'     | 设置自定义下拉刷新区域背景颜色                                                            |
| lowerThreshold        |      Number       |       50       | 距离底部多少时触发滚动加载更多                                                            |

Slot:

| slot        | 描述                                   |
| :---------- | :------------------------------------- |
| default     | 列表里面的显示内容                     |
| empty       | 同[加载状态 loading-status](#加载状态) |
| staticMore  | 同[加载状态 loading-status](#加载状态) |
| loadingMore | 同[加载状态 loading-status](#加载状态) |
| noMore      | 同[加载状态 loading-status](#加载状态) |
| error       | 同[加载状态 loading-status](#加载状态) |


### 加载状态
集成加载状态显示，方便局部loading和retry

示例代码：
```html
<!-- template -->
<common-loading-status :store.reference="store" @retry="handleRetry">
  <div slot="empty">empty</div>
  <div slot="staticMore">上滑加载更多</div>
  <div slot="loadingMore">加载中...</div>
  <div slot="noMore">没有更多了</div>
</common-loading-status>
```
```js
// js
import { SimpleStore } from '@/stores';

class ListPage extends Vue {
  store = SimpleStore.create({
    // ....
  })

  // 请求失败后，点击事件
  handleRetry() {
    this.store.fetchData();
  }
}
```

##### 说明

Props

| props           |  类型  |         默认值         | 描述                                                        |
| :-------------- | :----: | :--------------------: | :---------------------------------------------------------- |
| store.reference | store  |           -            | 必填，需要继承了 `SimpleStore` 的 `store`，详情看示例代码。 |
| emptyText       | [String, Boolean] |       '暂无数据'       | 为空时的文案，优先级低于`slot`。不想显示直接传 `false`                              |
| loadingMoreText | [String, Boolean] |      '加载中...'       | 加载中的文案，优先级低于`slot`。不想显示直接传 `false`                              |
| noMoreText      | [String, Boolean] |     '没有更多了 ~'     | 没有更多数据时的文案，优先级低于`slot`。不想显示直接传 `false`                      |
| staticText      | [String, Boolean] |     '上滑加载更多'     | 默认静止时的文案，优先级低于`slot`。不想显示直接传 `false`                          |
| errorText       | [String, Boolean] | '加载失败，点击重试！' | 请求失败时的文案，优先级低于`slot`。不想显示直接传 `false`                          |

Slot:

| slot        | 描述                                                           |
| :---------- | :------------------------------------------------------------- |
| empty       | 列表为空时显示的内容，优先级高于`props`                        |
| staticMore  | 默认状态，提示用户可以滚动加载时显示的内容，优先级高于`props`  |
| loadingMore | 加载中状态，显示正在加载 的内容，优先级高于`props`             |
| noMore      | 全部加载完成状态，显示没有更多数据了 的内容，优先级高于`props` |
| error       | 请求失败后 的内容，优先级高于`props`                           |

事件 event：
| slot  | 描述                               |
| :---- | :--------------------------------- |
| retry | 请求失败后，点击失败文案的事件回调 |


### 日期时间选择器

由于小程序里面没有`年月日时分秒`组合的选择器，本组件结合`dayjs`和`picker`满足了`年月日时分秒`的功能，可以通过`fields`来控制，样式请通过`slot`实现，和原始`picker`一样

#### 参数

| props    |  类型   |       默认值        | 描述                                                                                          |
| :------- | :-----: | :-----------------: | :-------------------------------------------------------------------------------------------- |
| value    | String  |      当前时间       | 日期时间，不进行业务校验推荐使用`v-model`，校验使用`:value`避免触发更新并通过`change`手动更新 |
| format   | String  |  YYYY-MM-DD HH:mm   | `dayjs`format格式                                                                             |
| fields   | String  |       minute        | 粒度 `hour` `minute` `second` ｜                                                              |
| start    | String  | 1970-01-01 00:00:01 | 开始时间                                                                                      |
| end      | String  | 2099-12-31 23:59:59 | 结束时间                                                                                      |
| disabled | Boolean |        false        | 禁用状态                                                                                      |

#### 事件

| event  |  参数  | 描述                                         |
| :----- | :----: | :------------------------------------------- |
| input  | (text) | 时间字符串，遵循format格式                   |
| change | (text) | 时间字符串，遵循format格式，可以监听用于校验 |

#### slot
| slot    | 描述                           |
| :------ | :----------------------------- |
| default | 组件内容包裹内容，样式自行定义 |

#### 例子
```html
<common-date-time-picker v-model="dateTime" format="YYYY-MM-DD HH:mm" @change="onDateTimeChange">
  <div class="date-time">{{ dateTime || '请选择时间' }}</div>
</common-date-time-picker>
```

```js
dateTime = ''

onDateTimeChange(text) {
  console.log(text);
}

 ```

 ### 富文本
使用微信官方rich-text组件，支持图片预览，链接复制，节点默认样式

| props    |  类型   |       默认值        | 描述                                                                                          |
| :------- | :-----: | :-----------------: | :-------------------------------------------------------------------------------------------- |
| content  | String  |      /               | 富文本内容 |
#### 例子
```html
<common-rich-text content="<p>富文本</p>" />
```

 ### to-wxml
把富文本/markdown解析成小程序组件，支持图片预览，链接复制，比较方便自定义样式

* 需要用这个组件时打开es6转es5, `/script/deploy-mp-weixin.js` 打开35行注释

* 不需要这个组件需要请删掉 `/static/components/towxml` & `/components/common/to-wxml.vue`

| props       |  类型   |       默认值        | 描述                                                                                          |
| :-------    | :-----: | :-----------------: | :-------------------------------------------------------------------------------------------- |
| content     | String  |      /              | 富文本/markdown内容 |
| isMarkdown  | Boolean |      false          | 是否是markdown内容  |
#### 例子
```html
<common-to-wxml content="<p>富文本</p>" />
<common-to-wxml content="### markdown" isMarkdown />
```
