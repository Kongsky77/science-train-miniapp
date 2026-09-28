import TradeType from '@/definition/order/TradeType'

class DoPaymentDTO {
  appid: string = process.env.VUE_APP_WECHAT_APPID
  tradeType: TradeType = TradeType.WX_JSAPI
  wxCode: string = ''


  constructor (wxCode: string) {
    this.wxCode = wxCode
  }
}

export default DoPaymentDTO
