export default class LocationResult {
  latitude = 0
  longitude = 0
  accuracyMeter: number | null = null

  constructor (latitude = 0, longitude = 0, accuracyMeter: number | null = null) {
    this.latitude = latitude
    this.longitude = longitude
    this.accuracyMeter = accuracyMeter
  }
}
