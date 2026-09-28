import { JsonObject,JsonProperty } from 'json2typescript'

@JsonObject
class ActivityCategoryVO {
  @JsonProperty('id', String, true)
  id: string = ''
  @JsonProperty('name', String, true)
  name: string = ''
  @JsonProperty('slogan', String, true)
  slogan: string = ''
  @JsonProperty('icon', String, true)
  icon: string = ''
}

export default ActivityCategoryVO
