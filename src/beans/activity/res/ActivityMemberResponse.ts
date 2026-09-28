import { JsonObject, JsonProperty } from 'json2typescript'
import BasePageResponse from '@/beans/BasePageResponse'
import ActivityMemberInfo from '@/beans/activity/ActivityMemberInfo'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

@JsonObject
export default class ActivityMemberResponse {
  @JsonProperty('records', [ ActivityMemberInfo ], true)
  records: Array<ActivityMemberInfo> = []

  // 当前页码
  @JsonProperty('pageNo', StringToNumConverter, true)
  pageNo = 1

  // 每页显示数量
  @JsonProperty('pageSize', StringToNumConverter, true)
  pageSize = 10

  // 总页数
  @JsonProperty('pages', StringToNumConverter, true)
  pages = 0

  // 总数量
  @JsonProperty('total', StringToNumConverter, true)
  total = 0
}
