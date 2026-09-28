import LocationResult from '@/beans/check-in/LocationResult'

const EARTH_RADIUS_METER = 6371000

export interface Coordinate {
  latitude: number
  longitude: number
}

export const calculateDistanceMeter = (from: Coordinate, to: Coordinate): number => {
  const latitudeDelta = toRadians(to.latitude - from.latitude)
  const longitudeDelta = toRadians(to.longitude - from.longitude)
  const fromLatitude = toRadians(from.latitude)
  const toLatitude = toRadians(to.latitude)
  const haversine = Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2
  const angle = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  return EARTH_RADIUS_METER * angle
}

export const calculateAllowedDistanceMeter = (
  radiusMeter: number,
  accuracyMeter: number | null
): number => {
  const accuracy = accuracyMeter === null ? 0 : Math.max(0, accuracyMeter)
  return radiusMeter + accuracy
}

export const isOutOfRange = (
  location: LocationResult,
  point: Coordinate,
  radiusMeter: number
): boolean => {
  const allowedDistance = calculateAllowedDistanceMeter(radiusMeter, location.accuracyMeter)
  return calculateDistanceMeter(location, point) > allowedDistance
}

const toRadians = (degree: number): number => degree * Math.PI / 180
