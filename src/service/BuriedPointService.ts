import BadgeService from '@/service/BadgeService'
import BuriedPointRequest from '@/beans/user/req/BuriedPointRequest'

export default class BuriedPointService {
  static async in (url: string,callback: (buriedPointId: string) => void) {
    let buriedPointRequest = new BuriedPointRequest()
    buriedPointRequest.uri = url
    let badgeService = new BadgeService()
    const {data: result} = await badgeService.buriedPoint(buriedPointRequest)
    callback(result)
  }

  static out (id: string) {
    if (id) {
      let buriedPointRequest = new BuriedPointRequest()
      buriedPointRequest.reqId = id
      let badgeService = new BadgeService()
      badgeService.buriedPoint(buriedPointRequest)
    }
  }

}
