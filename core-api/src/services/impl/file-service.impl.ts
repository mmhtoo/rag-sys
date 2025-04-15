import {makeLog} from '../../helpers'
import type {AbstractFileRepository} from '../../repositories'
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

// implementation for file service
export class FileServiceImpl implements AbstractFileService {
  constructor(private readonly fileRepo: AbstractFileRepository) {}

  async createFile(input: CreateFileInputDto): Promise<CreateFileResultDto> {
    try {
      makeLog(
        'info',
        'started create file service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.fileRepo.createFile(input)
      makeLog(
        'info',
        'finished create file service with result',
        JSON.stringify(res, null, 2),
      )
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
      const res = await this.fileRepo.updateFile(input)
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

export function newFileServiceImpl(fileRepo: AbstractFileRepository) {
  return new FileServiceImpl(fileRepo)
}
