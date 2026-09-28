import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

@JsonObject
export default class RankListItemResponse {
  // 战队名称
  @JsonProperty('teamName', String, true)
  teamName = ''

  // 学校名称
  @JsonProperty('orgName', String, true)
  orgName = ''

  // 名次
  @JsonProperty('position', String, true)
  position = ''

  // 头像
  @JsonProperty('userAvatar', String, true)
  userAvatar = ''

  // id
  @JsonProperty('userId', String, true)
  userId = ''

  // 分数
  @JsonProperty('score', String, true)
  score = ''
}
