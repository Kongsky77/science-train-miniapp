import EventDTO from '@/definition/common/EventDTO'
import PaymentCard from '@/definition/order/PaymentCard'

export default class ClickPayDTO extends EventDTO {
  activity_name: string = ''
  pay_price: string = ''
  pay_range: PaymentCard = PaymentCard.ALL_ACTIVITY


  constructor(activity_name: string, pay_price: number, pay_range: PaymentCard) {
    super()
    this.activity_name = activity_name
    this.pay_price = String(pay_price)
    this.pay_range = pay_range
  }
}
