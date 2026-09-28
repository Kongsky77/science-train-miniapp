import ApiResponse from '@/beans/ApiResponse'
import CheckInPointListResult from '@/beans/check-in/CheckInPointListResult'
import CheckInSubmitRequest from '@/beans/check-in/CheckInSubmitRequest'
import CheckInSubmitResult from '@/beans/check-in/CheckInSubmitResult'
import HttpService from '@/common/utils/HttpService'

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI

export default class CheckInService {
  getPoints (
    activityId: string,
    childId: string,
    showLoading = true
  ): Promise<ApiResponse<CheckInPointListResult>> {
    const baseUrl = this.getBaseUrl(activityId, childId)
    if (!baseUrl) {
      return Promise.resolve(this.missingBaseApiResponse<CheckInPointListResult>())
    }
    return HttpService.doAuthenticatedRequest(
      `${baseUrl}/points`,
      'get',
      undefined,
      undefined,
      showLoading
    ).then((response: any) => this.parseResponse(response, CheckInPointListResult.fromRaw))
  }

  submit (
    activityId: string,
    childId: string,
    pointId: string,
    request: CheckInSubmitRequest
  ): Promise<ApiResponse<CheckInSubmitResult>> {
    const baseUrl = this.getBaseUrl(activityId, childId)
    if (!baseUrl) {
      return Promise.resolve(this.missingBaseApiResponse<CheckInSubmitResult>())
    }
    const url = `${baseUrl}/points/${encodeURIComponent(String(pointId))}`
    return HttpService.doAuthenticatedRequest(url, 'post', request, undefined, false)
      .then((response: any) => this.parseResponse(response, CheckInSubmitResult.fromRaw))
  }

  private getBaseUrl (activityId: string, childId: string): string {
    if (!ACTIVITY_BASEAPI) return ''
    return `${ACTIVITY_BASEAPI}/api/v1/activity/main/check-in/` +
      `${encodeURIComponent(String(activityId))}/${encodeURIComponent(String(childId))}`
  }

  private parseResponse<T> (response: any, parseData: (raw: any) => T): ApiResponse<T> {
    if (response && response.statusCode === 401) {
      return new ApiResponse<T>(false, 'UNAUTHENTICATED', '登录状态已失效')
    }
    if (!response || !response.data || typeof response.data !== 'object') {
      const statusCode = response && response.statusCode
      return new ApiResponse<T>(
        false,
        statusCode ? `HTTP_${statusCode}` : 'INVALID_RESPONSE',
        '打卡服务返回异常'
      )
    }
    const result = ApiResponse.parseToObject<any>(response)
    if (result.success && result.data) {
      result.data = parseData(result.data)
    }
    return result as ApiResponse<T>
  }

  private missingBaseApiResponse<T> (): ApiResponse<T> {
    return new ApiResponse<T>(false, 'ACTIVITY_BASEAPI_MISSING', '打卡服务地址尚未配置')
  }
}
