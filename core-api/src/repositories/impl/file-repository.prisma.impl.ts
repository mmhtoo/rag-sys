import {Prisma, type PrismaClient} from '@prisma/client'
import type {
  AbstractFileRepository,
  CountByParentDirIdInput,
  CountByParentDirIdResult,
  CreateFileInput,
  CreateFileResult,
  DeleteFileInput,
  DeleteFileResult,
  GetFileDetailInput,
  GetFileDetailResult,
  GetFileListInput,
  GetFileListResult,
  UpdateFileInput,
  UpdateFileResult,
} from '../file-repository.abstract'
import {getTotalPageCount, makeLog} from '../../helpers'
import {prismaClient} from '../../libs'

export class PrismaFileRepositoryImpl implements AbstractFileRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async countByParentDirId(
    input: CountByParentDirIdInput,
  ): Promise<CountByParentDirIdResult> {
    try {
      makeLog(
        'info',
        '===== started count by parent dir id repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.file.count({
        where: {
          parentDirId: input.parentDirId,
          name: input.fileName,
          id: {not: input.excludeFileId},
          contentType: input.contentType,
          createdAt:
            input.fromDate && input.toDate
              ? {
                  gte: input.fromDate,
                  lte: input.toDate,
                }
              : input.fromDate && !input.toDate
              ? {gte: input.fromDate}
              : {},
          resourcePath: input.resourcePath,
        },
      })
      makeLog(
        'info',
        '===== finished count by parent dir id repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      makeLog(
        'error',
        '===== failed count by parent dir id repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async createFile(input: CreateFileInput): Promise<CreateFileResult> {
    try {
      makeLog(
        'info',
        '===== started create file repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const createRes = await this.prisma.file.create({
        data: {
          name: input.name,
          resourcePath: input.resourcePath,
          size: input.size,
          contentType: input.contentType,
          metadata: input.metadata,
          createdBy: input.createdBy,
          updatedBy: input.createdBy,
          parentDirId: input.parentDirId,
          status: input.status,
        },
      })
      makeLog(
        'info',
        '===== finished create file repo with result ===== \n',
        JSON.stringify(createRes, null, 2),
      )
      return createRes
        ? {
            ...createRes,
            metadata: JSON.stringify(createRes.metadata),
          }
        : null
    } catch (e) {
      makeLog(
        'error',
        '===== failed create file repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getFileDetail(input: GetFileDetailInput): Promise<GetFileDetailResult> {
    try {
      makeLog(
        'info',
        '===== started get file detail repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.file.findUnique({
        where: {
          id: input.id,
        },
      })
      makeLog(
        'info',
        '===== finished get file detail repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res
        ? {
            ...res,
            metadata: JSON.stringify(res.metadata),
          }
        : null
    } catch (e) {
      makeLog(
        'error',
        '===== failed get file detail repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async getFileList(input: GetFileListInput): Promise<GetFileListResult> {
    try {
      makeLog(
        'info',
        '===== started get file list repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const filterParam = {
        parentDirId: input.parentDirId || null,
        name: input.name,
        contentType: input.contentType,
        createdBy: input.createdBy,
        updatedBy: input.updatedBy,
        createdAt:
          input.fromDate && input.toDate
            ? {
                gte: input.fromDate,
                lte: input.toDate,
              }
            : input.fromDate && !input.toDate
            ? {gte: input.fromDate}
            : {},
        resourcePath: input.resourcePath,
      }
      const total = await this.countByParentDirId({
        ...filterParam,
        fileName: input.name,
      })
      const pageIndex = Number(input.page || 1) - 1
      const pageSize = Number(input.pageSize || 10)
      const res = await this.prisma.file.findMany({
        where: filterParam,
        skip: pageIndex * pageSize,
        take: pageSize,
        orderBy: {
          [input.orderBy || 'name']: input.orderDirection || 'asc',
        },
      })
      makeLog(
        'info',
        '===== finished get file list repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return {
        items: res?.map((item) => ({
          ...item,
          metadata: JSON.stringify(item.metadata),
        })),
        pagination: {
          currentPage: input.page || 1,
          totalPage: getTotalPageCount(total, pageSize),
          total,
        },
      }
    } catch (e) {
      makeLog(
        'error',
        '===== failed get file list repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async updateFile(input: UpdateFileInput): Promise<UpdateFileResult> {
    try {
      makeLog(
        'info',
        '===== started update file repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.file.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          resourcePath: input.resourcePath,
          size: input.size,
          contentType: input.contentType,
          metadata: input.metadata,
          updatedBy: input.updatedBy,
          parentDirId: input.parentDirId,
          status: input.status,
        },
      })
      makeLog(
        'info',
        '===== finished update file repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return
    } catch (e) {
      makeLog(
        'error',
        '===== failed update file repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }

  async deleteFile(input: DeleteFileInput): Promise<DeleteFileResult> {
    try {
      makeLog(
        'info',
        '===== started delete file repo with input ===== \n',
        JSON.stringify(input, null, 2),
      )
      const res = await this.prisma.file.delete({
        where: {
          id: input.id,
        },
        select: {
          resourcePath: true,
        },
      })
      makeLog(
        'info',
        '===== finished delete file repo with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      return res
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new Error('File was not found to delete!')
        }
      }
      makeLog(
        'error',
        '===== failed delete file repo with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      throw e
    }
  }
}

export function newPrismaFileRepositoryImpl() {
  return new PrismaFileRepositoryImpl(prismaClient)
}
