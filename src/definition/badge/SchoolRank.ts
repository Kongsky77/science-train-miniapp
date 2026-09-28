import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import BadgeRankStrategy from '@/definition/badge/BadgeRankStrategy'
import { Utils } from '@/common/utils/Utils'

class SchoolRank implements BadgeRankStrategy {
  getTitle (badgeRankResponse: BadgeRankResponse): string {
    return '所在学校'
  }

  getShareTitle (badgeRankResponse: BadgeRankResponse): string {
    const prefix = badgeRankResponse.orgName
    return Utils.formatShareTitle(prefix, badgeRankResponse.position)
  }
}

export default SchoolRank