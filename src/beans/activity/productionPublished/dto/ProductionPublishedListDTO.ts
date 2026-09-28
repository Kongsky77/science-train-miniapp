import ProductionPublishedTopEnum from '@/definition/production-published/ProductionPublishedTopEnum'

class ProductionPublishedListDTO {
  activityId: string = ''
  onTop: ProductionPublishedTopEnum | undefined
  pageNo: number = 1
  pageSize: number = 10
}

export default ProductionPublishedListDTO
