// import { Utils } from '@/common/utils/Utils'
import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'
import ActivityItem from '@/beans/activity/ActivityItem'
import ActivityFullList from '@/beans/activity/res/ActivityFullList'
import ListRequest from '@/beans/activity/req/ListRequest'
import ActivityFullItem from '@/beans/activity/ActivityFullItem'
import ActivityCopy from '@/beans/activity/res/ActivityCopy'
import ActivityMemberResponse from '@/beans/activity/res/ActivityMemberResponse'
import SchoolItem from '@/beans/activity/res/SchoolItem'
import FormResponse from '@/beans/common/FormResponse'
import SubmitActivityFormRequest from '@/beans/activity/req/SubmitActivityFormRequest'
import GuideInfoResponse from '@/beans/activity/res/GuideInfoResponse'
import ChildActivityListResponse from '@/beans/activity/res/ChildActivityListResponse'
import RankTabResponse from '@/beans/activity/res/RankTabResponse'
import RankListResponse from '@/beans/activity/res/RankListResponse'
import RankListItemResponse from '@/beans/activity/res/RankListItemResponse'
import LeaderboardEntry from '@/beans/rank/res/LeaderboardEntry'
import LeaderboardPage from '@/beans/rank/res/LeaderboardPage'
import CertResponse from '@/beans/activity/res/CertResponse'
import ChildActivityItem from '@/beans/activity/ChildActivityItem'
import SchoolItemList from '@/beans/activity/res/SchoolItemPage'
import ActivityApi from '@/definition/service_api/ActivityApi'
import PersonalActivityWorkResponse from '@/beans/activity/res/PersonalActivityWorkResponse'
import MyJsonConverter from '@/common/utils/MyJsonConverter'
import PersonalSubmitConfigResponse from '@/beans/activity/res/PersonalSubmitConfigResponse'
import UploadFileResponse from '@/beans/blob/res/UploadFileResponse'
import TokenManagement from '@/management/token/TokenManagement'
import FileRequest from '@/beans/activity/req/FileRequest'
import PersonalActivityWorkRequest from '@/beans/activity/req/PersonalActivityWorkRequest'
import PopupVO from '@/beans/activity/res/PopupVO'
import AppTypeEnum from '@/definition/common/AppTypeEnum'
import SwiperVO from '@/beans/activity/res/SwiperVO'
import { sign } from '@/utils/AppSignUtil'
import ColumnItemVO from '@/beans/activity/res/ColumnItemVO'
import FilterActivityDTO from '@/beans/activity/req/FilterActivityDTO'
import ActivityTagVO from '@/beans/activity/res/ActivityTagVO'
import PositionEnum from '@/definition/common/PositionEnum'
import AppStatus from '@/beans/common/AppStatus'
import ActivityPriceVO from '@/beans/activity/res/ActivityPriceVO'
import LessonCardPriceVO from '@/beans/activity/res/LessonCardPriceVO'
import WeAnalysisEventManagement from '@/management/wx/WeAnalysisEventManagement'
import EventNameEnum from '@/definition/common/EventNameEnum'
import SignActivitySuccessDTO from '@/definition/common/event/SignActivitySuccessDTO'
import ProductionPublishedListDTO from '@/beans/activity/productionPublished/dto/ProductionPublishedListDTO'
import ProductionPublishedListVO from '@/beans/activity/productionPublished/vo/ProductionPublishedListVO'
import UserActivityEntryInfo from '@/beans/activity/res/UserActivityEntryInfo'
import { Utils } from '@/common/utils/Utils'

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI
const USER_CENTER_BASEAPI = process.env.VUE_APP_USER_CENTER_BASEAPI

