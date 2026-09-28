import { JsonObject,JsonProperty } from 'json2typescript'
import PaymentStatus from '@/definition/order/PaymentStatus'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import { Utils } from '@/common/utils/Utils'
import PayType from '@/definition/order/PayType'
import OrderStatus from '@/definition/order/OrderStatus'
import OrderDetailVO from '@/beans/order/vo/OrderDetailVO'
import { StringToLocalTimeConverter } from '@/common/json_ts_converter/StringToLocalTimeConverter'
import { StringToYuanConverter } from '@/common/json_ts_converter/StringToYuanConverter'

@JsonObject
class OrderItemVO {
  @JsonProperty('id',String,true)
  id: string = ''

  @JsonProperty('activityId',String,true)
  activityId: string = ''

  @JsonProperty('activityName',String,true)
  activityName: string = ''

  @JsonProperty('expireTime',StringToNumConverter,true)
  expireTime: number = 0

  @JsonProperty('entryReserved',Boolean,true)
  entryReserved: boolean = false

  @JsonProperty('payStatus',StringToNumConverter,true)
  payStatus: PaymentStatus = PaymentStatus.TO_BE_PAID

  @JsonProperty('subUserId',String,true)
  subUserId: string = ''

  @JsonProperty('subUserRealName',String,true)
  subUserRealName: string = ''

  @JsonProperty('createTime',StringToNumConverter,true)
  createTime: number = 0

  @JsonProperty('payTime',StringToNumConverter,true)
  payTime: number = 0

  @JsonProperty('payType',StringToNumConverter,true)
  payType: PayType = PayType.WX

  @JsonProperty('status',StringToNumConverter,true)
  status: OrderStatus = OrderStatus.ALREADY_CANCEL

  // 原价
  @JsonProperty('originalTotalAmount',StringToYuanConverter,true)
  originalTotalAmount: number = 0

  // 售价
  @JsonProperty('totalAmount',StringToYuanConverter,true)
  totalAmount: number = 0

  @JsonProperty('userPhoneNumber',StringToNumConverter,true)
  userPhoneNumber: number = 0

  @JsonProperty('goods',[ OrderDetailVO ],true)
  goods: OrderDetailVO[] = []


}

export default OrderItemVO
