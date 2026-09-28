import LeaderboardEntry from './LeaderboardEntry'
import { toNumberValue } from '@/common/utils/ApiValueParser'

export default class LeaderboardPage {
  pageNo = 1
  pageSize = 10
  pages = 0
  total = 0
  records: LeaderboardEntry[] = []

  static fromRaw (raw: any): LeaderboardPage {
    const page = new LeaderboardPage()
    if (!raw) return page

    page.pageNo = toNumberValue(raw.pageNo, 1)
    page.pageSize = toNumberValue(raw.pageSize, 10)
    page.pages = toNumberValue(raw.pages)
    page.total = toNumberValue(raw.total)
    page.records = Array.isArray(raw.records)
      ? raw.records.map((item: any) => LeaderboardEntry.fromRaw(item))
      : []
    return page
  }
}
