import CheckInPointStatus from '@/definition/check-in/CheckInPointStatus'
import {
  toBooleanValue,
  toNullableString,
  toNumberValue,
  toStringValue
} from '@/common/utils/ApiValueParser'

export default class CheckInPoint {
  id = ''
  name = ''
  address = ''
  latitude = 0
  longitude = 0
  radiusMeter = 0
  score = 0
  startTime: string | null = null
  endTime: string | null = null
  photoRequired = false
  status: CheckInPointStatus = CheckInPointStatus.DISABLED
  checkedInAt: string | null = null
  photoUrl = ''

  static fromRaw (raw: any): CheckInPoint {
    const point = new CheckInPoint()
    if (!raw) return point

    point.id = toStringValue(raw.id)
    point.name = toStringValue(raw.name)
    point.address = toStringValue(raw.address)
    point.latitude = toNumberValue(raw.latitude)
    point.longitude = toNumberValue(raw.longitude)
    point.radiusMeter = toNumberValue(raw.radiusMeter)
    point.score = toNumberValue(raw.score)
    point.startTime = toNullableString(raw.startTime)
    point.endTime = toNullableString(raw.endTime)
    point.photoRequired = toBooleanValue(raw.photoRequired)
    point.status = toStatus(raw.status)
    point.checkedInAt = toNullableString(raw.checkedInAt)
    point.photoUrl = toStringValue(raw.photoUrl)
    return point
  }
}

const toStatus = (status: any): CheckInPointStatus => {
  const value = toStringValue(status) as CheckInPointStatus
  return Object.keys(CheckInPointStatus).some((key) => (CheckInPointStatus as any)[key] === value)
    ? value
    : CheckInPointStatus.DISABLED
}
