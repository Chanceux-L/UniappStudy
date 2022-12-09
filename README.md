# beansmile-uniapp-boilerplate

- [目录介绍](#directory-Introduction)
- [初始化项目](#project-setup)
- [utils 工具](./docs/utils.md)
- [components 组件](./docs/components.md)
- [service](./docs/service.md)
- [models](./docs/models.md)
- [plugins 插件](./docs/plugins.md)

## Directory Introduction

```
.
├── docs                     # 文档描述
├── loader                   # uni-app-loader的拓展
├── public                   # 第三方资源，这里只存放index.html
├── script                   # node自动化部署相关脚本
├── src                      # 项目主要工程文件夹
│  ├── service               # api接口相关
│  ├── components            # 公共组件
│  │  └── common             # 基础组件，区别于具体业务组件
│  ├── constants             # 常量
│  ├── fliters               # 过滤器
│  ├── mixins                # mixins
│  ├── plugins               # plugins
│  ├── models                # models
│  ├── pages                 # TabBar页面以及分包
│  │  ├── root               # TabBar页面
│  │  └── xxx                # 具体分包页面(分包资源和组件引入遵循就近原则，只有公用的才移出去)
│  ├── static                # 存放应用引用静态资源（如图片、视频等）的目录，注意：静态资源只能存放于此
│  ├── stores                # 状态管理器，可存放公共数据
│  ├── styles                # 公共样式和mixins样式
│  ├── utils                 # 工具方法
│  ├── App.vue               # 应用配置，用来配置App全局样式以及监听
│  ├── main.js               # Vue初始化入口文件
│  ├── manifest.json         # 应用以及不同平台打包的配置
│  ├── pages.json            # 配置页面路由、导航条、选项卡等页面类信息
│  └── uni.scss              # 全局样式变量配置
├── .env                     # 开发环境变量
├── .env.production          # 正式环境变量
├── .env.staging             # 测试环境变量
├── .eslintignore            # 代码检测忽略文件配置
├── .eslintrc.js             # 代码检测规则配置
├── .gitignore               # git忽略文件配置
├── .gitlab-ci.yml           # ci配置
├── .npmrc                   # npm镜像源配置
├── babel.config.js          # babel配置
├── package.json             # 依赖包配置
├── postcss.config.js        # postcss配置
├── vue.config.js            # vue拓展配置
└── webpack.config.js        # webpack配置
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
