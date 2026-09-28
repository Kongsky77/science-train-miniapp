import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import RankListItemResponse from '@/beans/activity/res/RankListItemResponse'

@JsonObject
export default class RankListResponse {
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

  @JsonProperty('records', [ RankListItemResponse ], true)
  records: RankListItemResponse[] = []
}
