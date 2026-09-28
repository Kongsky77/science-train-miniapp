import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import BadgeRankStrategy from '@/definition/badge/BadgeRankStrategy'
import LangEnum from '@/definition/lang/LangEnum'
import { Utils } from '@/common/utils/Utils'

class DistrictRank implements BadgeRankStrategy {
  getTitle (badgeRankResponse: BadgeRankResponse): string {
    return badgeRankResponse.districtName
  }

  getShareTitle (badgeRankResponse: BadgeRankResponse): string {
    const prefix = badgeRankResponse.districtName
    return Utils.formatShareTitle(prefix, badgeRankResponse.position)
  }
}

export default DistrictRank