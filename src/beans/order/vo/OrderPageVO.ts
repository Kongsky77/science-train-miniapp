import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'

@JsonObject
export default class OrderPageVO {
  @JsonProperty('pageNo',StringToNumConverter,true)
  pageNo = 1

  // 每页显示数量
  @JsonProperty('pageSize',StringToNumConverter,true)
  pageSize = 10

  // 总页数
  @JsonProperty('pages',StringToNumConverter,true)
  pages = 0

  // 总数量
  @JsonProperty('total',StringToNumConverter,true)
  total = 0

  @JsonProperty('records',[ OrderItemVO ],true)
  records = []
}
