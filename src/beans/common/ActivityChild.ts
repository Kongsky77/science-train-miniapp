import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/json_ts_converter/StringToNumConverter'
import BooleanEnum from '@/enums/common/BooleanEnum'
import TeamResultResponse from '@/beans/team/res/TeamResultResponse'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
export default class ActivityChild {
  @JsonProperty('avatar',String,true)
  avatar = ''

  @JsonProperty('entryTime',StringToNumConverter,true)
  entryTime = 0

  @JsonProperty('grade',String,true)
  grade = ''

  @JsonProperty('inActivityRange',StringToNumConverter,true)
  inActivityRange: BooleanEnum = BooleanEnum.NO

  // 是否在活动配置的年龄范围内：0-否（无法参与活动）、1-是
  @JsonProperty('inActivityAgeRange',StringToNumConverter,true)
  inActivityAgeRange: BooleanEnum = BooleanEnum.NO

  @JsonProperty('isEntry',StringToNumConverter,true)
  isEntry: BooleanEnum = BooleanEnum.NO

  @JsonProperty('orgName',String,true)
  orgName = ''

  @JsonProperty('isBought',StringToBooleanConverter,true)
  isBought: boolean = false

  @JsonProperty('process',String,true)
  process = ''

  @JsonProperty('realName',String,true)
  realName = ''

  @JsonProperty('userId',String,true)
  userId = ''

  @JsonProperty('ident',StringToNumConverter,true)
  ident = ''

  @JsonProperty('team',TeamResultResponse,true)
  team?: TeamResultResponse = undefined

  active: boolean = false
}
