import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import ActivityTypeEnum from '@/enums/activity/ActivityTypeEnum'
import { OperateModeEnum } from '@/enums/activity/ActivityFullItemEnum'

@JsonObject
export default class ActivityItem {
  // 图片
  @JsonProperty('img', String, true)
  img = ''

  // mode
  @JsonProperty('mode', StringToNumConverter, true)
  mode = OperateModeEnum.ONLINE

  // 标语
  @JsonProperty('slogan', String, true)
  slogan = ''

  // 链接，如果是活动则为活动ID
  @JsonProperty('src', String, true)
  src = ''

  // 时间
  @JsonProperty('time', StringToNumConverter, true)
  time = 0

  // 标题
  @JsonProperty('title', String, true)
  title = ''

  // 类型：1-活动、2-超链接
  @JsonProperty('type', StringToNumConverter, true)
  type = ActivityTypeEnum.ACTIVITY
}
