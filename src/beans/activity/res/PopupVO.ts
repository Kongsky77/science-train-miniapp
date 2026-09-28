import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToBooleanConverter } from '@/common/json_ts_converter/StringToBooleanConverter'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'

@JsonObject
class PopupVO {
  @JsonProperty('mainImage', String, true)
  mainImage: string  = ''
  @JsonProperty('targetType', StringToNumConverter, true)
  targetType: number = 0
  @JsonProperty('targetVal', String, true)
  targetVal: string = ''
  @JsonProperty('closeImage', String, true)
  closeImage: string = ''
}

export default PopupVO
