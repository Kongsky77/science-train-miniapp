import LocationResult from './LocationResult'

export enum CheckInAttemptStage {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  PHOTO = 'PHOTO',
  SUBMITTING = 'SUBMITTING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS'
}

export default class CheckInAttempt {
  pointId = ''
  requestId = ''
  location: LocationResult | null = null
  localPhotoPath = ''
  photoUrl = ''
  stage: CheckInAttemptStage = CheckInAttemptStage.IDLE
  errorCode = ''
  errorMessage = ''

  constructor (pointId = '', requestId = '') {
    this.pointId = pointId
    this.requestId = requestId
  }
}
