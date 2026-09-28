import PaymentCard from '@/definition/order/PaymentCard'

class CreateOrderDTO {
  activityId?: string
  goodsId: string = ''
  sectionCardId?: string
  subUserId: string = ''
  goodsType: PaymentCard = PaymentCard.ALL_ACTIVITY
  remark: string = ''


  constructor (goodsId: string,subUserId: string,goodsType: PaymentCard,sectionCardId?: string,activityId?: string) {
    if (activityId) {
      this.activityId = activityId
    }
    this.goodsId = goodsId
    if (sectionCardId) {
      this.sectionCardId = sectionCardId
    }
    this.subUserId = subUserId
    this.goodsType = goodsType
  }
}

export default CreateOrderDTO
