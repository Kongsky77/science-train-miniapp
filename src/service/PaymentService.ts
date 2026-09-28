import PaymentApi from '@/definition/service_api/PaymentApi'
import DoPaymentDTO from '@/beans/order/dto/DoPaymentDTO'
import DoPaymentCallbackVO from '@/beans/order/vo/DoPaymentCallbackVO'
import HttpService from '@/common/utils/HttpService'
import MyJsonConverter from '@/common/utils/MyJsonConverter'

class PaymentService {
  private static readonly BASE_API = process.env.VUE_APP_ACTIVITY_BASEAPI + PaymentApi.prefix + PaymentApi.version

  public static async doPayment (
      orderId: string,
      doPaymentDTO: DoPaymentDTO,
      callback: (success: boolean,
                 doPaymentCallbackVO: DoPaymentCallbackVO
      ) => void) {
    const url = `${ PaymentService.BASE_API + PaymentApi.payment.url + PaymentApi.payment.do.requestUrl + orderId }`
    const {data: data} = await HttpService.doRequest(url,PaymentApi.payment.do.method,doPaymentDTO)
    const {data: result,success: success} = data
    let doPaymentCallbackVO: DoPaymentCallbackVO
    try {
      doPaymentCallbackVO = MyJsonConverter.getInstance().deserializeObject(result,DoPaymentCallbackVO)
    } catch (e) {
      doPaymentCallbackVO = new DoPaymentCallbackVO()
    }
    callback(success,doPaymentCallbackVO)
  }
}

export default PaymentService
