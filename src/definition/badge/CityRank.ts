import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import BadgeRankStrategy from '@/definition/badge/BadgeRankStrategy'
import LangEnum from '@/definition/lang/LangEnum'
import BadgeRankAchievement from '@/definition/badge/BadgeRankAchievement'
import { Utils } from '@/common/utils/Utils'

class CityRank implements BadgeRankStrategy {

  getTitle (badgeRankResponse: BadgeRankResponse): string {
    return badgeRankResponse.cityName
  }

  getShareTitle (badgeRankResponse: BadgeRankResponse): string {
    const prefix = badgeRankResponse.cityName
    return Utils.formatShareTitle(prefix, badgeRankResponse.position)
  }
}

export default CityRank