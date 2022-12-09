# 目录
 - [介绍](#介绍)
 - [例子](#例子)

# 介绍
存放各类 api 请求的 vue 对象。可以在 api 请求后触发对应的函数名事件

## Service 类介绍, [源码](../src/service/index.js)
```javascript
class Service {
  // 封装 $on 的方法
  subscribe(name, handle, auto_clear = true) {
    // 通过 this.$on 来订阅，name 会转为中横线命名，为了和 @Emit 对应
    // subscribe 订阅的事件，会在页面销毁后自动清除。如果是永久监听的事件，需要把参数 auto_clear 设为 false
  }

  // 封装 $emit 的方法
  dispatchEvent(name, ...args) {
    // 触发订阅消息，name 会转为中横线命名
  }
}
```

# 例子

## 创建一篇文章
``` javascript
// 在 ../src/service/index.js 下的这个类进行扩展
class Service {
  async createPost() {
    const res = await this.$request.post('posts', {}); // 发送 api 请求
    this.dispatchEvent('createPost', res.data) // 触发订阅消息
  }

  // 或者下面这种声明也是等效的
  // 使用[Emit](https://github.com/kaorun343/vue-property-decorator#Emit)
  // 触发名为 ‘create-post’ 的事件，它会把函数名的中横线命名作为事件名
  @Emit()
  async createPost() {
    const res = await this.$request.post('posts', {});
    return res.data;
  }
}
```

```javascript
// pages/posts/list.vue 列表页
export default {
  onLoad() {
    // 在页面或者 store 可以监听 service 的事件(如果需要)
    this.$service.subscribe('createPost', post => {
      console.warn(post)
    })
  }
}
```

```javascript
// pages/posts/form.vue 列表页
export default {
  submit() {
    this.$service.createPost(formData)
  }
}
```

---

## 收藏一篇文章
``` javascript
// 在 ../src/service/index.js 下的这个类进行扩展
class Service {
  async collectPost(post) {
    await this.$request.post('collect', {});

    // 触发订阅消息 collect-post
    this.dispatchEvent('collectPost', post)

    // 触发订阅消息 collect-post:posts:1
    this.dispatchEvent({ event: 'collectPost', model: post }, post)

   // 下面看一下这两者的区别
  }
}
```

```javascript
// pages/posts/list.vue 列表页
export default {
  onLoad() {
    // 在页面或者 store 可以监听 service 的事件(如果需要)
    this.$service.subscribe('collectPost', post => {
      console.warn(post) // 这里的 post 是不定的，既可能是 id 1 的post，也可能是 id 2 的post
    })
  }
}
```

```javascript
// pages/posts/detail.vue 详情页
export default {
  onLoad() {
    // 在页面或者 store 可以监听 service 的事件(如果需要)
    // model 的对象需要包含两个属性(id, tn)
    // 监听的事件名就会变成 collect-post:${tn}:${id}
    this.$service.subscribe({ event: 'collectPost', model: model }, post => {
       // 这里 post.id 应该等于 model.id
    })
  }
}
```
