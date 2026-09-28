const OrderApi = {
  version: 'v1',
  prefix: '/api/',
  createOrder: {
    requestUrl: '/order/create',
    method: 'post'
  },
  info: {
    url: '/order/',
    page: {
      requestUrl: 'page'
    },
    complete: {
      requestUrl: '',
    },
    Simplified: {
      suffix: '/basic'
    },
    method: 'get'
  },
  cancel: {
    url: '/order/',
    suffix: '/cancel',
    method: 'post'
  },
  up_expired:{
    url: `/order/un-expired`,
    method: 'get'
}
}

export default OrderApi
