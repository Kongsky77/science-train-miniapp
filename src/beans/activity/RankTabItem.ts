import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class RankTabItem {
  @JsonProperty('title', String, true)
  title: string = ''

  @JsonProperty('type', String, true)
  type: string = ''
}