class ActivityService {
  getChildActivityDetail (activityId: string, childId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/${childId}`
    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseToObject(response, ChildActivityItem)
    })
  }

  getIndexSwiperData () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/carousel/app/index/public`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, ActivityItem)
    })
  }

  receiveRecommendActivitySwiper () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/carousel/app/index/public`
    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, SwiperVO)
    })
  }

  receiveAllActivitySwiper () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/carousel/app/new-activity/public`
    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, SwiperVO)
    })
  }

  getNewActivitySwiper () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/carousel/app/new-activity/public`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, ActivityItem)
    })
  }

  getAllActivityList (data: ListRequest = new ListRequest()) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/page/public`

    return HttpService.doRequest(url, 'get', data).then((response: any) => {
      return ApiResponse.parseToObject(response, ActivityFullList)
    })
  }

  getJoinedActivityList (data: ListRequest = new ListRequest()) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/self/page`

    return HttpService.doRequest(url, 'get', data).then((response: any) => {
      return ApiResponse.parseToObject(response, ActivityFullList)
    })
  }

  getDetail (id: string, showLoading = true) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${id}/basic/public`

    return HttpService.doRequest(url, 'get', undefined, undefined, showLoading).then((response: any) => {
      return ApiResponse.parseToObject(response, ActivityFullItem)
    })
  }

  getPublicDetail (id: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${id}/basic/public`

    return HttpService.doPublicRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseToObject(response, ActivityFullItem)
    })
  }

  getDetailCopy (id: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${id}/copy/public`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseArray(response, ActivityCopy)
    })
  }

  getPublicDetailCopy (id: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${id}/copy/public`

    return HttpService.doPublicRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseArray(response, ActivityCopy)
    })
  }

  getMembers (id: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${id}/users/public`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response: any) => {
      return ApiResponse.parseToObject(response, ActivityMemberResponse)
    })
  }

  getSchools () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/organization/district`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseArray(response, SchoolItem)
    })
  }

  getSchoolsByCityPage (city: string, data: ListRequest, schoolName: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/organization/district/page?city=${city}&name=${schoolName}`

    return HttpService.doRequest(url, 'get', data).then((response: any) => {
      return ApiResponse.parseToObject(response, SchoolItemList)
    })
  }

  getSchoolsPage (data: ListRequest, schoolName: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/organization/district/page?name=${schoolName}`

    return HttpService.doRequest(url, 'get', data).then((response: any) => {
      return ApiResponse.parseToObject(response, SchoolItemList)
    })
  }

  getPickerList (code: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/district/parent/${code}`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseToObject(response)
    })
  }

  getActivityForm (activityId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/entry-field/public`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseArray(response, FormResponse)
    })
  }

  submitActivityForm (activityId: string, data: SubmitActivityFormRequest, activityName: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/entry/main`

    return HttpService.doRequest(url, 'post', data).then((response: any) => {
      const result = ApiResponse.parseArray(response)
      if (data.preview === '0' && result.success && activityName) {
        WeAnalysisEventManagement.reportEvent(
          EventNameEnum.SIGN_UP_SUCCESS,
          new SignActivitySuccessDTO(activityName, data.subUserId)
        )
      }
      return result
    })
  }

  getGuideInfo (activityId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/${activityId}/entry-guide/public`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseToObject(response, GuideInfoResponse)
    })
  }

  getChildActivityList (userId: string, data: ListRequest = new ListRequest()) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/sub-user/${userId}/page`
    return HttpService.doRequest(url, 'get', data, undefined, false).then((response: any) => {
      return ApiResponse.parseToObject(response, ChildActivityListResponse)
    })
  }

  getRankTabs (activityId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/rank/config/activity/${activityId}/public`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseToObject(response, RankTabResponse)
    })
  }

  async getRankList (
    activityId: string,
    type: string,
    data: ListRequest,
    childId: string,
    callback: (success: boolean, rankListResponse: RankListResponse) => void
  ) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/rank/data/${activityId}/${type}/public?currentUserId=${childId}`
    const { data: requestResult } = await HttpService.doRequest(url, 'get', data)
    const { success: success, data: rankListResponse } = requestResult
    const rankList = MyJsonConverter.getInstance().deserializeObject(rankListResponse, RankListResponse)
    callback(success, rankList)
  }

  getRankingDataPaginatedNew (
    activityId: string,
    type: string,
    data: ListRequest
  ): Promise<ApiResponse<LeaderboardPage>> {
    const url = `${ACTIVITY_BASEAPI}/api/v1/rank/data/${activityId}/${type}/public/new/0`
    return HttpService.doRequest(url, 'get', data).then((response: any) => {
      const result = ApiResponse.parseToObject<any>(response)
      if (result.success && result.data) {
        result.data = LeaderboardPage.fromRaw(result.data)
      }
      return result as ApiResponse<LeaderboardPage>
    })
  }

  getUserScoreDetails (
    activityId: string,
    userId: string
  ): Promise<ApiResponse<LeaderboardEntry>> {
    const url = `${ACTIVITY_BASEAPI}/api/v1/rank/data/${activityId}/${userId}/user`
    return HttpService.doRequest(url, 'get').then((response: any) => {
      const result = ApiResponse.parseToObject<any>(response)
      if (result.success && result.data) {
        result.data = LeaderboardEntry.fromRaw(result.data)
      }
      return result as ApiResponse<LeaderboardEntry>
    })
  }

  getUserRank (activityId: string, type: string, teamId: string,userId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/rank/data/${activityId}/${type}/${teamId}/${userId}/public`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseToObject(response, RankListItemResponse)
    })
  }

  getCertInfo (certId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/cert/${certId}`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      let data = ApiResponse.parseToObject(response, CertResponse)
      return data
    })
  }

  getLastEntry () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/activity/last/entry`

    return HttpService.doRequest(url, 'get').then((response: any) => {
      return ApiResponse.parseToObject(response, ChildActivityItem)
    })
  }

  async getActivityWorkList (
    activityId: string,
    periodId: string,
    subUserId: string,
    callback: (data: PersonalActivityWorkResponse, success: boolean) => void
  ) {
    const url = `${ACTIVITY_BASEAPI}${ActivityApi.prefix}${ActivityApi.version}/${ActivityApi.getActivityList(
      activityId,
      periodId,
      subUserId
    ).requestUrl}`
    const { data: requestResult } = await HttpService.doRequest(url, ActivityApi.getActivityList().method, {})
    const { data: data, success: success } = requestResult
    let personalActivityWorkResponse: PersonalActivityWorkResponse | undefined
    if (success) {
      personalActivityWorkResponse = MyJsonConverter.getInstance().deserializeObject(data, PersonalActivityWorkResponse)
      callback(personalActivityWorkResponse, success)
    } else {
      callback(new PersonalActivityWorkResponse(), success)
    }
  }

  async getPersonalSubmitConfig (
    activityId: string,
    callback: (data: PersonalSubmitConfigResponse, success: boolean) => void
  ) {
    const url = `${ACTIVITY_BASEAPI}${ActivityApi.prefix}${ActivityApi.version}/${ActivityApi.getPersonalSubmitConfig(
      activityId
    ).requestUrl}`
    const { data: requestResult } = await HttpService.doRequest(url, ActivityApi.getPersonalSubmitConfig().method, {})
    const { data: data, success: success } = requestResult
    if (success) {
      let personalSubmitConfigResponse: PersonalSubmitConfigResponse | undefined
      personalSubmitConfigResponse = MyJsonConverter.getInstance().deserializeObject(data, PersonalSubmitConfigResponse)
      callback(personalSubmitConfigResponse, success)
    }
  }

  async saveActivityWorks (
    activityId: string,
    periodId: string,
    subUserId: string,
    activityWorksRequest: PersonalActivityWorkRequest,
    callback: (personalActivityWorkResponse: PersonalActivityWorkResponse, success: boolean) => void
  ) {
    const url = `${ACTIVITY_BASEAPI}${ActivityApi.prefix}${ActivityApi.version}/${ActivityApi.saveActivityWorks(
      activityId,
      periodId,
      subUserId
    ).requestUrl}`
    const { data: requestResult } = await HttpService.doRequest(
      url,
      ActivityApi.saveActivityWorks().method,
      activityWorksRequest
    )
    const { data: data, success: success } = requestResult
    let personalActivityWorkResponse: PersonalActivityWorkResponse | undefined
    personalActivityWorkResponse = MyJsonConverter.getInstance().deserializeObject(data, PersonalActivityWorkResponse)
    callback(personalActivityWorkResponse, success)
  }

  async receivePopupInfo (appType: AppTypeEnum, callback: (popupVO: PopupVO, success: boolean) => void) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.popupInfo.requestUrl +
      appType +
      ActivityApi.popupInfo.suffix}`
    const { data: requestResult } = await HttpService.doRequest(
      url,
      ActivityApi.popupInfo.method,
      undefined,
      undefined,
      false
    )
    const { data: data, success: success } = requestResult
    let popupVO: PopupVO | undefined
    popupVO = MyJsonConverter.getInstance().deserializeObject(data, PopupVO)
    callback(popupVO, success)
  }

  async receiveAdInfo (position: PositionEnum, callback: (popupVO: PopupVO[], success: boolean) => void) {
    const requestData = { position: 1 }
    requestData.position = position
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...requestData })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const url = `${ACTIVITY_BASEAPI + ActivityApi.prefix + ActivityApi.version + ActivityApi.adInfo.requestUrl}`
    const { data: requestResult } = await HttpService.doRequest(
      url,
      ActivityApi.adInfo.method,
      requestData,
      header,
      false
    )
    const { data: data, success: success } = requestResult
    let popupVO: PopupVO[] | undefined
    popupVO = MyJsonConverter.getInstance().deserializeArray(data, PopupVO)
    callback(popupVO, success)
  }

  async receiveAppStatus (callback: (success: boolean, appStatus: AppStatus) => void) {
    const url = `${ACTIVITY_BASEAPI + ActivityApi.prefix + ActivityApi.version + ActivityApi.appStatus.requestUrl}`
    const requestData = { v: '' }
    requestData.v = process.env.VUE_APP_VERSION
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...requestData })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: requestResult } = await HttpService.doRequest(
      url,
      ActivityApi.appStatus.method,
      requestData,
      header,
      false
    )
    const { data: data, success: success } = requestResult
    let appStatus: AppStatus | undefined
    if (success) {
      appStatus = MyJsonConverter.getInstance().deserializeObject(data, AppStatus)
    }
    callback(success, appStatus)
  }

  upLoadFile (fileList: Array<FileRequest>) {
    const token = new TokenManagement().getToken()
    let fileArray: Array<string> = []
    return new Promise((resolve, reject) => {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      fileList.forEach((item) => {
        const blobDir = item.blobDir
        const blobName = item.blobName
        uni.uploadFile({
          url: `${USER_CENTER_BASEAPI}/api/v1/azure/blob/upload`, // 仅为示例，非真实的接口地址
          filePath: item.filePath,
          name: 'file',
          formData: {
            blobDir,
            blobName,
            referer: process.env.VUE_APP_PROJECT_NAME
          },
          header: {
            authorization: 'Bearer ' + token
          },
          success: (uploadFileRes: any) => {
            uni.hideLoading()
            const uploadFileResponse: UploadFileResponse = JSON.parse(uploadFileRes.data)
            fileArray.push(uploadFileResponse.data)
            if (fileArray.length === fileList.length) {
              resolve(fileArray)
            }
          },
          fail (err: any) {
            uni.hideLoading()
            reject(err)
          }
        })
      })
    })
  }

  async receiveColumnList (callback: (success: boolean, columnList: Array<ColumnItemVO>) => void) {
    const url = `${ACTIVITY_BASEAPI + ActivityApi.prefix + ActivityApi.version + ActivityApi.columnList.requestUrl}`
    const requestData = {}
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...requestData })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.columnList.method, undefined, header, false)
    const { success: success, data: result } = data
    const list = MyJsonConverter.getInstance().deserializeArray(result, ColumnItemVO)
    callback(success, list)
  }

  async receiveTagList (columnId: string, callback: (success: boolean, columnList: Array<ActivityTagVO>) => void) {
    let url = `${ACTIVITY_BASEAPI + ActivityApi.prefix + ActivityApi.version + ActivityApi.tagList.requestUrl}`
    let requestData = {}
    if (columnId) {
      url += '?columnId=' + columnId
      requestData = { columnId: columnId }
    }
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...requestData })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.columnList.method, undefined, header, false)
    const { success: success, data: result } = data
    const list = MyJsonConverter.getInstance().deserializeArray(result, ActivityTagVO)
    callback(success, list)
  }

  async receiveActivityList (
    activityFilterDTO: FilterActivityDTO,
    callback: (success: boolean, activityList: Array<ActivityFullItem> | ActivityFullList) => void,
    isNeedAllParams: boolean = false
  ) {
    const url = ACTIVITY_BASEAPI + ActivityApi.prefix + ActivityApi.version + ActivityApi.searchList.requestUrl
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, { ...activityFilterDTO })
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.searchList.method, activityFilterDTO, header)
    const { success: success, data: result } = data
    let list: ActivityFullList | Array<ActivityFullItem>
    if (isNeedAllParams) {
      list = MyJsonConverter.getInstance().deserializeObject(result, ActivityFullList)
    } else {
      list = MyJsonConverter.getInstance().deserializeArray(result.records, ActivityFullItem)
    }
    callback(success, list)
  }

  static async receiveActivityPrice (
    activityId: string,
    callback: (success: boolean, activityPrice: ActivityPriceVO) => void
  ) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.priceDetail.requestUrl +
      activityId +
      ActivityApi.priceDetail.suffix}`
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, {})
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.priceDetail.method, undefined, header, true)
    const { success: success, data: result } = data
    let activityPrice: ActivityPriceVO
    try {
      activityPrice = MyJsonConverter.getInstance().deserializeObject(result, ActivityPriceVO)
    } catch (e) {
      activityPrice = new ActivityPriceVO()
    }
    callback(success, activityPrice)
  }

  static async receiveActivityCardCount (activityId: string, callback: (success: boolean, total: number) => void) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.cardCount.requestUrl +
      activityId +
      ActivityApi.cardCount.suffix}`
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, {})
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.priceDetail.method, undefined, header, true)
    const { success: success, data: result } = data
    callback(success, Number(result))
  }

  static async fetchOtherStorageInfo (key: string, callback: (success: boolean, data: string) => void) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.other.url +
      ActivityApi.other.storage.get.requestUrl +
      key}`
    const { data: data } = await HttpService.doRequest(url, ActivityApi.other.storage.get.method)
    const { success: success, data: result } = data
    callback(success, result)
  }

  static async fetchLearningCardPriceInfo (
    activityId: string,
    sectionCardId: string,
    lessonCardId: string,
    callback: (success: boolean, lessonCardPrice: LessonCardPriceVO) => void
  ) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.cardPrice.requestUrl +
      activityId +
      '/' +
      sectionCardId +
      '/' +
      lessonCardId +
      ActivityApi.cardPrice.suffix}`
    const signResult = sign(process.env.VUE_APP_SEVER_APPID, process.env.VUE_APP_SEVER_SECRET, {})
    const header = {
      _appId: process.env.VUE_APP_SEVER_APPID,
      _sign: signResult.sign,
      _nonce: signResult.nonce,
      _timestamp: signResult.timestamp
    }
    const { data: data } = await HttpService.doRequest(url, ActivityApi.cardPrice.method, undefined, header)
    const { success: success, data: result } = data
    let lessonCardPrice: LessonCardPriceVO
    try {
      lessonCardPrice = MyJsonConverter.getInstance().deserializeObject(result, LessonCardPriceVO)
    } catch (e) {
      lessonCardPrice = new LessonCardPriceVO()
    }
    callback(success, lessonCardPrice)
  }

  static async fetchSurplusCardTotalPrice (
    activityId: string,
    userId: string,
    callback: (success: boolean, price: number) => void
  ) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.surplusCardTotalPrice.requestUrl +
      activityId +
      '/' +
      userId +
      ActivityApi.surplusCardTotalPrice.suffix}`
    const { data: data } = await HttpService.doRequest(url, ActivityApi.surplusCardTotalPrice.method)
    const { success: success, data: result } = data
    callback(success, Number(result / 100))
  }

  static async fetchProductionPublishedList (
    productionPublishedListDTO: ProductionPublishedListDTO,
    callback: (success: boolean, productionPublishedListVO: ProductionPublishedListVO) => void
  ) {
    const url = `${ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.productionPublished.requestUrl +
      productionPublishedListDTO.activityId +
      ActivityApi.productionPublished.suffix}`
    const { data: data } = await HttpService.doRequest(
      url,
      ActivityApi.productionPublished.method,
      productionPublishedListDTO
    )
    const { success, data: result } = data
    const productionPublishedListVO = MyJsonConverter.getInstance().deserializeObject(result, ProductionPublishedListVO)
    callback(success, productionPublishedListVO)
  }

  static async fetchUserEntryInfo (
    activityId: string, childId: string,
    callback: (success: boolean, userActivityEntryInfo: UserActivityEntryInfo) => void
  ) {
    let url = ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.getUserEntryInfo.requestUrl

    url = Utils.urlFormat(url, { activityId, childId })  
    const { data: data } = await HttpService.doRequest(
      url,
      ActivityApi.getUserEntryInfo.method
    )
    const { success, data: result } = data
    const userActivityEntryInfo = MyJsonConverter.getInstance().deserializeObject(result, UserActivityEntryInfo)
    callback(success, userActivityEntryInfo)
  }

  static async updateUserEntryInfo (
    activityId: string, childId: string, userActivityEntryInfo: UserActivityEntryInfo,
    callback: (success: boolean, errorMsg: string) => void
  ) {
    let url = ACTIVITY_BASEAPI +
      ActivityApi.prefix +
      ActivityApi.version +
      ActivityApi.updateUserEntryInfo.requestUrl

    url = Utils.urlFormat(url, { activityId, childId })  
    const { data: data } = await HttpService.doRequest(
      url,
      ActivityApi.updateUserEntryInfo.method,
      userActivityEntryInfo, {}, true
    )
    const { success, data: result } = data
    if (success) {
      callback(success, '更新成功')
    } else {
      callback(success, data.errorDesc)
    }
    
  }
}

export default ActivityService
