import { JsonObject, JsonProperty } from 'json2typescript'
import BasePageResponse from '@/beans/BasePageResponse'

@JsonObject
export default class ActivityMemberInfo {
  @JsonProperty('avatar', String, true)
  avatar = ''
}
