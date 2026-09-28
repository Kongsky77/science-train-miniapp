export interface FileInfos {
  [key: string]: File | undefined
}

export interface SafeFileInfos {
  [key: string]: File
}

export interface FileUrls {
  [key: string]: string
}

export default FileInfos
