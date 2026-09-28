import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class SchoolItem {
  @JsonProperty('id', String, true)
  id: string = ''

  @JsonProperty('name', String, true)
  name: string = ''
}
