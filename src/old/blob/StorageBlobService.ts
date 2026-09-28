import { BlobServiceClient, BlockBlobClient, BlockBlobParallelUploadOptions } from '@azure/storage-blob'
import { MimeTypeUtils } from './MimeTypeUtils'

// interface PolicyResponse {

// }

/**
 * Azure Blob 操作类
 * - 对@azure/storage-blob的二次封装
 * - api文档：https://docs.microsoft.com/en-us/javascript/api/@azure/storage-blob/blockblobclient?view=azure-node-latest
 * @author ChenWei
 */
export default class StorageBlobService {
  /**
   * 上传文件
   * - 自动支持大文件分片上传
   * @param file 文件
   * @param policy sas凭证
   * @param blobName blob上存放的文件名
   * @param options 其他参数，见 https://docs.microsoft.com/zh-cn/javascript/api/@azure/storage-blob/blockblobparalleluploadoptions?view=azure-node-latest
   */
  uploadFile (file: File, policy: any, blobName: string, options?: BlockBlobParallelUploadOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      let blockBlobClient = this.buildBlockBlobClient(policy, blobName)

      if (!options) {
        options = {}
      }

      options.blobHTTPHeaders = {
        // 文件类型
        blobContentType: MimeTypeUtils.getFileContentType(file.name)
      }

      blockBlobClient.uploadBrowserData(file, options).then(
        (res) => {
          resolve(res)
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  /**
   * 构建分块存储操作客户端
   * @param policy
   * @param blobName 文件存储名称
   * @private
   */
  buildBlockBlobClient (policy: any, blobName: string): BlockBlobClient {
    let url = this.buildUrl(policy)
    return new BlobServiceClient(url).getContainerClient(policy.container).getBlockBlobClient(blobName)
  }

  /**
   * 构建uri
   * @param policy
   * @private
   */
  buildUrl (policy: any): string {
    return policy.storageUri + '?' + policy.storageAccessToken
  }
}
