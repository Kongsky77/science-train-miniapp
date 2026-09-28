const { getCheckInErrorInfo } = require('../src/utils/check-in/CheckInErrorMapper');
const { resolveExtension } = require('../src/service/CheckInPhotoService');
const { LocationErrorCode, toLocationError } = require('../src/service/LocationService');
const LocationResult = require('../src/beans/check-in/LocationResult').default;
const {
  calculateAllowedDistanceMeter,
  calculateDistanceMeter,
  isOutOfRange,
} = require('../src/utils/check-in/Distance');

describe('science train check-in utilities', () => {
  test('maps retry actions and the V2 points-disabled error', () => {
    expect(getCheckInErrorInfo('CHECK_IN_OUT_OF_RANGE').retryLocation).toBe(true);
    expect(getCheckInErrorInfo('CHECK_IN_PHOTO_INVALID').replacePhoto).toBe(true);
    expect(getCheckInErrorInfo('ACTIVITY_POINTS_NOT_ENABLED')).toEqual(
      expect.objectContaining({ refreshPoints: true, message: expect.any(String) })
    );
  });

  test('uses only the upload extensions accepted by the server', () => {
    expect(resolveExtension('/tmp/photo.JPEG?token=1')).toBe('jpeg');
    expect(resolveExtension('/tmp/photo.webp')).toBe('webp');
    expect(resolveExtension('/tmp/photo.heic')).toBe('heic');
    expect(resolveExtension('/tmp/photo.gif')).toBe('jpg');
    expect(resolveExtension('/tmp/no-extension')).toBe('jpg');
  });

  test('distinguishes location failures', () => {
    expect(toLocationError({ errMsg: 'getLocation:fail system permission denied' }).code)
      .toBe(LocationErrorCode.SYSTEM_DISABLED);
    expect(toLocationError({ errMsg: 'getLocation:fail auth deny' }).code)
      .toBe(LocationErrorCode.PERMISSION_DENIED);
    expect(toLocationError({ errMsg: 'getLocation:fail timeout' }).code)
      .toBe(LocationErrorCode.TIMEOUT);
  });

  test('uses point radius plus raw location accuracy for the client precheck', () => {
    const coordinate = { latitude: 30.1, longitude: 104.1 };
    expect(calculateDistanceMeter(coordinate, coordinate)).toBe(0);
    expect(calculateAllowedDistanceMeter(100, 50)).toBe(150);
    expect(calculateAllowedDistanceMeter(100, -10)).toBe(100);

    const location = new LocationResult(30, 104, 50);
    expect(isOutOfRange(location, { latitude: 30.0012, longitude: 104 }, 100)).toBe(false);
    expect(isOutOfRange(location, { latitude: 30.002, longitude: 104 }, 100)).toBe(true);
  });
});
