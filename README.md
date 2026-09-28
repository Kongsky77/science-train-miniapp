# activity-users-mp

Ai121平台-家长端小程序

基于uniapp+TypeScript

## 科普列车代码质量检测

使用 Node 14.21.3：

```sh
npm run verify:kjg:quiz:offline
npm run build:quality:kjg:mp-weixin
```

微信开发者工具日常开发打开 `dist/dev/kjg-integration`，该目录只由
`dev:integration:kjg:mp-weixin` 的开发 watch 写入。质量检测命令使用当前
`integration.kjg` 配置和生产压缩，不开启 watch，并独立输出到
`dist/build/kjg-integration`，避免开发与生产构建的 scoped 样式标识互相覆盖。

integration 和 production.kjg 中的 `VUE_APP_WECHAT_LAZY_COMPONENTS=true`
启用构建插件：扫描编译后的 WXML（含 import/include），把全局原生组件
声明分配给实际使用的页面及组件，保留已有局部声明；验证依赖文件存在后，
再生成 `app.json` 的 `lazyCodeLoading: requiredComponents`。不要只在
manifest 中单独开启开关。兼容处理位于 `build/WechatComponentInjectionPlugin.js`。

图片已迁移至素材库提供的公开 HTTPS 地址，本地原图可从 Git 历史恢复。
主包体积最终以微信开发者工具检测为准；按需注入不会自动减小物理包体积。

科普列车微信构建通过 `src/pages.js` 将较大的功能目录划分为普通分包，
保留原有页面 URL、页面配置和订单分包。首页、登录及共享依赖仍在主包，
进入功能页面时由微信加载对应分包；其他主题及平台不改变分包布局。
质量构建后可运行 `node scripts/check-wechat-package-size.js dist/build/kjg-integration`
检查主包大小（按 1,500,000 字节的保守上限检查，包含目录中所有主包文件）。
