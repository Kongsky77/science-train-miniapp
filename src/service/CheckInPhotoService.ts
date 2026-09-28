import BlobService from '@/service/BlobService'

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic']

export default class CheckInPhotoService {
  private readonly blobService = new BlobService()

  async upload (
    filePath: string,
    activityId: string,
    childId: string,
    pointId: string,
    requestId: string
  ): Promise<string> {
    const extension = resolveExtension(filePath)
    const blobDir = `${activityId}/checkin/${childId}/${pointId}`
    const blobName = `${requestId}.${extension}`
    const response = await this.blobService.upLoadFile(filePath, blobDir, blobName)
    if (!response.success || !response.data) {
      throw new Error('照片上传失败')
    }
    return response.data
  }
}

export const resolveExtension = (filePath: string): string => {
  const cleanPath = String(filePath || '').split('?')[0].split('#')[0]
  const matched = cleanPath.match(/\.([a-zA-Z0-9]+)$/)
  const extension = matched ? matched[1].toLowerCase() : 'jpg'
  return ALLOWED_EXTENSIONS.indexOf(extension) >= 0 ? extension : 'jpg'
}
