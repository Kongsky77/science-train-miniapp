import WebStorage from '@/common/utils/WebStorage'
import StorageKeyEnum from '@/definition/lang/StorageKeyEnum'
import UserService from '@/service/UserService'

class OpenIdManagement {
  static getOpenId () {
    return uni.getStorageSync(StorageKeyEnum.OPEN_ID)
  }

  static async setOpenId(code: string) {
    await UserService.fetchOpenId(code, OpenIdManagement.fetchOpenIdCallback)
  }

  private static fetchOpenIdCallback (success: boolean,openId: string) {
    uni.setStorageSync(StorageKeyEnum.OPEN_ID,openId)
  }
}


export default OpenIdManagement
