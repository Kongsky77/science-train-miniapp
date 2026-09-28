import { JsonObject,JsonProperty } from 'json2typescript'
import BasePageResponse from '@/beans/BasePageResponse'
import WorkCommentItemVO from '@/beans/rate/simple/WorkCommentItemVO'

@JsonObject
class WorkCommentListVO extends BasePageResponse {
  @JsonProperty('records',[ WorkCommentItemVO ],true)
  records: Array<WorkCommentItemVO> = []
}

export default WorkCommentListVO
