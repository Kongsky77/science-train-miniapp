import { toNullableNumber, toNumberValue, toStringValue } from '@/common/utils/ApiValueParser'

export default class LeaderboardEntry {
  userId = ''
  position: number | null = null
  score = 0
  answerScore = 0
  checkInScore = 0
  scoreReachedAt = 0
  teamId = ''
  teamName = ''
  userAvatar = ''
  orgName = ''
  provinceCode = ''
  cityCode = ''
  districtCode = ''
  provinceName = ''
  cityName = ''
  districtName = ''

  static fromRaw (raw: any): LeaderboardEntry {
    const entry = new LeaderboardEntry()
    if (!raw) return entry

    entry.userId = toStringValue(raw.userId)
    entry.position = toNullableNumber(raw.position)
    entry.score = toNumberValue(raw.score)
    entry.answerScore = toNumberValue(raw.answerScore)
    entry.checkInScore = toNumberValue(raw.checkInScore)
    entry.scoreReachedAt = toNumberValue(raw.scoreReachedAt)
    entry.teamId = toStringValue(raw.teamId)
    entry.teamName = toStringValue(raw.teamName)
    entry.userAvatar = toStringValue(raw.userAvatar)
    entry.orgName = toStringValue(raw.orgName)
    entry.provinceCode = toStringValue(raw.provinceCode)
    entry.cityCode = toStringValue(raw.cityCode)
    entry.districtCode = toStringValue(raw.districtCode)
    entry.provinceName = toStringValue(raw.provinceName)
    entry.cityName = toStringValue(raw.cityName)
    entry.districtName = toStringValue(raw.districtName)
    return entry
  }
}
