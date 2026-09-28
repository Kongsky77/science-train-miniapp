import StorageBlobService from '@/old/blob/StorageBlobService'
import BlobService from '@/service/BlobService'
import { getUUID } from '@/utils/Weapon'
import { FileInfos, SafeFileInfos, FileUrls } from '@/beans/common/FileInfos'

const BLOB_FILE_PATH = 'ucenter/image/'

export const uploadFile = (imageFile: File) => {
  const blobService = new BlobService()
  return blobService.getBlobCert().then((res: any) => {
    const success = res.success
    if (success) {
      const blobConfig = res.data
      const { storageUri, container, storageAccessToken } = blobConfig
      const file = imageFile
      const fileName = getUUID() + '.' + file.name.split('.').pop()
      const fullBlobPath = BLOB_FILE_PATH + fileName
      const storageBlobService = new StorageBlobService()
      return storageBlobService
        .uploadFile(
          file,
          {
            storageUri,
            container,
            storageAccessToken
          },
          fullBlobPath
        )
        .then((res) => {
          const blobUrl = `${storageUri}/${container}/${fullBlobPath}`
          return blobUrl
        })
        .catch((err) => {
          return Promise.reject('上传图片失败')
        })
    } else {
      return Promise.reject('获取图片上传凭证失败')
    }
  })
}

export const uploadMoreFiles = (fileInfos: FileInfos) => {
  const safeFileInfos = removeEmptyFiles(fileInfos)
  const filePromises = makeFilePromises(safeFileInfos)
  return Promise.all(filePromises).then(spreadFileurlsArray)
}

const spreadFileurlsArray = (fileUrlsArray: Array<FileUrls>) => {
  const fileUrls = fileUrlsArray.reduce((fileUrls, fileUrl) => {
    return {
      ...fileUrls,
      ...fileUrl
    }
  }, {})

  return fileUrls
}

// 过滤出不为空的文件
const removeEmptyFiles = (fileInfos: FileInfos): SafeFileInfos => {
  const fileInforeducer = (filterFileInfos: SafeFileInfos, key: keyof FileInfos) => {
    const file = fileInfos[key]
    if (file) {
      filterFileInfos[key] = file
    }

    return filterFileInfos
  }
  const filterFileInfos = Object.keys(fileInfos).reduce(fileInforeducer, {})
  return filterFileInfos
}

// 生成批量上传图片的Promises，用于传递给 Promise.all 使用
const makeFilePromises = (safeFileInfos: SafeFileInfos): Array<Promise<FileUrls>> => {
  const promisesReducer = (filePromises: Array<Promise<FileUrls>>, key: keyof SafeFileInfos) => {
    const file = safeFileInfos[key]
    filePromises.push(
      uploadFile(file).then((blobUrls): FileUrls => {
        return {
          [key]: blobUrls
        }
      })
    )
    return filePromises
  }
  const filePromises = Object.keys(safeFileInfos).reduce(promisesReducer, [])
  return filePromises
}

export default uploadFile
