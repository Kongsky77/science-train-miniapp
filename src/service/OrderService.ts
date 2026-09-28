import CreateOrderDTO from '@/beans/order/dto/CreateOrderDTO'
import OrderItemVO from '@/beans/order/vo/OrderItemVO'
import OrderApi from '@/definition/service_api/OrderApi'
import HttpService from '@/common/utils/HttpService'
import MyJsonConverter from '@/common/utils/MyJsonConverter'
import OrderPageDTO from '@/beans/order/dto/OrderPageDTO'
import OrderPageVO from '@/beans/order/vo/OrderPageVO'
import UpExpiredOrderDTO from '@/beans/order/dto/UpExpiredOrderDTO'

class OrderService {
  private static readonly BASE_API = process.env.VUE_APP_ACTIVITY_BASEAPI + OrderApi.prefix + OrderApi.version

  static async createOrder (createOrderDTO: CreateOrderDTO,callback: (success: boolean,orderItemVO: OrderItemVO) => void) {
    const url = `${ OrderService.BASE_API + OrderApi.createOrder.requestUrl }`
    const {data: data} = await HttpService.doRequest(url,OrderApi.createOrder.method,createOrderDTO)
    const {data: result,success: success} = data
    let orderItemVO: OrderItemVO
    try {
      orderItemVO = MyJsonConverter.getInstance().deserializeObject(result,OrderItemVO)
    } catch (e) {
      orderItemVO = new OrderItemVO()
    }
    callback(success,orderItemVO)
  }

  static async fetchOrderInfo (orderId: string,isSimple: boolean,callback: (success: boolean,orderItemVO: OrderItemVO) => void) {
    const url: string = `${ OrderService.BASE_API + OrderApi.info.url + orderId + (isSimple ? OrderApi.info.Simplified.suffix: OrderApi.info.complete.requestUrl) }`
    const {data: data} = await HttpService.doRequest(url,OrderApi.info.method)
    const {data: result,success: success} = data
    let orderItemVO: OrderItemVO
    try {
      orderItemVO = MyJsonConverter.getInstance().deserializeObject(result,OrderItemVO)
    } catch (e) {
      orderItemVO = new OrderItemVO()
    }
    callback(success,orderItemVO)

  }

  static async fetchOrderList (orderPageDTO: OrderPageDTO,callback: (success: boolean,orderPageVO: OrderPageVO) => void) {
    const url: string = `${ OrderService.BASE_API + OrderApi.info.url + OrderApi.info.page.requestUrl }`
    const {data: data} = await HttpService.doRequest(url,OrderApi.info.method,orderPageDTO)
    const {data: result,success: success} = data
    let orderItemVO: OrderPageVO
    try {
      orderItemVO = MyJsonConverter.getInstance().deserializeObject(result,OrderPageVO)
    } catch (e) {
      orderItemVO = new OrderPageVO()
    }
    callback(success,orderItemVO)
  }

  static async cancelOrder (orderId: string,callback: (success: boolean) => void) {
    const url: string = `${ OrderService.BASE_API + OrderApi.cancel.url + orderId + OrderApi.cancel.suffix }`
    const {data: data} = await HttpService.doRequest(url,OrderApi.cancel.method)
    const {success: success} = data
    callback(success)
  }

  static async fetchUpExpiredOrder(
      upExpiredOrderDTO: UpExpiredOrderDTO,
      callback: (success: boolean, orderItem: OrderItemVO) => void) {
    const url: string = `${ OrderService.BASE_API + OrderApi.up_expired.url }`
    const { data: data } = await HttpService.doRequest(url, OrderApi.up_expired.method, upExpiredOrderDTO,undefined,false)
    const { success: success, data: result } = data
    let orderItem: OrderItemVO
    try {
      orderItem = MyJsonConverter.getInstance().deserializeObject(result, OrderItemVO)
    } catch (e) {
      orderItem = new OrderItemVO()
    }
    callback(success, orderItem)
  }
}

export default OrderService
