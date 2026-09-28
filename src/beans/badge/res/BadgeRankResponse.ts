import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import BadgeRankLevelEnum from '@/definition/badge/BadgeRankLevelEnum'
import BadgeRankPositionEnum from '@/definition/badge/BadgeRankPositionEnum'

@JsonObject
class BadgeRankResponse {
  @JsonProperty('level', StringToNumConverter, true)
  level: BadgeRankLevelEnum = BadgeRankLevelEnum.NONE
  @JsonProperty('position', StringToNumConverter, true)
  position: number = 0
  @JsonProperty('provinceName', String, true)
  provinceName: string = ''
  @JsonProperty('cityName', String, true)
  cityName: string = ''
  @JsonProperty('districtName', String, true)
  districtName: string = ''
  @JsonProperty('orgName', String, true)
  orgName: string = ''
  @JsonProperty('topCount', StringToNumConverter, true)
  topCount: number = 1
  @JsonProperty('topLastTime', StringToNumConverter, true)
  topLastTime: number = 0
}

export default BadgeRankResponse