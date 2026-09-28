import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import BadgeRankStrategy from '@/definition/badge/BadgeRankStrategy'
import { Utils } from '@/common/utils/Utils'

class ProvinceRank implements BadgeRankStrategy {
  getTitle (badgeRankResponse: BadgeRankResponse): string {
    return badgeRankResponse.provinceName
  }

  getShareTitle (badgeRankResponse: BadgeRankResponse): string {
    const prefix = badgeRankResponse.provinceName
    return Utils.formatShareTitle(prefix, badgeRankResponse.position)
  }
}

export default ProvinceRank