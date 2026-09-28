import CheckInPoint from './CheckInPoint'
import ActivityPointsSnapshot from './ActivityPointsSnapshot'
import { toBooleanValue, toNumberValue } from '@/common/utils/ApiValueParser'

export default class CheckInPointListResult {
  enabled = false
  answerScore = 0
  checkInScore = 0
  totalScore = 0
  completedCount = 0
  totalCount = 0
  points: CheckInPoint[] = []
  activityPoints = new ActivityPointsSnapshot()

  static fromRaw (raw: any): CheckInPointListResult {
    const result = new CheckInPointListResult()
    if (!raw) return result

    result.enabled = toBooleanValue(raw.enabled)
    result.answerScore = toNumberValue(raw.answerScore)
    result.checkInScore = toNumberValue(raw.checkInScore)
    result.totalScore = toNumberValue(raw.totalScore)
    result.completedCount = toNumberValue(raw.completedCount)
    result.totalCount = toNumberValue(raw.totalCount)
    result.points = Array.isArray(raw.points)
      ? raw.points.map((item: any) => CheckInPoint.fromRaw(item))
      : []
    result.activityPoints = ActivityPointsSnapshot.fromRaw(raw.activityPoints)
    return result
  }
}
