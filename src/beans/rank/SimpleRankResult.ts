import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import RankTypeEnum from '@/definition/rank/RankTypeEnum'

@JsonObject
class SimpleRankResult {
  @JsonProperty('period',StringToNumConverter, true)
  period: number = 0

  @JsonProperty('position',StringToNumConverter, true)
  position: number = 0

  @JsonProperty('score',String, true)
  score: string = ''

  @JsonProperty('type',String, true)
  type: RankTypeEnum = RankTypeEnum.MODEL
}

export default SimpleRankResult
