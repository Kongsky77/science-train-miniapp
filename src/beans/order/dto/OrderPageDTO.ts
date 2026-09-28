import PaymentStatus from '@/definition/order/PaymentStatus'
import MyOrderTab from '@/definition/order/MyOrderTab'

class OrderPageDTO{
  pageNo: number = 1
  pageSize: number = 4
  status: MyOrderTab = MyOrderTab.UNPAID


  constructor (pageNo: number,status: MyOrderTab) {
    this.pageNo = pageNo
    this.status = status
  }
}

export default OrderPageDTO
