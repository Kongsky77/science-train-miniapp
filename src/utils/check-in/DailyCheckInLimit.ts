export const DAILY_SCORED_CHECK_IN_LIMIT = 2

interface CheckInTimestampRecord {
  checkedInAt: string | null
}

export const countTodayCheckIns = (
  records: CheckInTimestampRecord[],
  now: Date = new Date()
): number => records.filter((record) => isSameLocalDay(record.checkedInAt, now)).length

export const isSameLocalDay = (value: string | null, now: Date = new Date()): boolean => {
  if (!value) return false

  const rawTimestamp = Number(value)
  if (!Number.isFinite(rawTimestamp)) return false

  const timestamp = Math.abs(rawTimestamp) < 1000000000000
    ? rawTimestamp * 1000
    : rawTimestamp
  const checkedInAt = new Date(timestamp)
  if (!Number.isFinite(checkedInAt.getTime())) return false

  return checkedInAt.getFullYear() === now.getFullYear() &&
    checkedInAt.getMonth() === now.getMonth() &&
    checkedInAt.getDate() === now.getDate()
}
