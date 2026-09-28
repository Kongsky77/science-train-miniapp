import NoticeCardItem from '@/beans/notice/NoticeCardItem'
import LangEnum from '@/definition/lang/LangEnum'

class NoticeCardManagement {
  private static _instance: NoticeCardManagement

  static getInstance (): NoticeCardManagement {
    if (!NoticeCardManagement._instance) {
      NoticeCardManagement._instance = new NoticeCardManagement()
    }
    return NoticeCardManagement._instance
  }

  saveReadHistory (noticeCards: NoticeCardItem): void {
    uni.setStorageSync(LangEnum.NOTICE_KEY, noticeCards)
  }

  getReadHistory () {
    return uni.getStorageSync(LangEnum.NOTICE_KEY)
  }
}

export default NoticeCardManagement
