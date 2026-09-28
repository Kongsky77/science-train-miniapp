import { getCheckInErrorInfo } from '@/utils/check-in/CheckInErrorMapper'
import { resolveExtension } from '@/service/CheckInPhotoService'
import { LocationErrorCode, toLocationError } from '@/service/LocationService'

describe('check-in utility contracts', () => {
  it('maps range and photo failures to the correct retry action', () => {
    const rangeError = getCheckInErrorInfo('CHECK_IN_OUT_OF_RANGE')
    const photoError = getCheckInErrorInfo('CHECK_IN_PHOTO_INVALID')

    expect(rangeError.retryLocation).toBe(true)
    expect(rangeError.refreshPoints).toBe(false)
    expect(photoError.replacePhoto).toBe(true)
  })

  it('uses the server-supported photo extension set', () => {
    expect(resolveExtension('/tmp/photo.JPEG?token=1')).toBe('jpeg')
    expect(resolveExtension('/tmp/photo.webp')).toBe('webp')
    expect(resolveExtension('/tmp/no-extension')).toBe('jpg')
    expect(resolveExtension('/tmp/photo.gif')).toBe('jpg')
  })

  it('distinguishes system location switches from app authorization failures', () => {
    const systemError = toLocationError({ errMsg: 'getLocation:fail system permission denied' })
    const authorizationError = toLocationError({ errMsg: 'getLocation:fail auth deny' })
    const timeoutError = toLocationError({ errMsg: 'getLocation:fail timeout' })

    expect(systemError.code).toBe(LocationErrorCode.SYSTEM_DISABLED)
    expect(authorizationError.code).toBe(LocationErrorCode.PERMISSION_DENIED)
    expect(timeoutError.code).toBe(LocationErrorCode.TIMEOUT)
  })
})
