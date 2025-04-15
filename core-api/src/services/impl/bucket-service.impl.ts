import {makeLog} from '../../helpers'
import type {AbstractBucketRepository} from '../../repositories/bucket-repository.abstract'
import type {
  AbstractBucketService,
  CreateBucketInputDto,
  CreateBucketResultDto,
  DeleteBucketInputDto,
  DeleteBucketResultDto,
  DeleteFileInputDto,
  DeleteFilesInputDto,
  DeleteFilesResultDto,
  GetSignedUrlInputDto,
  GetSignedUrlResultDto,
  GetSignedUrlsInputDto,
  UploadFileInputDto,
  UploadFileResultDto,
} from '../bucket-service.abstract'

export class BucketServiceImpl implements AbstractBucketService {
  constructor(private readonly bucketRepo: AbstractBucketRepository) {}

  async createBucket(
    input: CreateBucketInputDto,
  ): Promise<CreateBucketResultDto> {
    try {
      makeLog('info', '===== started create bucket with input ===== \n', input)
      const res = await this.bucketRepo.createBucket(input)
      makeLog('info', '===== finished create bucket with result ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed create bucket with error ==== \n', e)
      throw e
    }
  }

  async deleteBucket(
    input: DeleteBucketInputDto,
  ): Promise<DeleteBucketResultDto> {
    try {
      makeLog(
        'info',
        '===== start delete bucket ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.bucketRepo.deleteBucket(input)
      makeLog(
        'info',
        '===== finished delete bucket ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog('error', '===== failed delete bucket with error ==== \n', e)
      throw e
    }
  }

  async uploadFile(input: UploadFileInputDto): Promise<UploadFileResultDto> {
    try {
      makeLog('info', '===== start upload file ===== \n', input)
      const res = await this.bucketRepo.uploadFile(input)
      makeLog('info', '===== finished upload file ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed upload file with error ==== \n', e)
      throw e
    }
  }

  async uploadFiles(
    input: UploadFileInputDto[],
  ): Promise<UploadFileResultDto[]> {
    try {
      makeLog('info', '===== start upload files ===== \n', input)
      const res = await this.bucketRepo.uploadFiles(input)
      makeLog('info', '===== finished upload files ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed upload files with error ==== \n', e)
      throw e
    }
  }

  async deleteFile(input: DeleteFileInputDto): Promise<DeleteFilesResultDto> {
    try {
      makeLog('info', '===== start delete file ===== \n', input)
      const res = await this.bucketRepo.deleteFile(input)
      makeLog('info', '===== finished delete file ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed delete file with error ==== \n', e)
      throw e
    }
  }

  async deleteFiles(input: DeleteFilesInputDto): Promise<DeleteFilesResultDto> {
    try {
      makeLog('info', '===== start delete files ===== \n', input)
      const res = await this.bucketRepo.deleteFiles(input)
      makeLog('info', '===== finished delete files ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed delete files with error ==== \n', e)
      throw e
    }
  }

  async getSignedUrl(
    input: GetSignedUrlInputDto,
  ): Promise<GetSignedUrlResultDto> {
    try {
      makeLog('info', '===== start get signed url ===== \n', input)
      const res = await this.bucketRepo.getSignedUrl(input)
      makeLog('info', '===== finished get signed url ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed get signed url with error ==== \n', e)
      throw e
    }
  }

  async getSignedUrls(
    input: GetSignedUrlsInputDto,
  ): Promise<GetSignedUrlResultDto[]> {
    try {
      makeLog('info', '===== start get signed urls ===== \n', input)
      const res = await this.bucketRepo.getSignedUrls(input)
      makeLog('info', '===== finished get signed urls ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== failed get signed urls with error ==== \n', e)
      throw e
    }
  }
}
