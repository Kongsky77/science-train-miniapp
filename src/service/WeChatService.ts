import ReceiveSubscriptionRequest from '@/beans/we_chat/request/ReceiveSubscriptionRequest'
import ReceiveSubscriptionResponse from '@/beans/we_chat/reponse/ReceiveSubscriptionResponse'
import { sign } from '@/utils/AppSignUtil'
import WeChatApi from '@/definition/service_api/WeChatApi'
import HttpService from '@/common/utils/HttpService'
import MyJsonConverter from '@/common/json_ts_converter/MyJsonConverter'

const WECHAT_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI

export default class WeChatService {
  public static receiveSubscriptionInfo (
    requestData: ReceiveSubscriptionRequest,
    callback: (success: boolean, data: ReceiveSubscriptionResponse) => void
  ): void {
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...requestData })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const url = `${WECHAT_BASEAPI + WeChatApi.prefix + WeChatApi.version + WeChatApi.subscriptionInfo.requestUrl}`
    HttpService.doRequest(url, WeChatApi.subscriptionInfo.method, requestData, header, false).then((res) => {
      if (res.data.success) {
        const responseData: ReceiveSubscriptionResponse = MyJsonConverter.getInstance().deserializeObject(
          res.data.data,
          ReceiveSubscriptionResponse
        )
        callback(res.data.success, responseData)
      }
    })
  }

  public static getSubscriptionConfig (
    callback: (success: boolean, data: Array<String>) => void
  ): void {
    const url = `${WECHAT_BASEAPI + WeChatApi.prefix + WeChatApi.version + WeChatApi.getSubscriptionConfig(process.env.VUE_APP_WECHAT_APPID).requestUrl}`
    HttpService.doRequest(url, WeChatApi.getSubscriptionConfig().method, {}, {}, false).then((res) => {
      if (res.data.success) {
        // console.log('getSubscriptionConfig:',res.data.data)
        // const responseData: Array<String> = MyJsonConverter.getInstance().deserializeArray(
        //   res.data.data,
        //   String
        // )
        callback(res.data.success, res.data.data)
      }
    })
  }
}
