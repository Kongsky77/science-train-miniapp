import PaymentCard from '@/definition/order/PaymentCard'

class UpExpiredOrderDTO {

  goodsId: string = ''
  subUserId: string = ''
  goodsType: PaymentCard = PaymentCard.ALL_ACTIVITY
  sectionCardId?: string
  activityId?: string


  constructor(goodsId: string, subUserId: string, goodsType: PaymentCard, sectionCardId?: string, activityId?: string) {
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

export default UpExpiredOrderDTO
