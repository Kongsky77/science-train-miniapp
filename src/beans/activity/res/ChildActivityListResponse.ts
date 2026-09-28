import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

// import BasePageResponse from '@/beans/BasePageResponse'
import ChildActivityItem from '@/beans/activity/ChildActivityItem'

export default class ChildActivityListResponse {
  // 当前页码
  @JsonProperty('pageNo', StringToNumConverter, true)
  pageNo = 1

  // 每页显示数量
  @JsonProperty('pageSize', StringToNumConverter, true)
  pageSize = 10

  // 总页数
  @JsonProperty('pages', String, true)
  pages = ''

  // 总数量
  @JsonProperty('total', StringToNumConverter, true)
  total = 0

  @JsonProperty('records', [ ChildActivityItem ], true)
  records: Array<ChildActivityItem> = []
}
