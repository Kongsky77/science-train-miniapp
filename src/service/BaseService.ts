import MyJsonConverter from '@/common/json_ts_converter/MyJsonConverter'
import { Utils } from '@/common/utils/Utils'

export default class BaseService {

  /**
   * 标准数据格式的请求回调处理函数 - 完整参数回调
   * @param response 响应数据
   * @param classReference 转换对象引用
   * @param callback 回调
   */
  protected standardCallback2<T> (
    response: any,
    classReference: {new(): T;},
    callback: (resp: T | undefined, success: boolean, errorCode?: string, errorDesc?: string) => void
  ) {
    // console.log(response)
    let resp: T | undefined
    let success = response.data.success
    let errorDesc = response.data.errorDesc
    let errorCode = response.data.errorCode
    if (success) {
      resp = MyJsonConverter.getInstance().deserializeObject(response.data.data, classReference)
    }
    callback && callback(resp, success, errorCode, errorDesc)
  }

  /**
   * data为数组格式的请求回调处理函数
   * @param response 响应数据
   * @param classReference 转换对象引用
   * @param callback 回调
   */
  protected arrayDataCallback<T> (
    response: any,
    classReference: {new(): T;},
    callback: (resp: Array<T> | undefined, success: boolean, errorCode?: string, errorDesc?: string) => void
  ) {
    // console.log(response)
    let resp: Array<T> | undefined
    let success = response.data.success
    let errorDesc = response.data.errorDesc
    let errorCode = response.data.errorCode
    if (success) {
      resp = MyJsonConverter.getInstance().deserializeArray(response.data.data, classReference)
    }
    callback && callback(resp, success, errorCode, errorDesc)
  }

  /**
   *
   * @param api api对象，基本参数
   * @param urlFormat url参数对象，如：/api/v1/user/{id} -> { id: id }
   * @param v 版本，例如：v1
   * @param prefix api前缀，例如：/api/
   */
  protected buildUrl (api: BaseApi, urlFormat: any = undefined, v: string = 'v1', prefix: string = '/api/'): string {
    let url = process.env.VUE_APP_API_BASE_URL + prefix + v + api.requestUrl
    if (urlFormat) {
      url = Utils.urlFormat(url, urlFormat)
    }
    return url
  }

}

interface BaseApi {
  method: string,
  requestUrl: string
}
