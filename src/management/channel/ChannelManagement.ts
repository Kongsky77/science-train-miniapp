import { Utils } from '@/common/utils/Utils'
import ChannelKeyEnum from '@/definition/common/ChannelKeyEnum'

export default class ChannelManagement {
  private static _instance: ChannelManagement
  static KOC_EXPIRED_TIME: number = 259200000

  static getInstance (): ChannelManagement {
    if (!ChannelManagement._instance) {
      ChannelManagement._instance = new ChannelManagement()
    }
    return ChannelManagement._instance
  }

  static saveChannelId (channelKey: ChannelKeyEnum,channelId: string) {
    if (channelId && channelKey) {
      uni.setStorageSync(channelKey,channelId)

      let myDate = new Date()
      let expiredTimestamp = myDate.getTime() + ChannelManagement.KOC_EXPIRED_TIME
      uni.setStorageSync(ChannelKeyEnum.KOC_EXPIRED_TIME_LABEL, expiredTimestamp + "")
    }
  }

  static getChannelId (channelKey: ChannelKeyEnum) {
    let channelId: string = ''
    let expiredTimestamp = uni.getStorageSync(ChannelKeyEnum.KOC_EXPIRED_TIME_LABEL)
    if (expiredTimestamp) {
      if (Utils.compareWithNowTimeStamp(expiredTimestamp)) {
        channelId = uni.getStorageSync(channelKey)
      } else {
        this.clearStorage(channelKey)
      }
    } else {
      channelId = uni.getStorageSync(channelKey)
    }
    return channelId
  }

  static removeChannelId (channelKey: ChannelKeyEnum) {
    if (channelKey && ChannelManagement.getChannelId(channelKey)) {
      uni.removeStorageSync(channelKey)
    }
  }

  static clearStorage (channelKey: ChannelKeyEnum) {
    uni.removeStorageSync(channelKey)
    uni.removeStorageSync(ChannelKeyEnum.KOC_EXPIRED_TIME_LABEL)
  }
}
