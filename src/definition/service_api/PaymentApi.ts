const PaymentApi = {
  prefix: '/api/',
  version: 'v1',
  payment: {
    url: '/payment/',
    do: {
      requestUrl: '',
      method: 'post'
    },
    resultNotice: {
      requestUrl: '/notify/wx/public/',
      method: 'post'
    }
  }
}

export default PaymentApi
