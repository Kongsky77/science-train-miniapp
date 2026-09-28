import CheckInPointListResult from '@/beans/check-in/CheckInPointListResult'
import CheckInSubmitResult from '@/beans/check-in/CheckInSubmitResult'
import CheckInPointStatus from '@/definition/check-in/CheckInPointStatus'
import LeaderboardEntry from '@/beans/rank/res/LeaderboardEntry'
import LeaderboardPage from '@/beans/rank/res/LeaderboardPage'

describe('check-in and leaderboard response models', () => {
  it('parses a check-in point list with decimal scores and nullable values', () => {
    const result = CheckInPointListResult.fromRaw({
      enabled: true,
      answerScore: '80.5',
      checkInScore: '10.25',
      totalScore: '90.75',
      completedCount: '1',
      totalCount: '2',
      points: [{
        id: '101',
        name: '四川科技馆·正门',
        latitude: '30.1234567',
        longitude: '104.1234567',
        radiusMeter: '100',
        score: '10.25',
        photoRequired: '1',
        status: 'AVAILABLE',
        checkedInAt: null,
        photoUrl: null
      }]
    })

    expect(result.totalScore).toBe(90.75)
    expect(result.points[0].status).toBe(CheckInPointStatus.AVAILABLE)
    expect(result.points[0].photoRequired).toBe(true)
    expect(result.points[0].checkedInAt).toBeNull()
    expect(result.points[0].photoUrl).toBe('')
  })

  it('parses projection refresh state from a submit result', () => {
    const result = CheckInSubmitResult.fromRaw({
      recordId: '1',
      pointId: '101',
      awardedScore: '10',
      totalScore: '110',
      leaderboardUpdated: false,
      projectionRefreshPending: true
    })

    expect(result.awardedScore).toBe(10)
    expect(result.leaderboardUpdated).toBe(false)
    expect(result.projectionRefreshPending).toBe(true)
  })

  it('keeps zero score as a valid leaderboard value', () => {
    const entry = LeaderboardEntry.fromRaw({
      userId: '9',
      position: null,
      score: 0,
      answerScore: 0,
      checkInScore: 0,
      userAvatar: null
    })
    const page = LeaderboardPage.fromRaw({
      pageNo: '1',
      pageSize: '10',
      pages: '1',
      total: '1',
      records: [entry]
    })

    expect(entry.score).toBe(0)
    expect(entry.position).toBeNull()
    expect(entry.userAvatar).toBe('')
    expect(page.records[0].score).toBe(0)
  })
})
