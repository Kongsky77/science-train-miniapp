import { JsonObject,JsonProperty } from 'json2typescript'

@JsonObject
class ActivityTagVO {
  @JsonProperty('id', String, true)
  id: string = ''
  @JsonProperty('name', String, true)
  name: string = ''
  isActive: boolean = false
}

export default ActivityTagVO
