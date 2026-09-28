const CheckInPointListResult = require('../src/beans/check-in/CheckInPointListResult').default;
const CheckInSubmitResult = require('../src/beans/check-in/CheckInSubmitResult').default;
const CheckInPointStatus = require('../src/definition/check-in/CheckInPointStatus').default;

describe('science train check-in response models', () => {
  test('keeps wire IDs and timestamps as strings and parses nested activity points', () => {
    const result = CheckInPointListResult.fromRaw({
      enabled: true,
      answerScore: '999',
      checkInScore: '999',
      totalScore: '1998',
      completedCount: '1',
      totalCount: '2',
      points: [{
        id: '843700000000001',
        name: '科技馆正门',
        startTime: '1788200000000',
        endTime: '1790800000000',
        checkedInAt: null,
        photoRequired: '1',
        status: 'AVAILABLE'
      }],
      activityPoints: {
        onlinePoints: '20',
        offlinePoints: '150',
        totalPoints: '170',
        projectionVersion: '9007199254740993',
        validVenueCount: '2',
        scoreableVenueCount: '2',
        validProvinceCount: '2',
        firstScoreableCheckInAt: '1788200100000',
        offlineEndAt: '1788286500000',
        offlineElapsedMillis: '86400000',
        tenVenueReachedAt: null,
        projectionRefreshPending: false
      }
    });

    expect(result.points[0].id).toBe('843700000000001');
    expect(result.points[0].startTime).toBe('1788200000000');
    expect(result.points[0].checkedInAt).toBeNull();
    expect(result.points[0].photoRequired).toBe(true);
    expect(result.points[0].status).toBe(CheckInPointStatus.AVAILABLE);
    expect(result.activityPoints.totalPoints).toBe(170);
    expect(result.activityPoints.projectionVersion).toBe('9007199254740993');
    expect(result.activityPoints.offlineElapsedMillis).toBe('86400000');
  });

  test('uses nested activity points and preserves submit IDs and timestamps', () => {
    const result = CheckInSubmitResult.fromRaw({
      recordId: '843700000000100',
      pointId: '843700000000001',
      awardedScore: '70',
      totalScore: '999',
      distanceMeter: '35.42',
      checkedInAt: '1788200100000',
      leaderboardUpdated: false,
      projectionRefreshPending: true,
      activityPoints: {
        onlinePoints: 20,
        offlinePoints: 70,
        totalPoints: 90,
        projectionVersion: '2',
        projectionRefreshPending: true
      }
    });

    expect(result.recordId).toBe('843700000000100');
    expect(result.checkedInAt).toBe('1788200100000');
    expect(result.awardedScore).toBe(70);
    expect(result.activityPoints.totalPoints).toBe(90);
    expect(result.activityPoints.projectionRefreshPending).toBe(true);
  });
});
