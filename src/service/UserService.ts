import { Utils } from '@/common/utils/Utils'
import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'
import LoginResponse from '@/beans/user/res/LoginResponse'
import WechatLoginRequest from '@/beans/user/req/WechatLoginRequest'
import UserInfoResponse from '@/beans/common/UserInfoResponse'
import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import PersonalActivityWorkResponse from '@/beans/activity/res/PersonalActivityWorkResponse'
import UserMergerInfo from '@/definition/account-merger/UserMergerInfo'
import UserApi from '@/definition/service_api/UserApi'
import ActivityApi from '@/definition/service_api/ActivityApi'
import UserMergerRequest from '@/beans/user/req/UserMergerRequest'
import MyJsonConverter from '@/common/json_ts_converter/MyJsonConverter'
import ChannelManagement from '@/management/channel/ChannelManagement'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'
import TokenManagement from '@/management/token/TokenManagement'
import { sign } from '@/utils/AppSignUtil'
import { isMockMode } from '@/common/utils/MockMode'

const USER_CENTER_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI
const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI

const referer = process.env.VUE_APP_PROJECT_NAME

const KJG_MOCK_USER_ID = 'kjg-mock-main-user'
const KJG_MOCK_PHONE = '13800000000'
const KJG_MOCK_TOKEN = 'kjg-mock-main-token'

function createKjgMockUser (phoneNumber = KJG_MOCK_PHONE): UserInfoResponse {
  const user = new UserInfoResponse()
  user.userId = KJG_MOCK_USER_ID
  user.realName = '科普列车用户'
  user.nickName = '科普列车用户'
  user.phoneNumber = phoneNumber
  return user
}

function createKjgMockLoginResponse (phoneNumber = KJG_MOCK_PHONE): ApiResponse<LoginResponse> {
  const loginResponse = new LoginResponse()
  loginResponse.accessToken = KJG_MOCK_TOKEN
  loginResponse.user = createKjgMockUser(phoneNumber)
  return new ApiResponse(true, '', '', loginResponse)
}

