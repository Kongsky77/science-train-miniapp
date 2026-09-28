/**
 * 微信分享
 */
const WxShareAPI = {
  prefix: '/api/',
  version: 'v1',
  // 获取微信分享参数
  jssdkConfig: {
    method: 'get',
    requestUrl: '/weixin/public/jssdk'
  }
}
export default WxShareAPI
