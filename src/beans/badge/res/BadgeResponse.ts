import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'

@JsonObject
export default class BadgeResponse {
  @JsonProperty('title',String,true)
  title = ''

  @JsonProperty('imgLit',String,true)
  imgLit = ''

  @JsonProperty('awarded',StringToNumConverter,true)
  awarded = 0

  @JsonProperty('id',String,true)
  id = ''

  @JsonProperty('activityId',String,true)
  activityId = ''

  @JsonProperty('awardedTime',StringToNumConverter,true)
  awardedTime = 0

  @JsonProperty('userId',String,true)
  userId = ''

  @JsonProperty('awardPosition', StringToNumConverter, true)
  awardPosition = 0
}
