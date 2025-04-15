import type {SupabaseClient} from '@supabase/supabase-js'
import type {
  AbstractBucketRepository,
  CreateBucketInput,
  CreateBucketResult,
  DeleteBucketInput,
  DeleteBucketResult,
  DeleteFileInput,
  DeleteFilesInput,
  DeleteFilesResult,
  GetSignedUrlInput,
  GetSignedUrlResult,
  GetSignedUrlsInput,
  UploadFileInput,
  UploadFileResult,
} from '../bucket-repository.abstract'
import {makeLog} from '../../helpers'
import {supabase} from '../../libs'

export class SupabaseBucketRepositoryImpl implements AbstractBucketRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async createBucket(input: CreateBucketInput): Promise<CreateBucketResult> {
    try {
      makeLog(
        'info',
        '===== started create bucket with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.supabase.storage.createBucket(input.name, {
        public: input.isPublic || false,
      })
      makeLog(
        'info',
        '===== finished create bucket with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res.data?.name || ''
    } catch (e) {
      makeLog('error', '===== failed create bucket with error ==== \n', e)
      throw e
    }
  }

  async deleteBucket(input: DeleteBucketInput): Promise<DeleteBucketResult> {
    try {
      makeLog('info', '===== started delete bucket with input ===== \n', input)
      const res = await this.supabase.storage.deleteBucket(input.id)
      makeLog('info', '===== finished delete bucket with result ===== \n', res)
      return
    } catch (e) {
      makeLog('error', '===== failed delete bucket with error ==== \n', e)
      throw e
    }
  }

  async uploadFile(input: UploadFileInput): Promise<UploadFileResult> {
    try {
      makeLog('info', '===== started upload file with input ===== \n', input)
      const res = await this.supabase.storage
        .from(input.bucketName)
        .upload(input.path, input.file, {
          metadata: input.metadata,
          contentType: input.contentType,
        })
      makeLog('info', '===== finished upload file with result ===== \n', res)
      return {
        id: res.data?.id || '',
        name: res.data?.path || '',
      }
    } catch (e) {
      makeLog('error', '===== failed upload file with error ==== \n', e)
      throw e
    }
  }

  async uploadFiles(input: UploadFileInput[]): Promise<UploadFileResult[]> {
    try {
      makeLog('info', '===== started upload files with input ===== \n', input)
      const promises = input.map((item) => this.uploadFile(item))
      const results = await Promise.all(promises)
      makeLog(
        'info',
        '===== finished upload files with result ===== \n',
        results,
      )
      return results
    } catch (e) {
      makeLog('error', '===== failed upload files with error ==== \n', e)
      throw e
    }
  }

  async deleteFile(input: DeleteFileInput): Promise<DeleteFilesResult> {
    try {
      makeLog('info', '===== started delete file with input ===== \n', input)
      const res = await this.supabase.storage
        .from(input.bucketName)
        .remove([input.path])
      makeLog('info', '===== finished delete file with result ===== \n', res)
      return
    } catch (e) {
      makeLog('error', '===== failed delete file with error ==== \n', e)
      throw e
    }
  }

  async deleteFiles(input: DeleteFilesInput): Promise<DeleteFilesResult> {
    try {
      makeLog('info', '===== started delete files with input ===== \n', input)
      const res = await this.supabase.storage
        .from(input.bucketName)
        .remove(input.paths)
      makeLog('info', '===== finished delete files with result ===== \n', res)
      return
    } catch (e) {
      makeLog('error', '===== failed delete files with error ==== \n', e)
      throw e
    }
  }

  async getSignedUrl(input: GetSignedUrlInput): Promise<GetSignedUrlResult> {
    try {
      makeLog('info', '===== started get signed url with input ===== \n', input)
      const res = await this.supabase.storage
        .from(input.bucketName)
        .createSignedUrl(input.path, input.expiresIn || 3600)
      makeLog('info', '===== finished get signed url with result ===== \n', res)
      return {
        signedUrl: res.data?.signedUrl || '',
        expiresIn: input.expiresIn || 3600,
      }
    } catch (e) {
      makeLog('error', '===== failed get signed url with error ==== \n', e)
      throw e
    }
  }

  async getSignedUrls(
    input: GetSignedUrlsInput,
  ): Promise<GetSignedUrlResult[]> {
    try {
      makeLog(
        'info',
        '===== started get signed urls with input ===== \n',
        input,
      )
      const res = await this.supabase.storage
        .from(input.bucketName)
        .createSignedUrls(input.paths, input.expiresIn || 3600)
      makeLog(
        'info',
        '===== finished get signed urls with result ===== \n',
        res,
      )
      return (
        res.data?.map((item) => ({
          signedUrl: item.signedUrl,
          expiresIn: input.expiresIn || 3600,
        })) || []
      )
    } catch (e) {
      makeLog('error', '===== failed get signed url with error ==== \n', e)
      throw e
    }
  }
}

export function newSupabaseBucketRepositoryImpl() {
  return new SupabaseBucketRepositoryImpl(supabase)
}
