import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
class BuriedPointResponse {
  @JsonProperty('reqId', String, true)
  reqId: string = ''
}

export default BuriedPointResponse