import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class StarEvaluationVO {
  @JsonProperty('rateStar',StringToNumConverter,true)
  rateStar: number = 0
  @JsonProperty('rateUserCount',StringToNumConverter,true)
  rateUserCount: number = 0
  @JsonProperty('rateVal',String,true)
  rateVal: string = ''
  @JsonProperty('starFiveRatio',String,true)
  starFiveRatio: string = ''
  @JsonProperty('starFourRatio',String,true)
  starFourRatio: string = ''
  @JsonProperty('starOneRatio',String,true)
  starOneRatio: string = ''
  @JsonProperty('starThreeRatio',String,true)
  starThreeRatio: string = ''
  @JsonProperty('starTwoRatio',String,true)
  starTwoRatio: string = ''
}

export default StarEvaluationVO
