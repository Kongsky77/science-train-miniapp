import PaymentCard from '@/definition/order/PaymentCard'

export default class LessonPlaceAnOrderOption {
  orderId: string
  subUserId: string
  sectionId?: string
  activityId?: string = ''
  lessonCardId?: string
  goodsType: PaymentCard = PaymentCard.ALL_ACTIVITY

}

