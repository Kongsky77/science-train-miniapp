import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import RankTabItem from '@/beans/activity/RankTabItem'

@JsonObject
export default class RankTabResponse {
  @JsonProperty('rankRefreshTimes', String, true)
  rankRefreshTimes: string = ''

  @JsonProperty('rankRuleDesc', String, true)
  rankRuleDesc: string = ''

  @JsonProperty('rankStartTime', StringToNumConverter, true)
  rankStartTime: number = 0

  @JsonProperty('rankItems', [ RankTabItem ], true)
  rankItems: RankTabItem[] = []
}
