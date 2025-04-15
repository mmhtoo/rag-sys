import {makeLog} from '../../helpers'
import type {AbstractDirectoryRepository} from '../../repositories'
import type {
  AbstractDirectoryService,
  CountDirectoryInputDto,
  CountDirectoryResultDto,
  CreateDirectoryInputDto,
  CreateDirectoryResultDto,
  DeleteDirectoryInputDto,
  DeleteDirectoryResultDto,
  GetDirectoryDetailInputDto,
  GetDirectoryDetailResultDto,
  GetDirectoryListInputDto,
  GetDirectoryListResultDto,
  UpdateDirectoryInputDto,
  UpdateDirectoryResultDto,
} from '../directory-service.abstract'

export class DirectoryServiceImpl implements AbstractDirectoryService {
  constructor(private readonly directoryRepo: AbstractDirectoryRepository) {}

  async createDirectory(
    input: CreateDirectoryInputDto,
  ): Promise<CreateDirectoryResultDto> {
    try {
      makeLog(
        'info',
        'started create directory service with input',
        JSON.stringify(input, null, 2),
      )
      const countWithSameName = await this.directoryRepo.countDirectory({
        name: input.name,
        parentDirId: input.parentDirId || null,
      })
      if (countWithSameName > 0) {
        throw new Error('Directory with same name already exists!')
      }
      let pathname = `/${input.name}`
      if (input.parentDirId) {
        const parentDir = await this.getDirectoryDetail({
          id: input.parentDirId,
        })
        if (parentDir) pathname = `${parentDir.pathname}/${input.name}`
      }
      const res = await this.directoryRepo.createDirectory({
        ...input,
        pathname,
      })
      makeLog(
        'info',
        'finished create directory service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed create directory service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getDirectoryDetail(
    input: GetDirectoryDetailInputDto,
  ): Promise<GetDirectoryDetailResultDto> {
    try {
      makeLog(
        'info',
        'started get directory detail service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.directoryRepo.getDirectoryDetail(input)
      makeLog(
        'info',
        'finished get directory detail service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed get directory detail service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getDirectoryList(
    input: GetDirectoryListInputDto,
  ): Promise<GetDirectoryListResultDto> {
    try {
      makeLog(
        'info',
        'started get directory list service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.directoryRepo.getDirectoryList(input)
      makeLog(
        'info',
        'finished get directory list service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed get directory list service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async updateDirectory(
    input: UpdateDirectoryInputDto,
  ): Promise<UpdateDirectoryResultDto> {
    try {
      makeLog(
        'info',
        'started update directory service with input',
        JSON.stringify(input, null, 2),
      )
      const countWithSameName = await this.directoryRepo.countDirectory({
        name: input.name,
        parentDirId: input.parentDirId || null,
        excludeId: input.id,
      })
      if (countWithSameName > 0) {
        throw new Error('Directory with same name already exists!')
      }
      let pathname = `/${input.name}`
      if (input.parentDirId) {
        const parentDir = await this.getDirectoryDetail({
          id: input.parentDirId,
        })
        if (parentDir) pathname = `${parentDir.pathname}/${input.name}`
      }
      const res = await this.directoryRepo.updateDirectory({
        ...input,
        pathname,
      })
      makeLog(
        'info',
        'finished update directory service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed update directory service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async deleteDirectory(
    input: DeleteDirectoryInputDto,
  ): Promise<DeleteDirectoryResultDto> {
    try {
      makeLog(
        'info',
        'started delete directory service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.directoryRepo.deleteDirectory(input)
      makeLog(
        'info',
        'finished delete directory service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed delete directory service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async countDirectory(
    input: CountDirectoryInputDto,
  ): Promise<CountDirectoryResultDto> {
    try {
      makeLog(
        'info',
        'started count directory service with input',
        JSON.stringify(input, null, 2),
      )
      const res = await this.directoryRepo.countDirectory(input)
      makeLog(
        'info',
        'finished count directory service with result',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        'failed count directory service with error',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }
}

export function newDirectoryServiceImpl(
  directoryRepo: AbstractDirectoryRepository,
) {
  return new DirectoryServiceImpl(directoryRepo)
}
