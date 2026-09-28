import WebStorage from '@/common/utils/WebStorage'
import RedirectConstant from '@/definition/user/RedirectConstant'

export default class RouterManagement {

  static _instance: RouterManagement

  static getInstance () {
    if (!RouterManagement._instance) {
      RouterManagement._instance = new RouterManagement()
    }
    return RouterManagement._instance
  }

  saveUserUrl (redirectPath: string) {
    WebStorage.set(sessionStorage, RedirectConstant.REDIRECT_URL_LABEL , redirectPath)
  }

  getUserUrl (): string {
    let redirectPath = WebStorage.get(sessionStorage, RedirectConstant.REDIRECT_URL_LABEL)
    return redirectPath
  }

  removeUserUrl () {
    WebStorage.remove(sessionStorage, RedirectConstant.REDIRECT_URL_LABEL)
  }
}
