import EventDTO from '@/definition/common/EventDTO'

class VisitOrderPageDTO extends EventDTO{
  activity_name: string = ''
  card_price?: string
  activity_price: string = ''


  constructor(activity_name: string,activity_price: number, card_price?: number) {
    super()
    this.activity_name = activity_name
    this.card_price = card_price !== 0 ? String(card_price) : this.card_price
    this.activity_price = String(activity_price)
  }
}

export default VisitOrderPageDTO
