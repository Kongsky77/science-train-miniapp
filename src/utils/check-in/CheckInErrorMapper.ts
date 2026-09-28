export interface CheckInErrorInfo {
  message: string
  refreshPoints: boolean
  retryLocation: boolean
  replacePhoto: boolean
}

const DEFAULT_ERROR: CheckInErrorInfo = {
  message: '打卡失败，请稍后重试',
  refreshPoints: false,
  retryLocation: false,
  replacePhoto: false
}

const ERROR_MAP: { [key: string]: CheckInErrorInfo } = {
  CHECK_IN_NOT_ENABLED: createError('活动打卡暂未开放', true),
  CHECK_IN_POINT_NOT_FOUND: createError('打卡地点不存在或已调整', true),
  CHECK_IN_POINT_DISABLED: createError('该打卡地点已停用', true),
  CHECK_IN_NOT_STARTED: createError('该地点还未到开放时间', true),
  CHECK_IN_ENDED: createError('该地点打卡已结束', true),
  CHECK_IN_ALREADY_COMPLETED: createError('该地点已经完成打卡', true),
  CHECK_IN_OUT_OF_RANGE: createError('当前位置不在打卡范围内，请重新定位', false, true),
  CHECK_IN_LOCATION_INACCURATE: createError('当前定位精度不足，请到开阔区域重新定位', false, true),
  CHECK_IN_PHOTO_REQUIRED: createError('请先上传打卡照片', false, false, true),
  CHECK_IN_PHOTO_INVALID: createError('照片上传结果无效，请重新选择照片', false, false, true),
  CHECK_IN_USER_NOT_ENTERED: createError('当前用户尚未报名该活动', true),
  CHECK_IN_SUB_USER_FORBIDDEN: createError('无法为当前用户打卡，请重新选择', true),
  ACTIVITY_POINTS_NOT_ENABLED: createError('活动积分功能暂不可用，请稍后再试', true),
  UNAUTHENTICATED: createError('登录状态已失效，请重新登录')
}

export const getCheckInErrorInfo = (code: string, fallbackMessage = ''): CheckInErrorInfo => {
  const mapped = ERROR_MAP[code]
  if (mapped) return mapped
  return {
    ...DEFAULT_ERROR,
    message: fallbackMessage || DEFAULT_ERROR.message
  }
}

function createError (
  message: string,
  refreshPoints = false,
  retryLocation = false,
  replacePhoto = false
): CheckInErrorInfo {
  return { message, refreshPoints, retryLocation, replacePhoto }
}
