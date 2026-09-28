import html2canvas from 'html2canvas'

// 函数装饰器，可以用于将一个断言函数取反
const not = (assetFn: Function): Function => (...args: any): any => {
  return !assetFn(...args)
}

const isInWechat = (): boolean => navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1

const isInIos = (): boolean => {
  return (
    [ 'iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod' ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

const isNotInWechat: Function = not(isInWechat)

const isNotInIos: Function = not(isInIos)

// 获取query字符串中的值
const getQuerys = (queryString: string): Object => {
  let querys = {}
  let parts = queryString.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value): any => {
    querys[key] = value
  })
  return querys
}

// 生成图片地址

const generateImageUrl = (domId: string): Promise<string> => {
  return html2canvas(document.querySelector(domId), {
    scrollY: 0,
    scrollX: 0,
    scale: window.devicePixelRatio,
    useCORS: true
  }).then((canvas) => {
    console.log('生成成功')
    const generatedUrl = canvas.toDataURL()
    return generatedUrl
  })
}

export default Object.freeze({
  isInWechat,
  isInIos,
  isNotInWechat,
  isNotInIos,
  getQuerys,
  generateImageUrl
})
