/**
 * 网络请求工具类
 * uni app request: https://uniapp.dcloud.io/api/request/request
 */
import LangEnum from '@/definition/lang/LangEnum'
import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'
import TokenManagement from '@/management/token/TokenManagement'

export default class HttpService {
  // 请求超时时间，单位：ms
  private static timeout: number = Number(process.env.VUE_APP_API_TIMEOUT)
  private static THEME_TYPE: string = process.env.VUE_APP_THEME_TYPE
  private static channelCode: string = process.env.VUE_APP_CHANNEL_CODE

  static loadingCounter = 0

  static expiredCounter = 0

  /**
   * 发起请求
   * @param url
   * @param method -  'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'
   * @param data
   * @param headers
   * @param showLoading
   */
  public static doRequest (
    url: string,
    method?: string,
    data?: object,
    headers?: object,
    showLoading = true
  ): Promise<any> {
    return HttpService.request(url, method, data, headers, showLoading, true, true)
  }

  /**
   * 发起携带用户登录凭证、但由调用方自行处理 401 的请求。
   */
  public static doAuthenticatedRequest (
    url: string,
    method?: string,
    data?: object,
    headers?: object,
    showLoading = true
  ): Promise<any> {
    return HttpService.request(url, method, data, headers, showLoading, true, false)
  }

  /**
   * 发起不携带用户登录凭证的公开请求。
   */
  public static doPublicRequest (
    url: string,
    method?: string,
    data?: object,
    headers?: object,
    showLoading = true
  ): Promise<any> {
    return HttpService.request(url, method, data, headers, showLoading, false, false)
  }

  private static request (
    url: string,
    method?: string,
    data?: object,
    headers?: object,
    showLoading = true,
    includeAuthorization = true,
    handleUnauthorized = true
  ): Promise<any> {
    if (showLoading) {
      HttpService.loadingShow()
    }
    return new Promise<any>((resolve, reject) => {
      const options = {
        url: url,
        method: method as any,
        header: this.buildHeaders(headers, includeAuthorization),
        data: data,
        timeout: this.timeout,
        success: (res: any) => {
          if (includeAuthorization && handleUnauthorized && res.statusCode === 401) {
            HttpService.expiredCounter += 1
            if (HttpService.expiredCounter === 1) {
              TokenManagement.getInstance().clearStorage()
              uni.showModal({
                title: '提示',
                content: '登录过期，请重新登录',
                showCancel: false,
                success () {
                  uni.reLaunch({
                    url: '/pages/login/index',
                    success: HttpService.doMoveTo
                  })
                }
              })
              return
            }
          }

          resolve(res)
          if (showLoading) {
            HttpService.loadingHide()
          }
        },
        fail: (err: any) => {
          reject(err)
          if (showLoading) {
            HttpService.loadingHide()
          }
        },
        complete: () => {
          if (showLoading) {
            HttpService.loadingHide()
          }
        }
      }
      // 发起请求
      uni.request(options)
    })
  }

  private static doMoveTo () {
    HttpService.expiredCounter = 0
  }

  /**
   * 构建 header
   * @private
   */
  private static buildHeaders (headers?: object, includeAuthorization = true): Object {
    const result: any = {}

    // 用户token
    if (includeAuthorization) {
      const token = TokenManagement.getInstance().getToken()
      if (token) {
        result['authorization'] = 'Bearer ' + token
      }
    }
    

    // if (this.THEME_TYPE !== ThemeTypeEnum.NORMAL) {
      result[LangEnum.REQUEST_CHANNEL_KEY] = this.channelCode
    // }

    // 自定义header
    if (headers) {
      for (const key of Object.keys(headers)) {
        if (headers.hasOwnProperty(key)) {
          result[key] = headers[key]
        }
      }
    }

    return result
  }

  private static loadingShow () {
    if (HttpService.loadingCounter === 0) {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
    }
    HttpService.loadingCounter++
  }

  private static loadingHide () {
    HttpService.loadingCounter--
    if (HttpService.loadingCounter <= 0) {
      HttpService.loadingCounter = 0
      uni.hideLoading()
    }
  }
}
