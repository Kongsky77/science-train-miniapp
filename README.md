# 科普列车小程序

面向科普场馆与主题活动的微信小程序。项目围绕活动报名、场馆探索、现场打卡、科普答题、积分排行和通关抽奖等流程，为用户提供完整的科普活动参与体验。

项目基于 **uni-app + Vue 2 + TypeScript** 开发，以微信小程序为主要运行平台，同时保留 H5、支付宝小程序、百度小程序等多端构建能力。

## 核心功能

- 活动浏览、详情查看与在线报名
- 科技馆列表、场馆介绍与地区筛选
- 活动参与人选择与家庭成员信息管理
- 场馆签到、打卡记录与照片上传
- 科普闯关答题、离线题目校验与答题进度管理
- 积分累计、排行榜与活动成绩查询
- 通关抽奖与中奖结果展示
- 徽章、作品、证书及个人中心
- 多主题、多环境和微信小程序分包构建

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 应用框架 | uni-app、Vue 2 |
| 开发语言 | TypeScript、JavaScript、SCSS |
| 状态管理 | Vuex |
| UI 组件 | Vant Weapp、uni-ui |
| 网络请求 | Flyio、Fetch WeChat |
| 测试 | Jest、ts-jest |
| 构建工具 | Vue CLI 4、Webpack、cross-env |

## 目录结构

```text
.
├─ build/                 # 微信组件按需注入等构建扩展
├─ scripts/               # 构建后处理与包体积检查脚本
├─ src/
│  ├─ pages/              # 页面与科普列车业务模块
│  ├─ service/            # 活动、签到、答题、积分、排行等服务
│  ├─ components/         # 通用业务组件
│  ├─ store/              # Vuex 状态管理
│  ├─ theme/              # 多主题样式与资源
│  ├─ utils/              # 通用工具
│  ├─ pages.js            # 页面及分包配置入口
│  └─ manifest.json       # uni-app 平台配置
├─ tests/                 # Jest 测试及科普答题离线校验
└─ package.json           # 依赖与构建命令
```

## 开发环境

建议使用与项目构建链兼容的环境：

- Node.js `14.21.3`
- npm
- 微信开发者工具

> 项目依赖较早版本的 Vue CLI 与 `node-sass`，使用较新的 Node.js 可能出现原生依赖安装失败。

## 配置说明

运行项目前需要准备对应环境的 `.env.*` 配置文件，例如：

- `.env.development.kjg`
- `.env.integration.kjg`
- `.env.production.kjg`

这些文件包含服务地址、微信 AppID、活动 ID 等部署配置，已从当前 GitHub 仓库中排除。请向项目维护者获取配置，并放在项目根目录。

请勿将密钥、Token、Secret 或真实生产配置提交到 Git 仓库。

## 安装依赖

```bash
npm install
```

## 本地开发

启动科普列车微信小程序开发构建：

```bash
npm run dev:kjg:mp-weixin
```

构建结果默认输出到：

```text
dist/dev/kjg
```

使用联调环境持续构建：

```bash
npm run dev:integration:kjg:mp-weixin
```

然后在微信开发者工具中打开：

```text
dist/dev/kjg-integration
```

如需运行通用微信小程序或 H5：

```bash
npm run dev:mp-weixin
npm run dev:h5
```

## 生产构建

构建科普列车微信小程序：

```bash
npm run build:kjg:mp-weixin
```

构建结果输出到：

```text
dist/build/kjg
```

## 测试与质量检查

运行科普答题离线校验：

```bash
npm run verify:kjg:quiz:offline
```

执行联调环境的生产质量构建：

```bash
npm run build:quality:kjg:mp-weixin
```

检查微信小程序主包体积：

```bash
node scripts/check-wechat-package-size.js dist/build/kjg-integration
```

质量构建使用独立的 `dist/build/kjg-integration` 输出目录，不会覆盖微信开发者工具日常使用的开发构建。

## 构建说明

- `src/pages.js` 会将较大的功能模块划分为微信小程序普通分包，并保留原有页面路径。
- `build/WechatComponentInjectionPlugin.js` 会扫描编译后的 WXML，按实际使用情况注入原生组件声明。
- 启用 `VUE_APP_WECHAT_LAZY_COMPONENTS=true` 后，构建流程会生成微信小程序的组件按需加载配置。
- 最终包体积请以微信开发者工具的检测结果为准。

## 维护建议

- 新增页面时同步检查 `src/pages.js` 中的页面及分包配置。
- 提交前至少执行一次离线答题校验和微信小程序质量构建。
- 环境配置、构建产物、临时素材和本机工具文件不要提交到仓库。
