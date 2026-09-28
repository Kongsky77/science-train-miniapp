import { JsonObject,JsonProperty } from 'json2typescript'
import JsApiPayment from '@/beans/common/JsApiPayment'

@JsonObject
class DoPaymentCallbackVO {
  @JsonProperty('orderId',String,true)
  orderId: string = ''
  @JsonProperty('payId',String,true)
  payId: string = ''
  @JsonProperty('prepayId',String,true)
  prepayId: string = ''
  @JsonProperty('jsapiPayment',JsApiPayment,true)
  jsapiPayment: JsApiPayment =new JsApiPayment()
}

export default DoPaymentCallbackVO
