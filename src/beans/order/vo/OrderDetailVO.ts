import PaymentCard from '@/definition/order/PaymentCard'
import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import { StringToYMDCenterLineConverter } from '@/common/json_ts_converter/StringToYMDCenterLineConverter'

@JsonObject
class OrderDetailVO {
  @JsonProperty('goodsId',String,true)
  goodsId: string = ''

  @JsonProperty('goodsImg',String,true)
  goodsImg: string = ''

  @JsonProperty('goodsTitle',String,true)
  goodsTitle: string = ''

  @JsonProperty('goodsType',StringToNumConverter,true)
  goodsType: PaymentCard = PaymentCard.ALL_ACTIVITY

  // 原价
  @JsonProperty('originalPrice',StringToNumConverter,true)
  originalPrice: number = 0

  @JsonProperty('quantity',StringToNumConverter,true)
  quantity: number = 0


  @JsonProperty('sectionCardId',String,true)
  sectionCardId: string = ''

  // 售价
  @JsonProperty('salePrice',StringToNumConverter,true)
  salePrice: number = 0

  @JsonProperty('sellDuration',StringToNumConverter,true)
  sellDuration: number = 0

  @JsonProperty('useExpireTime',StringToNumConverter,true)
  useExpireTime: number = 0
}

export default OrderDetailVO
