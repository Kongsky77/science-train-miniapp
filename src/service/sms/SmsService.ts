import { Utils } from '@/common/utils/Utils'
import MyJsonConverter from '@/common/json_ts_converter/MyJsonConverter'
import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'

const USER_CENTER_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI

class SmsService {
  getSmsCode (phoneNumber: string, bizType: number) {
    const referer = process.env.VUE_APP_PROJECT_NAME
    const data = {
      referer,
      phoneNumber,
      bizType
    }
    const url = `${USER_CENTER_BASEAPI}/api/v1/captcha/sms/public`
    return HttpService.doRequest(url, 'post', data).then((response: any) => {
      return ApiResponse.parseToObject(response, String)
    })
  }
}

export default SmsService
