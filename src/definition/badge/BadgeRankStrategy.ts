import BadgeRankResponse from '@/beans/badge/res/BadgeRankResponse'

interface BadgeRankStrategy {
  getTitle (badgeRankResponse: BadgeRankResponse): string

  getShareTitle(badgeRankResponse: BadgeRankResponse): string
}

export default BadgeRankStrategy