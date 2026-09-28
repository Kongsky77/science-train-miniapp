import BadgeRankAchievement from './BadgeRankAchievement'
import BadgeRankLevelEnum from './BadgeRankLevelEnum'
import BadgeRankTitleEnum from './BadgeRankTitleEnum'
const ICON_BASE_STATIC_URL =
  'https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/badge_rank_level_'

const makeUrl = (level: number, position: number) => {
  return ICON_BASE_STATIC_URL + String(level) + '_' + String(position) + '.svg'
}

const BadgeIconAndTitleMap: Map<BadgeRankTitleEnum, string> = new Map([
  [
    BadgeRankTitleEnum.PROVINCIAL_FIRST,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankTitleEnum.PROVINCIAL_SECOND,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankTitleEnum.PROVINCIAL_THIRD,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankTitleEnum.PROVINCIAL_TOP_TEN,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [
    BadgeRankTitleEnum.PROVINCIAL_TOP_FIFTY,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF)
  ],
  [
    BadgeRankTitleEnum.PROVINCIAL_TOP_HUNDRED,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [ BadgeRankTitleEnum.CITY_FIRST, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST) ],
  [ BadgeRankTitleEnum.CITY_SECOND, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND) ],
  [ BadgeRankTitleEnum.CITY_THIRD, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD) ],
  [
    BadgeRankTitleEnum.CITY_TOP_TEN,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [ BadgeRankTitleEnum.CITY_TOP_FIFTY, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF) ],
  [
    BadgeRankTitleEnum.CITY_TOP_HUNDRED,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [
    BadgeRankTitleEnum.AREA_FIRST,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankTitleEnum.AREA_SECOND,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankTitleEnum.AREA_THIRD,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankTitleEnum.AREA_TOP_TEN,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [
    BadgeRankTitleEnum.AREA_TOP_FIFTY,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF)
  ],
  [
    BadgeRankTitleEnum.AREA_TOP_HUNDRED,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_FIRST,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_SECOND,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_THIRD,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_TOP_TEN,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_TOP_FIFTY,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF)
  ],
  [
    BadgeRankTitleEnum.SCHOOL_TOP_HUNDRED,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ]
])

export default BadgeIconAndTitleMap
