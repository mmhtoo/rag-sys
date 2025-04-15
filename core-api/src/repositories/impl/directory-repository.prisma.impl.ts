import type {PrismaClient} from '@prisma/client'
import type {
  AbstractDirectoryRepository,
  CountDirectoryInput,
  CountDirectoryResult,
  CreateDirectoryInput,
  CreateDirectoryResult,
  DeleteDirectoryInput,
  DeleteDirectoryResult,
  GetDirectoryDetailInput,
  GetDirectoryDetailResult,
  GetDirectoryListInput,
  GetDirectoryListResult,
  UpdateDirectoryInput,
  UpdateDirectoryResult,
} from '../directory-repository.abstract'
import {getTotalPageCount, makeLog} from '../../helpers'

export class PrismaDirectoryRepositoryImpl
  implements AbstractDirectoryRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async countDirectory(
    input: CountDirectoryInput,
  ): Promise<CountDirectoryResult> {
    try {
      makeLog(
        'info',
        '===== started count directory repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.directory.count({
        where: {
          parentDirId: input.parentDirId,
        },
      })
      makeLog(
        'info',
        '===== finished count directory repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        '===== failed count directory repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async createDirectory(
    input: CreateDirectoryInput,
  ): Promise<CreateDirectoryResult> {
    try {
      makeLog(
        'info',
        '===== started create directory repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const createRes = await this.prisma.directory.create({
        data: {
          name: input.name,
          createdBy: input.createdBy,
          updatedBy: input.createdBy,
          parentDirId: input.parentDirId || null,
        },
      })
      makeLog(
        'info',
        '===== finished create directory repo with result ===== \n',
        JSON.stringify(createRes, null, 2),
      )
      return createRes || null
    } catch (e) {
      makeLog(
        'error',
        '===== started create directory repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getDirectoryDetail(
    input: GetDirectoryDetailInput,
  ): Promise<GetDirectoryDetailResult> {
    try {
      makeLog(
        'info',
        '===== started get directory detail repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.directory.findUnique({
        where: {
          id: input.id,
        },
      })
      makeLog(
        'info',
        '===== finished get directory detail repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      throw res
    } catch (e) {
      makeLog(
        'error',
        '===== failed get directory detail repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getDirectoryList(
    input: GetDirectoryListInput,
  ): Promise<GetDirectoryListResult> {
    try {
      makeLog(
        'info',
        '===== started get directory list repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const total = await this.countDirectory({
        parentDirId: input.parentDirId,
      })
      const pageIndex = Number(input.page || 1) - 1
      const pageSize = Number(input.pageSize || 10)
      const res = await this.prisma.directory.findMany({
        where: {
          parentDirId: input.parentDirId || null,
        },
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy: {
          [input.orderBy || 'name']: input.orderDirection || 'asc',
        },
      })
      return {
        items: res,
        pagination: {
          currentPage: input.page || 1,
          totalPage: getTotalPageCount(total, pageSize),
          total,
        },
      }
    } catch (e) {
      makeLog(
        'error',
        '===== failed get directory list repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async updateDirectory(
    input: UpdateDirectoryInput,
  ): Promise<UpdateDirectoryResult> {
    try {
      makeLog(
        'info',
        '===== started update directory repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.directory.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          updatedBy: input.updatedBy,
          parentDirId: input.parentDirId,
        },
        select: {},
      })
      makeLog(
        'info',
        '===== finished update directory repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return
    } catch (e) {
      makeLog(
        'error',
        '===== failed update directory repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async deleteDirectory(
    input: DeleteDirectoryInput,
  ): Promise<DeleteDirectoryResult> {
    try {
      makeLog(
        'info',
        '===== started delete directory repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.directory.delete({
        where: {
          id: input.id,
        },
      })
      makeLog(
        'info',
        '===== finished delete directory repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return
    } catch (e) {
      makeLog(
        'error',
        '===== failed delete directory repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }
}

export function newPrismaDirectoryRepositoryImpl(prisma: PrismaClient) {
  return new PrismaDirectoryRepositoryImpl(prisma)
}
