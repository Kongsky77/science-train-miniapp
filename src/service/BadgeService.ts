import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'
import BadgeItemResponse from '@/beans/badge/res/BadgeItemResponse'
import BadgeResponse from '@/beans/badge/res/BadgeResponse'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'
import BuriedPointResponse from '@/beans/user/res/BuriedPointResponse'

const ACTIVITY_BASE_API = process.env.VUE_APP_ACTIVITY_BASEAPI
const USER_CENTER_BASE_API = process.env.VUE_APP_USER_CENTER_BASEAPI

class BadgeService {
  getBadgeList (userId: string) {
    const url = `${ACTIVITY_BASE_API}/api/v1/badge/user/${userId}`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, BadgeItemResponse)
    })
  }

  getBadge (badgeId: string) {
    const url = `${ACTIVITY_BASE_API}/api/v1/badge/${badgeId}`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseToObject(response, BadgeResponse)
    })
  }

  buriedPoint (buriedPointRequest: BuriedPointRequest) {
    const url = `${USER_CENTER_BASE_API}/api/v1/other/log/page-access/public`

		return HttpService.doRequest(url,'post', buriedPointRequest,undefined,false).then((response: any) => {
      return response.data
    })
  }
}

export default BadgeService
