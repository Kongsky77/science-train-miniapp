const fs = require('fs')
const path = require('path')

const [, , outputDirectory, environmentFile] = process.argv

if (!outputDirectory || !environmentFile) {
  throw new Error('Usage: prepare-mp-project-config <output-directory> <environment-file>')
}

const projectRoot = path.resolve(__dirname, '..')
const sourceConfigPath = path.join(projectRoot, 'project.config.json')
const environmentPath = path.resolve(projectRoot, environmentFile)
const outputPath = path.resolve(projectRoot, outputDirectory, 'project.config.json')
const environment = parseEnvironmentFile(environmentPath)
const projectConfig = JSON.parse(fs.readFileSync(sourceConfigPath, 'utf8'))
const appId = environment.VUE_APP_WECHAT_APPID
const projectName = environment.VUE_APP_WECHAT_PROJECT_NAME || environment.VUE_APP_THEME_TYPE || 'activity-users-mp'
const libVersion = environment.VUE_APP_WECHAT_LIB_VERSION || projectConfig.libVersion

if (!/^wx[a-zA-Z0-9]+$/.test(appId || '')) {
  throw new Error(`Invalid VUE_APP_WECHAT_APPID in ${environmentFile}`)
}

projectConfig.appid = appId
projectConfig.projectname = projectName
projectConfig.libVersion = libVersion

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, `${JSON.stringify(projectConfig, null, 2)}\n`, 'utf8')

console.log(`Prepared WeChat project config: ${path.relative(projectRoot, outputPath)}`)

function parseEnvironmentFile (filePath) {
  const result = {}
  const content = fs.readFileSync(filePath, 'utf8')
  content.split(/\r?\n/).forEach((line) => {
    const matched = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (!matched) return
    result[matched[1]] = stripQuotes(matched[2])
  })
  return result
}

function stripQuotes (value) {
  if (value.length >= 2) {
    const first = value.charAt(0)
    const last = value.charAt(value.length - 1)
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1)
    }
  }
  return value
}