class UserService {
  login (phoneNumber: string,code: string) {
    if (isMockMode()) {
      return Promise.resolve(createKjgMockLoginResponse(phoneNumber))
    }
    const url = `${ USER_CENTER_BASEAPI }/api/v1/user/auth/main/sms/public`
    let kocId: string
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== '') {
      kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC)
    }else {
      kocId = ''
    }
    const requestData = {
      phoneNumber,
      code,
      referer,
      kocId
    }
    return HttpService.doRequest(url,'post',requestData).then((response: any) => {
      return ApiResponse.parseToObject(response,LoginResponse)
    })
  }

  loginOut () {
    if (isMockMode()) {
      return Promise.resolve(new ApiResponse(true, '', ''))
    }
    const url = `${ USER_CENTER_BASEAPI }/api/v1/user/info/logout`
    return HttpService.doRequest(url,'get').then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  static async fetchOpenId(loginCode: string, callback: (success: boolean, openId: string) => void) {
    const requestData = {
      appid: process.env.VUE_APP_WECHAT_APPID,
      code: loginCode
    }
    const url = `${ USER_CENTER_BASEAPI + UserApi.prefix + UserApi.version + UserApi.openId.requestUrl }`
    const signResult = sign(process.env.VUE_APP_SEVER_APPID,process.env.VUE_APP_SEVER_SECRET,{...requestData})
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, UserApi.openId.method, requestData,header)
    const {data: result,success: success} = data
    callback(success,result)
  }

  wechatLogin (data: WechatLoginRequest) {
    if (isMockMode()) {
      return Promise.resolve(createKjgMockLoginResponse())
    }
    const url = `${ USER_CENTER_BASEAPI }/api/v1/user/auth/main/wx/ma/public`
    const {phoneEncryptedData,phoneIv,code} = data
    let kocId: string
    if (ChannelManagement.getChannelId(ChannelKeyEnum.KOC) !== '') {
      kocId = ChannelManagement.getChannelId(ChannelKeyEnum.KOC)
    }else {
      kocId = ''
    }
    const requestData = new WechatLoginRequest(phoneEncryptedData,phoneIv,code, kocId)

    return HttpService.doRequest(url,'post',requestData).then((response: any) => {
      return ApiResponse.parseToObject(response,LoginResponse)
    })
  }

  getUserInfo () {
    if (isMockMode()) {
      return Promise.resolve(new ApiResponse(true, '', '', createKjgMockUser()))
    }
    const url = `${ USER_CENTER_BASEAPI }/api/v1/user/info/self`
    return HttpService.doRequest(url,'get').then((response: any) => {
      return ApiResponse.parseToObject(response,UserInfoResponse)
    })
  }

  // 活动次数
  getUserActivityTime (userId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/user/${ userId }/activity/entry-count/public`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }
  // 作品数量
  getUserWorksNumber (userId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/activity/production/user/${userId}/count`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  // 证书数量
  getUserCertNumber (userId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/cert/user/${userId}/count`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  getUserPeerData (userId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/user/${ userId }/surpass-weight/public`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  getBadgeNumber (userId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/badge/user/${ userId }/count/public`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  getBadgeRankInfo (childId: string) {
    const url = `${ ACTIVITY_BASEAPI }/api/v1/rank/badge/${ childId }`
    return HttpService.doRequest(url,'get',undefined,undefined,false).then((response: any) => {
      return ApiResponse.parseToObject(response,BadgeRankResponse)
    })
  }

  changePhone (phoneNumber: string,code: string) {
    const url = `${ USER_CENTER_BASEAPI }/api/v1/user/info/self/phone`
    const requestData = {
      phoneNumber,
      code,
      referer
    }
    return HttpService.doRequest(url,'put',requestData).then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  async queryCurrentAccountMergeType (
      userId: string,
      callback: (success: boolean,code: string,userMergerInfo?: UserMergerInfo) => void
  ) {
    const url = `${ USER_CENTER_BASEAPI }/${ UserApi.prefix + UserApi.version + UserApi.queryAccountMergerType.requestUrl }?subUserId=${ userId }`
    const {data: requestResult} = await HttpService.doRequest(url,UserApi.queryAccountMergerType.method,null)
    const {data: data,success: success,errorCode: errCode, code: code} = requestResult
    if (data) {
      const parseData = MyJsonConverter.getInstance().deserializeObject(data, UserMergerInfo)
      callback(success,code,parseData)
    }else {
      callback(success,errCode)
    }


  }

  async accountMerge (
      userMergerRequest: UserMergerRequest,
      callback: (success: boolean, code: string) => void
  ) {
    const url = `${USER_CENTER_BASEAPI}/${UserApi.prefix + UserApi.version + UserApi.accountMerger.requestUrl}`
    const {data: requestResult} = await HttpService.doRequest(url,UserApi.accountMerger.method,userMergerRequest)
    const {success: success, code: code} = requestResult
    callback(success, code)
  }

  subUserLogin (subUserId: string) {
    if (isMockMode()) {
      const loginResponse = new LoginResponse()
      loginResponse.accessToken = `kjg-mock-sub-token-${subUserId}`
      return Promise.resolve({
        success: true,
        data: loginResponse,
        errorDesc: ''
      })
    }
    const url = `${USER_CENTER_BASEAPI}/api/v1/user/auth/sub`

    const parentToken = TokenManagement.getInstance().getToken()
    const customeHeader = {
      Authorization: `Bearer ${parentToken}`
    }

    const data = {
      subUserId: subUserId,
      referer: referer,
      channelCode: process.env.VUE_APP_CHANNEL_CODE
    }

    console.log('subUserLogin parentToken', parentToken)
    console.log('subUserLogin data', data)

    return HttpService.doRequest(url, 'post', data).then((response) => {
      let success = response.data.success
      let errorDesc = response.data.errorDesc
      let data
      if (success) {
        console.log('subUserLogin', data)

        data = MyJsonConverter.getInstance().deserializeObject(response.data.data, LoginResponse)
      }
      return {
        success,
        data,
        errorDesc
      }
    })
  }
}

export default UserService
