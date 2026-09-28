import { JsonObject, JsonProperty } from 'json2typescript'
import ProductionPublishedTopEnum from '@/definition/production-published/ProductionPublishedTopEnum'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import { StringToLocalTimeConverter } from '@/common/json_ts_converter/StringToLocalTimeConverter'
import ProductionItemVO from '@/beans/activity/productionPublished/vo/ProductionItemVO'
import UserInfoResponse from '@/beans/common/UserInfoResponse'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'

@JsonObject
class ProductionPublishedItemVO {
  @JsonProperty('id', String, true)
  id: string = ''
  @JsonProperty('description', String, true)
  description: string = ''
  @JsonProperty('onTop', StringToNumConverter, true)
  onTop: ProductionPublishedTopEnum = ProductionPublishedTopEnum.UN_TOPPING
  @JsonProperty('time', String, true)
  time: number = 0
  @JsonProperty('files', [ ProductionItemVO ], true)
  files: ProductionItemVO[] = []

  @JsonProperty('user', UserInfoResponse, true)
  user: UserInfoResponse = new UserInfoResponse()

  @JsonProperty('showPic', StringToBooleanConverter, true)
  showPic: boolean = true
}

export default ProductionPublishedItemVO
