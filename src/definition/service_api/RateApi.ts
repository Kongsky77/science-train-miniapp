const RateApi = {
  prefix: '/api/',
  version: 'v1',
  productDetail: {
    requestUrl: '/activity/production/',
    method: 'get'
  },
  starSystemEvaluation: {
    requestUrl: '/rate/',
    suffix: '/star/count',
    method: 'get',
  },
  commentList: {
    requestUrl: '/rate/',
    suffix: '/star/comment',
    method: 'get'
  },
  readProduct: {
    requestUrl: '/activity/production/read/',
    method: 'post'
  }
}


export default RateApi
