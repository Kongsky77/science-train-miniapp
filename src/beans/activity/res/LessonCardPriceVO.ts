import { JsonObject,JsonProperty } from 'json2typescript'
import { StringToYuanConverter } from '@/common/json_ts_converter/StringToYuanConverter'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import { StringToYMDCenterLineConverter } from '@/common/json_ts_converter/StringToYMDCenterLineConverter'

@JsonObject
class LessonCardPriceVO {
  @JsonProperty('activityId',String,true)
  activityId: string = ''

  @JsonProperty('lessonCardId',String,true)
  lessonCardId: string = ''

  @JsonProperty('name',String,true)
  name: string = ''

  @JsonProperty('originalPrice',StringToYuanConverter,true)
  originalPrice: number = 0

  @JsonProperty('salePrice',StringToYuanConverter,true)
  salePrice: number = 0

  @JsonProperty('sectionCardId',String,true)
  sectionCardId: string = ''

  @JsonProperty('sellDuration',StringToNumConverter,true)
  sellDuration: number = 0

  @JsonProperty('useExpireTime',StringToYMDCenterLineConverter,true)
  useExpireTime: number = 0

}

export default LessonCardPriceVO
