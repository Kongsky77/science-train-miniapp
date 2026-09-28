import BadgeRankPositionEnum from '@/definition/badge/BadgeRankPositionEnum'
import BadgeRankLevelEnum from '@/definition/badge/BadgeRankLevelEnum'
import BadgeRankAchievement from '@/definition/badge/BadgeRankAchievement'

const ICON_BASE_STATIC_URL =
  'https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/badge_rank_level_'
const ICON_BASE_DEFAULT_URL =
  'https://contentdevsa-blob.ai121.net/testcontainer/static/activity/img/badge_rank_default.svg'

const makeUrl = (level: number, position: number) => {
  return ICON_BASE_STATIC_URL + String(level) + '_' + String(position) + '.svg'
}

const provincePositionBadgeIconMap: Map<BadgeRankPositionEnum, string> = new Map<BadgeRankPositionEnum, string>([
  [ BadgeRankPositionEnum.NONE, ICON_BASE_DEFAULT_URL ],
  [
    BadgeRankPositionEnum.FIRST_PLACE,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankPositionEnum.SECOND_PLACE,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankPositionEnum.THIRD_PLACE,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankPositionEnum.TOP_TEN,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [
    BadgeRankPositionEnum.TOP_FIFTY,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF)
  ],
  [
    BadgeRankPositionEnum.TOP_ONE_HUNDRED,
    makeUrl(BadgeRankLevelEnum.PROVINCE, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [ BadgeRankPositionEnum.BEYOND_ONE_HUNDRED, ICON_BASE_DEFAULT_URL ]
])

const cityPositionBadgeIconMap: Map<BadgeRankPositionEnum, string> = new Map<BadgeRankPositionEnum, string>([
  [ BadgeRankPositionEnum.NONE, ICON_BASE_DEFAULT_URL ],
  [
    BadgeRankPositionEnum.FIRST_PLACE,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankPositionEnum.SECOND_PLACE,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankPositionEnum.THIRD_PLACE,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [ BadgeRankPositionEnum.TOP_TEN, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN) ],
  [ BadgeRankPositionEnum.TOP_FIFTY, makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF) ],
  [
    BadgeRankPositionEnum.TOP_ONE_HUNDRED,
    makeUrl(BadgeRankLevelEnum.CITY, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [ BadgeRankPositionEnum.BEYOND_ONE_HUNDRED, ICON_BASE_DEFAULT_URL ]
])

const districtPositionBadgeIconMap: Map<BadgeRankPositionEnum, string> = new Map<BadgeRankPositionEnum, string>([
  [ BadgeRankPositionEnum.NONE, ICON_BASE_DEFAULT_URL ],
  [
    BadgeRankPositionEnum.FIRST_PLACE,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankPositionEnum.SECOND_PLACE,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankPositionEnum.THIRD_PLACE,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankPositionEnum.TOP_TEN,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [
    BadgeRankPositionEnum.TOP_FIFTY,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF)
  ],
  [
    BadgeRankPositionEnum.TOP_ONE_HUNDRED,
    makeUrl(BadgeRankLevelEnum.DISTRICT, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [ BadgeRankPositionEnum.BEYOND_ONE_HUNDRED, ICON_BASE_DEFAULT_URL ]
])

const schoolPositionBadgeIconMap: Map<BadgeRankPositionEnum, string> = new Map<BadgeRankPositionEnum, string>([
  [ BadgeRankPositionEnum.NONE, ICON_BASE_DEFAULT_URL ],
  [
    BadgeRankPositionEnum.FIRST_PLACE,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_FIRST)
  ],
  [
    BadgeRankPositionEnum.SECOND_PLACE,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_SECOND)
  ],
  [
    BadgeRankPositionEnum.THIRD_PLACE,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_THIRD)
  ],
  [
    BadgeRankPositionEnum.TOP_TEN,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_TOP_TEN)
  ],
  [ BadgeRankPositionEnum.TOP_FIFTY, makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_HALF) ],
  [
    BadgeRankPositionEnum.TOP_ONE_HUNDRED,
    makeUrl(BadgeRankLevelEnum.SCHOOL, BadgeRankAchievement.CURRENT_BADGE_RANK_MAX)
  ],
  [ BadgeRankPositionEnum.BEYOND_ONE_HUNDRED, ICON_BASE_DEFAULT_URL ]
])

const defaultPositionBadgeIconMap: Map<BadgeRankPositionEnum, string> = new Map<BadgeRankPositionEnum, string>([
  [ BadgeRankPositionEnum.NONE, ICON_BASE_DEFAULT_URL ]
])

const BadgeIconMap: Map<BadgeRankLevelEnum, Map<BadgeRankPositionEnum, string>> = new Map<
  BadgeRankLevelEnum,
  Map<BadgeRankPositionEnum, string>
>([
  [ BadgeRankLevelEnum.NONE, defaultPositionBadgeIconMap ],
  [ BadgeRankLevelEnum.PROVINCE, provincePositionBadgeIconMap ],
  [ BadgeRankLevelEnum.CITY, cityPositionBadgeIconMap ],
  [ BadgeRankLevelEnum.DISTRICT, districtPositionBadgeIconMap ],
  [ BadgeRankLevelEnum.SCHOOL, schoolPositionBadgeIconMap ]
])

export default BadgeIconMap
