import NoticeDuration from '@/definition/common/NoticeDuration'

class ShowNoticeManagement {
  static ShowErrorNotice (title: string,duration = NoticeDuration.NORMAL) {
    uni.showToast({
      icon: 'none',
      title: title,
      duration: duration
    })
  }

  static ShowSuccessNotice (title: string,duration = NoticeDuration.NORMAL) {
    uni.showToast({
      icon: 'success',
      title: title,
      duration: duration
    })
  }
}

export default ShowNoticeManagement
