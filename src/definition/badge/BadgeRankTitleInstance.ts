import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'
import LangEnum from '@/definition/lang/LangEnum'
import BadgeRankStrategy from '@/definition/badge/BadgeRankStrategy'
import BadgeRankLevelEnum from '@/definition/badge/BadgeRankLevelEnum'
import CityRank from '@/definition/badge/CityRank'
import DistrictRank from '@/definition/badge/DistrictRank'
import ProvinceRank from '@/definition/badge/ProvinceRank'
import SchoolRank from '@/definition/badge/SchoolRank'
import BadgeRankPositionEnum from '@/definition/badge/BadgeRankPositionEnum'
import BadgeIconMap from '@/definition/badge/BadgeIconMap'
import BadgeRankAchievement from '@/definition/badge/BadgeRankAchievement'

class BadgeRankTitleInstance {
  strategy: BadgeRankStrategy

  constructor () {
    this.strategy = null
  }

  getText (badgeRankResponse: BadgeRankResponse): string {
    if (badgeRankResponse.position > BadgeRankAchievement.CURRENT_BADGE_RANK_MAX) {
      return LangEnum.BEYOND_SCHOOL_PEERS
    } else {
      return LangEnum.BADGE_LEADERBOARD
    }
  }

  getIcon (badgeRankResponse: BadgeRankResponse): string {
    const currentIcon = this.getCurrentIcon(badgeRankResponse.position)
    return BadgeIconMap.get(badgeRankResponse.level).get(currentIcon)
  }

  getCurrentIcon (badgeRankPosition: number) {
    let currentPosition
    if (badgeRankPosition > BadgeRankAchievement.CURRENT_BADGE_RANK_MAX) {
      currentPosition = BadgeRankPositionEnum.BEYOND_ONE_HUNDRED
    } else if (badgeRankPosition <= BadgeRankAchievement.CURRENT_BADGE_RANK_MAX && badgeRankPosition > BadgeRankAchievement.CURRENT_BADGE_RANK_HALF) {
      currentPosition = BadgeRankPositionEnum.TOP_ONE_HUNDRED
    } else if (badgeRankPosition <= BadgeRankAchievement.CURRENT_BADGE_RANK_HALF && badgeRankPosition > BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN) {
      currentPosition = BadgeRankPositionEnum.TOP_FIFTY
    } else if (badgeRankPosition <= BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN && badgeRankPosition > BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD) {
      currentPosition = BadgeRankPositionEnum.TOP_TEN
    } else if (badgeRankPosition === BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST) {
      currentPosition = BadgeRankPositionEnum.FIRST_PLACE
    } else if (badgeRankPosition === BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND) {
      currentPosition = BadgeRankPositionEnum.SECOND_PLACE
    } else if (badgeRankPosition === BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD) {
      currentPosition = BadgeRankPositionEnum.THIRD_PLACE
    } else {
      currentPosition = BadgeRankPositionEnum.NONE
    }
    return currentPosition
  }

  setCurrentStrategy (strategy: BadgeRankStrategy) {
    this.strategy = strategy
  }

  chooseLevel (level: BadgeRankLevelEnum) {
    switch (level) {
      case BadgeRankLevelEnum.CITY:
        this.setCurrentStrategy(new CityRank())
        break
      case BadgeRankLevelEnum.DISTRICT:
        this.setCurrentStrategy(new DistrictRank())
        break
      case BadgeRankLevelEnum.PROVINCE:
        this.setCurrentStrategy(new ProvinceRank())
        break
      case BadgeRankLevelEnum.SCHOOL:
        this.setCurrentStrategy(new SchoolRank())
        break
      default:
        break
    }
  }

  getTitle (badgeRankResponse: BadgeRankResponse): string {
    if (badgeRankResponse.position > BadgeRankAchievement.CURRENT_BADGE_RANK_MAX) {
      return LangEnum.BEYOND_SCHOOL_PEERS_PERCENTAGE
    } else {
      this.chooseLevel(badgeRankResponse.level)
      return this.strategy.getTitle(badgeRankResponse)
    }
  }

  getShareTitle (badgeRankResponse: BadgeRankResponse): string {
      this.chooseLevel(badgeRankResponse.level)
      return this.strategy.getShareTitle(badgeRankResponse)
  }

}

export default BadgeRankTitleInstance