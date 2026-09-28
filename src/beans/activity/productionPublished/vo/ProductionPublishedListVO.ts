import { JsonObject, JsonProperty } from 'json2typescript'
import { StringToNumConverter } from '@/common/utils/StringToNumConverter'
import ProductionPublishedItemVO from '@/beans/activity/productionPublished/vo/ProductionPublishedItemVO'

@JsonObject
class ProductionPublishedListVO {
  @JsonProperty('pageNo', StringToNumConverter, true)
  currentPage: number = 0
  @JsonProperty('pages', StringToNumConverter, true)
  pages: number = 0
  @JsonProperty('records', [ ProductionPublishedItemVO ], true)
  records: ProductionPublishedItemVO[] = []
}

export default ProductionPublishedListVO
