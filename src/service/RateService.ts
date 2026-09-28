import RateApi from '@/definition/service_api/RateApi'
import HttpService from '@/common/utils/HttpService'
import WorkContentVO from '@/beans/rate/WorkContentVO'
import MyJsonConverter from '@/common/utils/MyJsonConverter'
import ActivityTagVO from '@/beans/activity/res/ActivityTagVO'
import StarEvaluationVO from '@/beans/rate/StarEvaluationVO'
import EntityTypeEnum from '@/definition/rate/EntityTypeEnum'
import ListRequest from '@/beans/activity/req/ListRequest'
import WorkCommentListVO from '@/beans/rate/WorkCommentListVO'

class RateService {
  private static ACTIVITY_BASE_API = process.env.VUE_APP_ACTIVITY_BASEAPI

  async receiveWorkDetail (productId: string,callback: (success: boolean,result: WorkContentVO) => void) {
    const url = `${ RateService.ACTIVITY_BASE_API + RateApi.prefix + RateApi.version + RateApi.productDetail.requestUrl + productId }`
    const {data: res} = await HttpService.doRequest(url,RateApi.productDetail.method,undefined,undefined,true)
    const {success: success,data: result} = res
    const workContentVO = MyJsonConverter.getInstance().deserializeObject(result,WorkContentVO)
    callback(success,workContentVO)
  }

  async receiveStarSystemEvaluation (entityType: EntityTypeEnum,entityId: string,callback: (success: boolean,result: StarEvaluationVO) => void) {
    const url = `${ RateService.ACTIVITY_BASE_API + RateApi.prefix + RateApi.version + RateApi.starSystemEvaluation.requestUrl + entityType + '/' + entityId + RateApi.starSystemEvaluation.suffix }`
    const {data: res} = await HttpService.doRequest(url,RateApi.starSystemEvaluation.method,undefined,undefined,true)
    const {success: success,data: result} = res
    let starEvaluationVO: StarEvaluationVO
    try {
      starEvaluationVO = MyJsonConverter.getInstance().deserializeObject(result,StarEvaluationVO)
    }catch (error) {
      starEvaluationVO = new StarEvaluationVO()
    }
    callback(success,starEvaluationVO)
  }

  async receiveCommentList (entityType: EntityTypeEnum,entityId: string,listDTO: ListRequest,callback: (success: boolean,result: WorkCommentListVO) => void) {
    const url = `${ RateService.ACTIVITY_BASE_API + RateApi.prefix + RateApi.version + RateApi.commentList.requestUrl + entityType + '/' + entityId + RateApi.commentList.suffix }`
    const {data: res} = await HttpService.doRequest(url,RateApi.commentList.method,listDTO,undefined,true)
    const {success: success,data: result} = res
    const workCommentListVO = MyJsonConverter.getInstance().deserializeObject(result,WorkCommentListVO)
    callback(success,workCommentListVO)
  }

  async readPersonalProduction (activityId: string,childId: string,callback: (success: boolean) => void) {
    const url = `${ RateService.ACTIVITY_BASE_API + RateApi.prefix + RateApi.version + RateApi.readProduct.requestUrl + activityId + '/' + childId }`
    const {data: res} = await HttpService.doRequest(url,RateApi.readProduct.method,undefined,undefined,false)
    const {success: success} = res
    callback(success)
  }
}

export default RateService
