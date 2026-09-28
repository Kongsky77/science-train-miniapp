const WeChatApi = {
  prefix: '/api/',
  version: 'v1',
  // 是否关注了公众号
  subscriptionInfo: {
    method: 'get',
    requestUrl: '/wx/ma/is-subscribe-mp/public'
  },
  getSubscriptionConfig(appid?: string) {
    return {
      method: 'get',
      requestUrl: `/wx/mp/${ appid }/subscription/config/public`
    }
  },
}
export default WeChatApi
