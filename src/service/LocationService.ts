import LocationResult from '@/beans/check-in/LocationResult'

export enum LocationErrorCode {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SYSTEM_DISABLED = 'SYSTEM_DISABLED',
  TIMEOUT = 'TIMEOUT',
  INVALID_RESULT = 'INVALID_RESULT',
  UNKNOWN = 'UNKNOWN'
}

export class LocationError extends Error {
  code: LocationErrorCode

  constructor (code: LocationErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export default class LocationService {
  async getCurrentLocation (): Promise<LocationResult> {
    const setting = await this.getSetting()
    if (setting && setting.authSetting && setting.authSetting['scope.userLocation'] === false) {
      throw new LocationError(LocationErrorCode.PERMISSION_DENIED, '需要位置权限才能完成打卡')
    }

    const location = await new Promise<any>((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02',
        isHighAccuracy: true,
        highAccuracyExpireTime: 5000,
        success: resolve,
        fail: reject
      } as any)
    }).catch((error) => {
      throw toLocationError(error)
    })

    const latitude = Number(location.latitude)
    const longitude = Number(location.longitude)
    if (!isValidCoordinate(latitude, longitude)) {
      throw new LocationError(LocationErrorCode.INVALID_RESULT, '定位结果无效，请重新定位')
    }

    const accuracy = Number(location.accuracy)
    return new LocationResult(
      latitude,
      longitude,
      Number.isFinite(accuracy) && accuracy >= 0 ? accuracy : null
    )
  }

  openSetting (): Promise<any> {
    return new Promise((resolve, reject) => {
      uni.openSetting({ success: resolve, fail: reject })
    })
  }

  private getSetting (): Promise<any> {
    return new Promise((resolve) => {
      uni.getSetting({
        success: resolve,
        fail: () => resolve({ authSetting: {} })
      })
    })
  }
}

export const toLocationError = (error: any): LocationError => {
  const message = String((error && (error.errMsg || error.message)) || '').toLowerCase()
  if (containsAny(message, ['system permission', 'location service', 'locationswitchoff', 'gps'])) {
    return new LocationError(LocationErrorCode.SYSTEM_DISABLED, '系统定位服务未开启')
  }
  if (containsAny(message, ['auth deny', 'authorize', 'permission'])) {
    return new LocationError(LocationErrorCode.PERMISSION_DENIED, '需要位置权限才能完成打卡')
  }
  if (message.indexOf('timeout') >= 0) {
    return new LocationError(LocationErrorCode.TIMEOUT, '定位超时，请到开阔区域重试')
  }
  return new LocationError(LocationErrorCode.UNKNOWN, '定位失败，请稍后重试')
}

const isValidCoordinate = (latitude: number, longitude: number): boolean => {
  return Number.isFinite(latitude) && Number.isFinite(longitude) &&
    latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}

const containsAny = (value: string, keywords: string[]): boolean => {
  return keywords.some((keyword) => value.indexOf(keyword) >= 0)
}
