import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import ColumnTypeEnum from '@/enums/activity/ColumnTypeEnum'
import { JsonObject,JsonProperty } from 'json2typescript'

@JsonObject
class ColumnItemVO {
  @JsonProperty('id', String, true)
  id: string = ''
  @JsonProperty('name', String, true)
  name: string = ''
  @JsonProperty('slogan', String, true)
  slogan: string = ''
  @JsonProperty('icon', String, true)
  icon: string = ''
  @JsonProperty('type', StringToNumConverter, true)
  type: number = ColumnTypeEnum.ACTIVITY
  @JsonProperty('appId', String, true)
  appId: string = ''
  @JsonProperty('path', String, true)
  path: string = ''
}

export default ColumnItemVO
