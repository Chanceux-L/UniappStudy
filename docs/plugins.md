# 目录

 - [prop 支持传递函数和 class 实例](#prop支持传递函数和对象)
 
## prop支持传递函数和对象
uni-app 的微信小程序模式下，组件传递 prop 不支持传递函数，传递对象时会被json化导致里面的函数、原型丢失。
在 h5 下不存在这个问题，为了平台兼容，开发了此插件

### 例子
以组件 src/components/common/loading-screen.vue 为例子
```javascript
import { PropReference } from '@/plugins/prop-reference';

class LoadingScreen extends Vue {
    @PropReference({ type: Function }) onFetch // 这里使用了 PropReference 而不是 Prop
}
```

在页面中使用 LoadingScreen
```html
<div>
  <common-loading-screen :onFetch.reference="onFetch"/>
  <common-loading-screen :onFetch.ref="onFetch"/>
</div>
```

```javascript
export default {
   methods: {
     onFetch() {}
   }
}
```

对于 store 或者其他 class 实例，用法是一样的

### PropReference 参数
`@PropReference(options)`

| options       |  类型   |  默认值   | 描述                                                                                                  |
| :------------ | :-----: | :-------: | :---------------------------------------------------------------------------------------------------- |
| type          | 构造函数  | -        | 可传递 Function、Object、Array、自定义 Class，内部通过 instanceof 检测，因此不要传递基础数据类型    |
| default       | Function |   () => null   |  返回默认值的函数   |
| required      | Boolean |   false   | 是否必传   |

### 附言
此插件通过条件编译支持在小程序和 app 下使用，其他平台没有测试。其他平台下自动移除相关逻辑。

---
