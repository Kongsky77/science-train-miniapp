import TokenConstant from '@/definition/user/TokenConstant'
import { Utils } from "@/common/utils/Utils";

export default class TokenManagement {

  static _instance: TokenManagement

  static getInstance () {
    if (!TokenManagement._instance) {
      TokenManagement._instance = new TokenManagement()
    }
    return TokenManagement._instance
  }

  saveToken (token: string) {
    uni.setStorageSync(TokenConstant.AUTH_TOKEN_LABEL, token)

    let myDate = new Date()
    let expiredTimestamp = myDate.getTime() + TokenConstant.AUTH_TOKEN_EXPIRED_TIME
    uni.setStorageSync(TokenConstant.AUTH_TOKEN_EXPIRED_TIME_LABEL, expiredTimestamp + "")
  }

  getToken (): string {
    let token = ''
    let expiredTimestamp = uni.getStorageSync(TokenConstant.AUTH_TOKEN_EXPIRED_TIME_LABEL)
    if (expiredTimestamp) {
      if (Utils.compareWithNowTimeStamp(expiredTimestamp)) {
        token = uni.getStorageSync(TokenConstant.AUTH_TOKEN_LABEL)
      } else {
        this.clearStorage()
      }
    } else {
      token = uni.getStorageSync(TokenConstant.AUTH_TOKEN_LABEL)
    }
    return token
  }

  clearStorage () {
    uni.removeStorageSync(TokenConstant.AUTH_TOKEN_LABEL)
    uni.removeStorageSync(TokenConstant.AUTH_TOKEN_EXPIRED_TIME_LABEL)
  }
}
