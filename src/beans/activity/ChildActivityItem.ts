import { JsonObject, JsonProperty } from 'json2typescript'
import ActivityFullItem from './ActivityFullItem'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
export default class ChildActivityItem {
  @JsonProperty('activity', ActivityFullItem, true)
  activity = new ActivityFullItem()

  @JsonProperty('createTime', StringToNumConverter, true)
  createTime = 0

  @JsonProperty('process', StringToNumConverter, true)
  process = 0

  // 徽章ID，如果为空，说明未获得徽章
  @JsonProperty('badgeId', String, true)
  badgeId = ''

  @JsonProperty('productionId',String, true)
  productId = ''

  @JsonProperty('productionCommentUnread', StringToBooleanConverter, true)
  productionCommentUnread: boolean = false

  // 证书ID，如果为空，说明未获得证书
  @JsonProperty('certId', String, true)
  certId = ''

  // 是否已经生成用户数据报告：0-否、1-是
  @JsonProperty('userReportIsGen', StringToNumConverter, true)
  userReportIsGen = 0

  // 官方表彰id
  @JsonProperty('officialCertId', String, true)
  officialCertId: string = ''

  //证书封面
  @JsonProperty('certCover', String, true)
  certCover: string = ''
}
