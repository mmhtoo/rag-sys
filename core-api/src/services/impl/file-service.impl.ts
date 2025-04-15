import {env} from '../../configs'
import {makeLog} from '../../helpers'
import {
  newPrismaDirectoryRepositoryImpl,
  newPrismaFileRepositoryImpl,
  type AbstractFileRepository,
} from '../../repositories'
import type {AbstractBucketService} from '../bucket-service.abstract'
import type {AbstractDirectoryService} from '../directory-service.abstract'
import type {
  AbstractFileService,
  CountByParentDirIdInputDto,
  CountByParentDirIdResultDto,
  CreateFileInputDto,
  CreateFileResultDto,
  DeleteFileInputDto,
  DeleteFileResultDto,
  GetFileDetailInputDto,
  GetFileDetailResultDto,
  GetFileListInputDto,
  GetFileListResultDto,
  UpdateFileInputDto,
  UpdateFileResultDto,
} from '../file-service.abstract'
import {newBucketServiceImpl} from './bucket-service.impl'
import {newDirectoryServiceImpl} from './directory-service.impl'

// implementation for file service
export class FileServiceImpl implements AbstractFileService {
  constructor(
    private readonly fileRepo: AbstractFileRepository,
    private readonly directoryService: AbstractDirectoryService,
    private readonly bucketService: AbstractBucketService,
  ) {}

  async createFile(input: CreateFileInputDto): Promise<CreateFileResultDto> {
    try {
      makeLog(
        'info',
        'started create file service with input',
        JSON.stringify(input, null, 2),
      )
      const countWithSameName = await this.fileRepo.countByParentDirId({
        parentDirId: input.parentDirId || null,
        fileName: input.name,
      })
      if (countWithSameName > 0) {
        throw new Error('File with same name already exists!')
      }
      let pathname = `${input.name}`
      if (input.parentDirId) {
        const parentDir = await this.directoryService.getDirectoryDetail({
          id: input.parentDirId,
        })
        if (parentDir) pathname = `${parentDir.pathname}/${input.name}`
      }
      const res = await this.fileRepo.createFile({
        ...input,
        resourcePath: pathname,
      })
      makeLog(
        'info',
        'finished create file service with result',
        JSON.stringify(res, null, 2),
      )
      if (res && res.resourcePath) {
        await this.bucketService.uploadFile({
          path: res.resourcePath,
          file: input.file,
          bucketName: env.DEFAULT_BUCKET_NAME,
        })
      }
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed create file service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getFileDetail(
    input: GetFileDetailInputDto,
  ): Promise<GetFileDetailResultDto> {
    try {
      makeLog(
        'info',
        'started get file detail service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.fileRepo.getFileDetail(input)
      makeLog(
        'info',
        'finished get file detail service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed get file detail service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getFileList(input: GetFileListInputDto): Promise<GetFileListResultDto> {
    try {
      makeLog(
        'info',
        'started get file list service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.fileRepo.getFileList(input)
      makeLog(
        'info',
        'finished get file list service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed get file list service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async updateFile(input: UpdateFileInputDto): Promise<UpdateFileResultDto> {
    try {
      makeLog(
        'info',
        'started update file service with input',
        JSON.stringify(input, null, 2),
      )
      const countWithSameName = await this.fileRepo.countByParentDirId({
        parentDirId: input.parentDirId || null,
        fileName: input.name,
        excludeFileId: input.id,
      })
      if (countWithSameName > 0) {
        throw new Error('File with same name already exists!')
      }
      const fileDetail = await this.getFileDetail({
        id: input.id,
      })

      if (
        fileDetail?.name == input.name &&
        input.parentDirId == fileDetail?.parentDirId &&
        !input.file &&
        input.metadata === fileDetail?.metadata
      ) {
        throw new Error('No changes!')
      }

      let newPath = `${input.name}`
      if (input.parentDirId) {
        const parentDir = await this.directoryService.getDirectoryDetail({
          id: input.parentDirId,
        })
        if (parentDir) newPath = `${parentDir.pathname}/${input.name}`
      }

      const res = await this.fileRepo.updateFile({
        ...input,
        resourcePath: newPath,
      })

      const oldResourcePath = fileDetail?.resourcePath
      // changed file and path
      if (oldResourcePath !== newPath && input.file) {
        const promises = [
          this.bucketService.deleteFile({
            path: oldResourcePath || '',
            bucketName: env.DEFAULT_BUCKET_NAME,
          }),
          this.bucketService.uploadFile({
            path: newPath,
            file: input.file,
            bucketName: env.DEFAULT_BUCKET_NAME,
          }),
        ]
        await Promise.all(promises)
      }
      // just name change
      if (oldResourcePath !== newPath && !input.file) {
        await this.bucketService.copyFile({
          sourcePath: oldResourcePath || '',
          targetPath: newPath,
          bucketName: env.DEFAULT_BUCKET_NAME,
        })
        await this.bucketService.deleteFile({
          path: oldResourcePath || '',
          bucketName: env.DEFAULT_BUCKET_NAME,
        })
      }

      makeLog(
        'info',
        'finished update file service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed update file service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async deleteFile(input: DeleteFileInputDto): Promise<DeleteFileResultDto> {
    try {
      makeLog(
        'info',
        'started delete file service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.fileRepo.deleteFile(input)
      makeLog(
        'info',
        'finished delete file service with result',
        JSON.stringify(res, null, 2),
      )
      if (res && res.resourcePath) {
        await this.bucketService.deleteFile({
          path: res.resourcePath,
          bucketName: env.DEFAULT_BUCKET_NAME,
        })
      }
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed delete file service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async countByParentDirId(
    input: CountByParentDirIdInputDto,
  ): Promise<CountByParentDirIdResultDto> {
    try {
      makeLog(
        'info',
        'started count by parent dir id service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.fileRepo.countByParentDirId(input)
      makeLog(
        'info',
        'finished count by parent dir id service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed count by parent dir id service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }
}

export function newFileServiceImpl() {
  return new FileServiceImpl(
    newPrismaFileRepositoryImpl(),
    newDirectoryServiceImpl(newPrismaDirectoryRepositoryImpl()),
    newBucketServiceImpl(),
  )
}
