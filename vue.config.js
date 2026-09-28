var path = require('path')
var fs = require('fs')
var WechatComponentInjectionPlugin = require('./build/WechatComponentInjectionPlugin')

class EmitWechatProjectConfigPlugin {
    apply (compiler) {
        compiler.hooks.emit.tap('EmitWechatProjectConfigPlugin', (compilation) => {
            const sourcePath = path.resolve(process.env.UNI_CLI_CONTEXT || process.cwd(), 'project.config.json')
            const projectConfig = JSON.parse(fs.readFileSync(sourcePath, 'utf8'))
            projectConfig.appid = process.env.VUE_APP_WECHAT_APPID
            const source = JSON.stringify(projectConfig, null, 2)

            compilation.assets['project.config.json'] = {
                source: () => source,
                size: () => Buffer.byteLength(source)
            }
        })
    }
}

const setTheme = (argv) => {
    let theme = ''
    argv.forEach((arg) => {
        if (arg.includes('--theme')) {
            theme = arg.split('=')[1]
        }
    })
    if (theme) {
        process.env.VUE_APP_THEME_TYPE = theme
    } else {}

    return argv
}

setTheme(process.argv)

// 拼接主题文件路径字符串
const baseThemeUrl = '~@/theme'
let themeUrl = ''

// 如果是暗色则采用 theme-dark.less 中到的样式
if (process.env.VUE_APP_THEME_TYPE === 'tfgf') {
    themeUrl = `${baseThemeUrl}/theme-tfgf.scss`
} else {
    themeUrl = `${baseThemeUrl}/theme.scss`
}

console.log('主题路径')
console.log(themeUrl)
console.log('当前打包环境')
console.log(process.env.NODE_ENV)
console.log('当前参数')
console.log(process.argv)

module.exports = {
    configureWebpack: {
        plugins: [
            ...(process.env.VUE_APP_EMIT_WECHAT_PROJECT_CONFIG === 'true' ? [new EmitWechatProjectConfigPlugin()] : []),
            ...(process.env.UNI_PLATFORM === 'mp-weixin' && process.env.VUE_APP_WECHAT_LAZY_COMPONENTS === 'true'
                ? [new WechatComponentInjectionPlugin()] : [])
        ]
    },
    css: {
        loaderOptions: {
            scss: {
                data: `@import "${themeUrl}";`
            }
        }
    },
    devServer: {
        https: true
    },
    chainWebpack: (config) => {
        // 发行或运行时启用了压缩时会生效
        config.optimization.minimizer('terser').tap((args) => {
            const compress = args[0].terserOptions.compress
                // 非 App 平台移除 console 代码(包含所有 console 方法，如 log,debug,info...)
            compress.drop_console = false
            compress.pure_funcs = [
                '__f__' // App 平台 vue 移除日志代码
                // 'console.debug' // 可移除指定的 console 方法
            ]
            return args
        })
    }
}
