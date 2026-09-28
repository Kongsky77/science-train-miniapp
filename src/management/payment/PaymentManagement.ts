import JsApiPayment from '@/beans/common/JsApiPayment'
import LessonInfo from '@/beans/activity/res/LessonInfo'
import ActivityService from '@/service/ActivityService'
import LoginManagement from '@/management/login/LoginManagement'

class PaymentManagement {
  private static _lessonInfo: LessonInfo

  public static doWxRequestPayment (jsapiPayment: JsApiPayment,callback: (result: string) => void) {
    wx.requestPayment({
      nonceStr: jsapiPayment.nonceStr,
      package: jsapiPayment.pkg,
      timeStamp: jsapiPayment.timeStamp,
      paySign: jsapiPayment.paySign,
      signType: jsapiPayment.signType,
      success: (res) => {
        callback(res.errMsg)
      },
      fail: (res) => {
        callback(res.errMsg)
      }
    })
  }

  public static async getPaymentScene (key: string) {
    PaymentManagement.resetLessonInfo()
    if (new LoginManagement().isLogin()) {
      await ActivityService.fetchOtherStorageInfo(key,this.fetchPaymentSceneCallback)
    }
  }

  public static getLessonInfo (): LessonInfo {
    return PaymentManagement._lessonInfo
  }

  private static fetchPaymentSceneCallback (success: boolean,scene: string) {
    if (success) {
      const ids = scene.split(',')
      PaymentManagement._lessonInfo.activityId = ids[0]
      PaymentManagement._lessonInfo.sectionId = ids[1]
      PaymentManagement._lessonInfo.lessonCardId = ids[2]
      PaymentManagement._lessonInfo.childId = ids[3]
    } else {
      this.resetLessonInfo()
    }
  }

  private static resetLessonInfo () {
    PaymentManagement._lessonInfo = new LessonInfo()
  }
}

export default PaymentManagement
