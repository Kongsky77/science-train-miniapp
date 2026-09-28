import {
  toBooleanValue,
  toNullableString,
  toNumberValue,
  toStringValue
} from '@/common/utils/ApiValueParser'

export default class ActivityPointsSnapshot {
  onlinePoints = 0
  offlinePoints = 0
  totalPoints = 0
  projectionVersion = ''
  validVenueCount = 0
  scoreableVenueCount = 0
  validProvinceCount = 0
  firstScoreableCheckInAt: string | null = null
  offlineEndAt: string | null = null
  offlineElapsedMillis: string | null = null
  tenVenueReachedAt: string | null = null
  projectionRefreshPending = false

  static fromRaw (raw: any): ActivityPointsSnapshot {
    const result = new ActivityPointsSnapshot()
    if (!raw) return result

    result.onlinePoints = toNumberValue(raw.onlinePoints)
    result.offlinePoints = toNumberValue(raw.offlinePoints)
    result.totalPoints = toNumberValue(raw.totalPoints)
    result.projectionVersion = toStringValue(raw.projectionVersion)
    result.validVenueCount = toNumberValue(raw.validVenueCount)
    result.scoreableVenueCount = toNumberValue(raw.scoreableVenueCount)
    result.validProvinceCount = toNumberValue(raw.validProvinceCount)
    result.firstScoreableCheckInAt = toNullableString(raw.firstScoreableCheckInAt)
    result.offlineEndAt = toNullableString(raw.offlineEndAt)
    result.offlineElapsedMillis = toNullableString(raw.offlineElapsedMillis)
    result.tenVenueReachedAt = toNullableString(raw.tenVenueReachedAt)
    result.projectionRefreshPending = toBooleanValue(raw.projectionRefreshPending)
    return result
  }
}
