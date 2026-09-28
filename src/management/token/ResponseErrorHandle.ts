import TokenManagement from '@/management/token/TokenManagement'

export default class ResponseErrorHandle {

  static responseErrorCallback (error?: any) {
    if (error.code === 'ECONNABORTED') {
      alert('您当前的网络存在异常，请刷新页面重试。')
    } else if (error.response.status === 401) {
      let unAuthUrl = '/code-login.html'
      TokenManagement.getInstance().clearStorage()
      window.location.href = unAuthUrl
    }
  }

}
