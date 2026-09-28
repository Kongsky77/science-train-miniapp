const DemoAPI = {
  prefix: '/api/',
  version: 'v1',
  call: {
    method: 'post',
    requestUrl: '/ai/demo'
  },
  publicAiDemo: {
    method: 'post',
    requestUrl: '/ai/demo/public'
  },
  count: {
    method: 'get',
    requestUrl: '/ai/demo/count/{sectionId}'
  },
  // 获取微软接口访问access token
  msToken: {
    method: 'get',
    requestUrl: '/ai/demo/token/ms/{type}'
  }
}
export default DemoAPI
