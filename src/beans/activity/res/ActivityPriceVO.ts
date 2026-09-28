import PaymentModel from '@/definition/order/PaymentModel'
import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import { StringToYMDCenterLineConverter } from '@/common/json_ts_converter/StringToYMDCenterLineConverter'
import { StringToYuanConverter } from '@/common/json_ts_converter/StringToYuanConverter'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
class ActivityPriceVO {
  @JsonProperty('id',String,true)
  id: string = ''
  @JsonProperty('name',String,true)
  name: string = ''
  @JsonProperty('salePrice',StringToYuanConverter,true)
  salePrice: number = 0
  @JsonProperty('sellDuration',StringToNumConverter,true)
  sellDuration: number = 0
  @JsonProperty('originalPrice',StringToYuanConverter,true)
  originalPrice: number = 0
  @JsonProperty('paymentModel',StringToNumConverter,true)
  paymentModel: PaymentModel = PaymentModel.ADVANCE_PAYMENT
  @JsonProperty('useExpireTime',StringToYMDCenterLineConverter,true)
  useExpireTime: string = ''
  @JsonProperty('includeRealGoods',StringToBooleanConverter,true)
  includeRealGoods: boolean = false
}

export default ActivityPriceVO
