import MyJsonConverter from '@/common/json_ts_converter/MyJsonConverter'

export default class ApiResponse<T> {
  success: boolean = false
  code: string = ''
  error: string = ''
  errorCode: string = ''
  data?: T

  constructor (success: boolean, code: string, error: string, data?: T) {
    this.success = success
    this.data = data
    this.code = code
    this.error = error
  }

  static parseToObject<T> (response: any, classReference?: { new (): T }): ApiResponse<T> {
    const body = response.data
    const { success, errorCode, errorDesc, data } = body
    const result = data && classReference ? MyJsonConverter.getInstance().deserializeObject(data, classReference) : data
    return new ApiResponse(success, errorCode, errorDesc, result)
  }

  static parseArray<T> (response: any, classReference?: { new (): T }): ApiResponse<Array<T>> {
    const body = response.data
    const { success, errorCode, errorDesc, data } = body
    const result = data && classReference ? MyJsonConverter.getInstance().deserializeArray(data, classReference) : data
    return new ApiResponse(success, errorCode, errorDesc, result)
  }
}
