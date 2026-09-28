import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class ActivityCopy {
  @JsonProperty('title', String, true)
  title = ''

  @JsonProperty('content', String, true)
  content = ''
}
