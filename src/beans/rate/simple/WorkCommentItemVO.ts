import { JsonObject,JsonProperty } from 'json2typescript'
import ExpertEvaluationUserTypeEnum from '@/definition/rate/ExpertEvaluationUserTypeEnum'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import SimpleUserInfoVO from '@/beans/rate/simple/SimpleUserInfoVO'

@JsonObject
class WorkCommentItemVO {
  @JsonProperty('comment', String, true)
  comment: string = ''
  @JsonProperty('id', String, true)
  id: string = ''
  @JsonProperty('star', StringToNumConverter, true)
  star: number = 0
  @JsonProperty('time', StringToNumConverter, true)
  time: number = 0
  @JsonProperty('user', SimpleUserInfoVO, true)
  user: SimpleUserInfoVO = new SimpleUserInfoVO()
  @JsonProperty('userType', StringToNumConverter, true)
  userType: ExpertEvaluationUserTypeEnum = ExpertEvaluationUserTypeEnum.NORMAL
}

export default WorkCommentItemVO
