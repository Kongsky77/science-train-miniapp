const fs = require('fs')
const path = require('path')

const root = path.resolve(process.argv[2] || 'dist/dev/kjg-integration')
const app = JSON.parse(fs.readFileSync(path.join(root, 'app.json'), 'utf8'))
const packages = (app.subPackages || app.subpackages || []).map(pkg => pkg.root.replace(/\/$/, '') + '/')
const sizes = { main: 0 }
function walk (directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.isFile()) {
      const relative = path.relative(root, full).split(path.sep).join('/')
      const owner = packages.find(prefix => relative.startsWith(prefix)) || 'main'
      sizes[owner] = (sizes[owner] || 0) + fs.statSync(full).size
    }
  }
}
walk(root)
console.log(JSON.stringify({ mainBytes: sizes.main, mainKiB: +(sizes.main / 1024).toFixed(2), limitBytes: 1500000, packages: sizes }, null, 2))
if (sizes.main >= 1500000) {
  console.error('Main package must be smaller than 1,500,000 bytes.')
  process.exitCode = 1
}
