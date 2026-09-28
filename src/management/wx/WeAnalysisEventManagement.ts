import EventNameEnum from '@/definition/common/EventNameEnum'
import EventDTO from '@/definition/common/EventDTO'

class WeAnalysisEventManagement {
  static reportEvent<T>(eventName: EventNameEnum, eventDTO: T) {
    // @ts-ignore
    wx.reportEvent(eventName, eventDTO)
  }
}

export default WeAnalysisEventManagement
