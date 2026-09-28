import ActivityPointsSnapshot from './ActivityPointsSnapshot'
import {
  toBooleanValue,
  toNullableString,
  toNumberValue,
  toStringValue
} from '@/common/utils/ApiValueParser'

export default class CheckInSubmitResult {
  recordId = ''
  pointId = ''
  awardedScore = 0
  answerScore = 0
  checkInScore = 0
  totalScore = 0
  distanceMeter = 0
  checkedInAt: string | null = null
  leaderboardUpdated = false
  projectionRefreshPending = false
  activityPoints = new ActivityPointsSnapshot()

  static fromRaw (raw: any): CheckInSubmitResult {
    const result = new CheckInSubmitResult()
    if (!raw) return result

    result.recordId = toStringValue(raw.recordId)
    result.pointId = toStringValue(raw.pointId)
    result.awardedScore = toNumberValue(raw.awardedScore)
    result.answerScore = toNumberValue(raw.answerScore)
    result.checkInScore = toNumberValue(raw.checkInScore)
    result.totalScore = toNumberValue(raw.totalScore)
    result.distanceMeter = toNumberValue(raw.distanceMeter)
    result.checkedInAt = toNullableString(raw.checkedInAt)
    result.leaderboardUpdated = toBooleanValue(raw.leaderboardUpdated)
    result.projectionRefreshPending = toBooleanValue(raw.projectionRefreshPending)
    result.activityPoints = ActivityPointsSnapshot.fromRaw(raw.activityPoints)
    return result
  }
}
