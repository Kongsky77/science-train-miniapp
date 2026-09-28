import ThemeTypeEnum from '@/enums/theme/ThemeTypeEnum'

class WechatLoginRequest {
  referer?: string = process.env.VUE_APP_PROJECT_NAME
  appid?: string = process.env.VUE_APP_WECHAT_APPID
  phoneEncryptedData: string
  phoneIv: string
  code: string
  kocId?: string

  constructor (phoneEncryptedData: string, phoneIv: string, code: string, kocId?: string) {
    this.phoneEncryptedData = phoneEncryptedData
    this.phoneIv = phoneIv
    this.code = code
    if (kocId) {
      this.kocId = kocId
    }
  }
}

export default WechatLoginRequest
