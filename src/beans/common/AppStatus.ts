import { JsonObject,JsonProperty } from 'json2typescript'
import AppStatusEnum from '@/definition/common/AppStatusEnum'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class AppStatus {
  @JsonProperty('audit', StringToNumConverter, true)
  audit: AppStatusEnum = AppStatusEnum.NOT_REVIEWED
  @JsonProperty('v', String, true)
  v: string = ''
}

export default AppStatus
