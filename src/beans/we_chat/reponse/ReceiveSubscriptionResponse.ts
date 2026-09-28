import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'
import { JsonObject, JsonProperty } from 'json2typescript'

@JsonObject
export default class ReceiveSubscriptionResponse {
  @JsonProperty('subscribe', StringToBooleanConverter, true)
  subscribe: boolean = false
  @JsonProperty('url', String, true)
  url: string = ''
}
