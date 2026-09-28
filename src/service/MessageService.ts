import HttpService from '@/common/utils/HttpService'
import ApiResponse from '@/beans/ApiResponse'
import ChildMessageResponse from '@/beans/message/res/ChildMessageResponse'
import MessageDayResponse from '@/beans/message/res/MessageDayResponse'
import MessageResponse from '@/beans/message/res/MessageResponse'
import UnreadMessage from '@/beans/message/res/UnreadMessage'

const ACTIVITY_BASEAPI = process.env.VUE_APP_ACTIVITY_BASEAPI

class MessageService {
  getChildMessageList () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/msg/sub/list`

    return HttpService.doRequest(url, 'get',null,null,false).then((response) => {
      return ApiResponse.parseArray(response, ChildMessageResponse)
    })
  }

  getMessageDay (childId: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/msg/sub/${childId}/count`

    return HttpService.doRequest(url, 'get').then((response) => {
      return ApiResponse.parseArray(response, MessageDayResponse)
    })
  }

  getMessage (read: string, childId: string, time?: string) {
    const url = `${ACTIVITY_BASEAPI}/api/v1/msg/sub/${childId}/list?read=${read}&time=${time}`

    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response) => {
      return ApiResponse.parseArray(response, MessageResponse)
    })
  }

  getUnreadMessage () {
    const url = `${ACTIVITY_BASEAPI}/api/v1/msg/unread/count`
    return HttpService.doRequest(url, 'get', undefined, undefined, false).then((response) => {
      return response.data
    })
  }
}

export default MessageService
