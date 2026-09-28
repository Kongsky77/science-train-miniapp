// Keep route URLs stable: each existing feature directory becomes a subpackage.
// The home page and login stay in the main package for startup and authentication.
const featureRoots = [
  'pages/fillInfo',
  'pages/internalpages',
  'pages/kjgQuiz',
  'pages/kjgLottery',
  'pages/kjgCheckIn',
  'pages/kjgMuseum',
  'pages/rank',
  'pages/writeChildInfo',
  'pages/editInfo',
  'pages/childrenSetting',
  'pages/activityDetail',
  'pages/my-works',
  'pages/kjgActivityDetail',
  'pages/messageDetail',
  'pages/selectSchool',
  'pages/setting',
  'pages/avatar',
  'pages/cert'
]

module.exports = function configurePages (pagesJson) {
  if (process.env.UNI_PLATFORM !== 'mp-weixin' || process.env.VUE_APP_THEME_TYPE !== 'kjg') {
    return pagesJson
  }
  const result = { ...pagesJson, pages: [...pagesJson.pages], subPackages: [...(pagesJson.subPackages || [])] }
  for (const root of featureRoots) {
    const pages = result.pages.filter(page => page.path.startsWith(root + '/'))
    if (!pages.length) continue
    result.pages = result.pages.filter(page => !page.path.startsWith(root + '/'))
    result.subPackages.push({
      root,
      pages: pages.map(page => ({ ...page, path: page.path.slice(root.length + 1) }))
    })
  }
  return result
}
