import LocationResult from '@/beans/check-in/LocationResult'
import {
  calculateAllowedDistanceMeter,
  calculateDistanceMeter,
  isOutOfRange
} from '@/utils/check-in/Distance'

describe('check-in distance helpers', () => {
  it('returns zero for the same coordinate', () => {
    const coordinate = { latitude: 30.1, longitude: 104.1 }
    expect(calculateDistanceMeter(coordinate, coordinate)).toBe(0)
  })

  it('uses point radius plus location accuracy as the allowed distance', () => {
    expect(calculateAllowedDistanceMeter(100, 50)).toBe(150)
    expect(calculateAllowedDistanceMeter(100, null)).toBe(100)
    expect(calculateAllowedDistanceMeter(100, -10)).toBe(100)
  })

  it('rejects a location beyond point radius plus location accuracy', () => {
    const location = new LocationResult(30, 104, 50)
    const withinCompensatedRange = { latitude: 30.0012, longitude: 104 }
    const outsideCompensatedRange = { latitude: 30.002, longitude: 104 }

    expect(isOutOfRange(location, withinCompensatedRange, 100)).toBe(false)
    expect(isOutOfRange(location, outsideCompensatedRange, 100)).toBe(true)
  })
})
