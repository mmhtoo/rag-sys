import type {
  CreateBucketInput,
  CreateBucketResult,
  DeleteBucketInput,
  DeleteBucketResult,
  UploadFileInput,
  UploadFileResult,
  DeleteFileInput,
  DeleteFilesResult,
  GetSignedUrlInput,
  GetSignedUrlsInput,
  DeleteFilesInput,
  DeleteFileResult,
  GetSignedUrlResult,
} from '../repositories/bucket-repository.abstract'

// abstraction for bucket service
export abstract class AbstractBucketService {
  abstract createBucket(
    input: CreateBucketInputDto,
  ): Promise<CreateBucketResultDto>
  abstract deleteBucket(
    input: DeleteBucketInputDto,
  ): Promise<DeleteBucketResultDto>
  abstract uploadFile(input: UploadFileInputDto): Promise<UploadFileResultDto>
  abstract uploadFiles(
    input: UploadFileInputDto[],
  ): Promise<UploadFileResultDto[]>
  abstract deleteFile(input: DeleteFileInputDto): Promise<DeleteFilesResultDto>
  abstract deleteFiles(
    input: DeleteFilesInputDto,
  ): Promise<DeleteFilesResultDto>
  abstract getSignedUrl(
    input: GetSignedUrlInputDto,
  ): Promise<GetSignedUrlResultDto>
  abstract getSignedUrls(
    input: GetSignedUrlsInputDto,
  ): Promise<GetSignedUrlResultDto[]>
}

export interface CreateBucketInputDto extends CreateBucketInput {}
export type CreateBucketResultDto = CreateBucketResult

export interface DeleteBucketInputDto extends DeleteBucketInput {}
export type DeleteBucketResultDto = DeleteBucketResult

export interface UploadFileInputDto extends UploadFileInput {}
export type UploadFileResultDto = UploadFileResult

export interface DeleteFileInputDto extends DeleteFileInput {}
export type DeleteFileResultDto = DeleteFileResult

export interface DeleteFilesInputDto extends DeleteFilesInput {}
export type DeleteFilesResultDto = DeleteFilesResult

export interface GetSignedUrlInputDto extends GetSignedUrlInput {}
export interface GetSignedUrlsInputDto extends GetSignedUrlsInput {}

export interface GetSignedUrlResultDto extends GetSignedUrlResult {}
