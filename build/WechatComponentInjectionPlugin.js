const path = require('path').posix
const VANT_ROOT = 'wxcomponents/vant/'
const VANT_SHARED_DIRECTORIES = new Set(['common', 'definitions', 'mixins', 'wxs'])

// Expand app-level declarations into the WXML owners before enabling WeChat's
// dependency injection. Leave uni-app's generated JS and local declarations intact.
function prepareComponentInjection (assets) {
    const read = name => {
        if (!assets[name]) throw new Error(`Missing WeChat asset: ${name}`)
        return assets[name].source().toString()
    }
    const resolve = (owner, target) => path.normalize(target.startsWith('/')
        ? target.slice(1) : path.join(path.dirname(owner), target))
    const app = JSON.parse(read('app.json'))
    const globals = app.usingComponents || {}
    const updates = {}
    const collectTags = (name, visited = new Set()) => {
        if (visited.has(name)) return new Set()
        visited.add(name)
        const source = read(name).replace(/<!--[\s\S]*?-->/g, '')
        const tags = new Set(Array.from(source.matchAll(/<([\w-]+)(?=[\s/>])/g), match => match[1]))
        for (const match of source.matchAll(/<(?:import|include)\s[^>]*\bsrc=["']([^"']+)["']/g)) {
            if (match[1].includes('{{')) throw new Error(`Dynamic WXML dependency in ${name}`)
            for (const tag of collectTags(resolve(name, match[1]), visited)) tags.add(tag)
        }
        return tags
    }

    for (const name of Object.keys(assets).filter(name => name.endsWith('.wxml'))) {
        const jsonName = name.replace(/\.wxml$/, '.json')
        // Imported templates inherit the declarations of their owning component.
        if (!assets[jsonName]) continue
        const config = JSON.parse(read(jsonName))
        const using = Object.assign({}, config.usingComponents)
        for (const tag of collectTags(name)) {
            if (!Object.prototype.hasOwnProperty.call(using, tag) && globals[tag]) {
                using[tag] = globals[tag]
            }
            if (tag.startsWith('van-') && !using[tag]) {
                const nativePath = `wxcomponents/vant/${tag.slice(4)}/index`
                if (!assets[nativePath + '.json']) {
                    throw new Error(`Undeclared component ${tag} in ${name}`)
                }
                using[tag] = '/' + nativePath
            }
        }
        for (const [tag, target] of Object.entries(using)) {
            if (target.startsWith('plugin://')) continue
            const base = resolve(jsonName, target)
            // Components without styles legitimately omit WXSS.
            for (const extension of ['.json', '.js', '.wxml']) {
                if (!assets[base + extension]) {
                    throw new Error(`Missing ${tag} dependency: ${base + extension} (from ${jsonName})`)
                }
            }
        }
        config.usingComponents = using
        updates[jsonName] = JSON.stringify(config, null, 2)
    }
    app.usingComponents = {}
    app.lazyCodeLoading = 'requiredComponents'
    updates['app.json'] = JSON.stringify(app, null, 2)
    return updates
}

function pruneUnusedVantComponents (assets) {
    const readJson = name => JSON.parse(assets[name].source().toString())
    const app = readJson('app.json')
    const queue = [...(app.pages || [])]
    for (const pkg of app.subPackages || app.subpackages || []) {
        for (const page of pkg.pages || []) {
            const pagePath = typeof page === 'string' ? page : page.path
            queue.push(path.join(pkg.root, pagePath))
        }
    }

    const visited = new Set()
    const usedVantDirectories = new Set(VANT_SHARED_DIRECTORIES)
    while (queue.length) {
        const owner = queue.pop()
        if (visited.has(owner)) continue
        visited.add(owner)
        const jsonName = owner + '.json'
        if (!assets[jsonName]) continue
        const config = readJson(jsonName)
        for (const target of Object.values(config.usingComponents || {})) {
            if (typeof target !== 'string' || target.startsWith('plugin://')) continue
            const resolved = path.normalize(target.startsWith('/')
                ? target.slice(1)
                : path.join(path.dirname(owner), target))
            queue.push(resolved)
            if (resolved.startsWith(VANT_ROOT)) {
                usedVantDirectories.add(resolved.slice(VANT_ROOT.length).split('/')[0])
            }
        }
    }

    for (const name of Object.keys(assets)) {
        if (!name.startsWith(VANT_ROOT)) continue
        const directory = name.slice(VANT_ROOT.length).split('/')[0]
        if (!usedVantDirectories.has(directory)) {
            delete assets[name]
        }
    }
}

class WechatComponentInjectionPlugin {
    apply (compiler) {
        compiler.hooks.emit.tap({ name: 'WechatComponentInjectionPlugin', stage: 1000 }, compilation => {
            try {
                const updates = prepareComponentInjection(compilation.assets)
                for (const [name, source] of Object.entries(updates)) {
                    compilation.assets[name] = { source: () => source, size: () => Buffer.byteLength(source) }
                }
                pruneUnusedVantComponents(compilation.assets)
            } catch (error) {
                compilation.errors.push(error)
            }
        })
    }
}

module.exports = WechatComponentInjectionPlugin
module.exports.prepareComponentInjection = prepareComponentInjection
module.exports.pruneUnusedVantComponents = pruneUnusedVantComponents
