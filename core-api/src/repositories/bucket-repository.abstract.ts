// abstraction for bucket repository
export abstract class AbstractBucketRepository {
  abstract createBucket(input: CreateBucketInput): Promise<CreateBucketResult>
  abstract deleteBucket(input: DeleteBucketInput): Promise<DeleteBucketResult>
  abstract uploadFile(input: UploadFileInput): Promise<UploadFileResult>
  abstract uploadFiles(input: UploadFileInput[]): Promise<UploadFileResult[]>
  abstract deleteFile(input: DeleteFileInput): Promise<DeleteFileResult>
  abstract deleteFiles(input: DeleteFilesInput): Promise<DeleteFilesResult>
  abstract getSignedUrl(input: GetSignedUrlInput): Promise<GetSignedUrlResult>
  abstract getSignedUrls(
    input: GetSignedUrlsInput,
  ): Promise<GetSignedUrlResult[]>
  abstract copyFile(input: CopyFileInput): Promise<CopyFileResult>
}

export interface CreateBucketInput {
  name: string
  isPublic?: boolean
}
export type CreateBucketResult = string

export interface DeleteBucketInput {
  id: string
}
export type DeleteBucketResult = void

export interface UploadFileInput {
  bucketName: string
  path: string
  file:
    | ArrayBuffer
    | ArrayBufferView
    | Blob
    | Buffer
    | File
    | FormData
    | NodeJS.ReadableStream
    | ReadableStream<Uint8Array>
    | URLSearchParams
    | string
  metadata?: Record<string, any>
  contentType?: string
}

export interface UploadFileResult {
  id: string
  name: string
}

export interface DeleteFileInput {
  path: string
  bucketName: string
}

export type DeleteFileResult = void

export interface DeleteFilesInput {
  paths: string[]
  bucketName: string
}

export type DeleteFilesResult = void

export interface GetSignedUrlInput {
  path: string
  expiresIn?: number
  bucketName: string
}

export interface GetSignedUrlsInput {
  paths: string[]
  bucketName: string
  expiresIn?: number
}

export interface GetSignedUrlResult {
  signedUrl: string
  expiresIn: number
}

export interface CopyFileInput {
  sourcePath: string
  targetPath: string
  bucketName: string
}

export type CopyFileResult = void
