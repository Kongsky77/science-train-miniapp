import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class JsApiPayment {
  @JsonProperty('nonceStr',String,true)
  nonceStr = ''
  @JsonProperty('paySign',String,true)
  paySign = ''
  @JsonProperty('pkg',String,true)
  pkg = ''
  @JsonProperty('signType',String,true)
  signType = '' as 'MD5' | 'HMAC-SHA256' | 'RSA'
  @JsonProperty('timeStamp',String,true)
  timeStamp = ''
}

export default JsApiPayment
