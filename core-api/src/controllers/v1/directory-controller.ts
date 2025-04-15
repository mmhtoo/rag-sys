import type {Context} from 'hono'
import type {BlankEnv, BlankInput} from 'hono/types'
import {
  newPrismaDirectoryRepositoryImpl,
  type AbstractDirectoryRepository,
} from '../../repositories'
import {newDirectoryServiceImpl} from '../../services/impl/directory-service.impl'
import {prismaClient} from '../../libs'
import type {
  CreateDirectoryReqDto,
  GetDirectoryFilterReqDto,
  UpdateDirectoryReqDto,
} from '../../validation-schemas/v1'
import {baseResponse, dataResponse, errorResponse, makeLog} from '../../helpers'
import {StatusCodes} from 'http-status-codes'

export class DirectoryController {
  constructor(private readonly directoryService: AbstractDirectoryRepository) {}

  async handleGetDirectoriesWithFilter(c: Context<BlankEnv, '/', BlankInput>) {
    try {
      const queryBody = c.req.query() as unknown as GetDirectoryFilterReqDto
      makeLog(
        'info',
        '===== started get directories with filter ===== \n',
        JSON.stringify(queryBody, null, 2),
      )
      const res = await this.directoryService.getDirectoryList({
        ...queryBody,
        page: Number(queryBody.page),
        pageSize: Number(queryBody.pageSize),
      })
      makeLog(
        'info',
        '===== finished get directories with filter ===== \n',
        JSON.stringify(res, null, 2),
      )
      c.status(StatusCodes.OK)
      return c.json(dataResponse('Success!', res))
    } catch (e) {
      makeLog(
        'error',
        '===== failed get directories with filter ===== \n',
        JSON.stringify(e, null, 2),
      )
      c.status(StatusCodes.INTERNAL_SERVER_ERROR)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleCreateDirectory(
    c: Context<BlankEnv, '/', {in: {json: CreateDirectoryReqDto}}>,
  ) {
    try {
      const reqBody = await c.req.json<CreateDirectoryReqDto>()
      makeLog(
        'info',
        '===== started create directory controller with input ===== \n',
        JSON.stringify(reqBody, null, 2),
      )
      // just simulation before IAM
      const userId = c.req.header('x-user-id') || 'ADMIN'
      const res = await this.directoryService.createDirectory({
        name: reqBody.name,
        parentDirId: reqBody.parentDirId,
        createdBy: userId,
      })

      makeLog(
        'info',
        '===== finished create directory controller with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      c.status(StatusCodes.CREATED)
      return c.json(dataResponse('Directory created!', res))
    } catch (e) {
      makeLog(
        'error',
        '===== failed create directory controller with error ===== \n',
        JSON.stringify(e, null, 2),
      )
      c.status(StatusCodes.INTERNAL_SERVER_ERROR)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleGetDirectoryById(c: Context<BlankEnv, '/:id', BlankInput>) {
    try {
      const id = c.req.param('id')
      makeLog('info', '===== handleGetDirectoryById with input ===== \n', id)
      const res = await this.directoryService.getDirectoryDetail({
        id,
      })
      makeLog(
        'info',
        '===== handleGetDirectoryById finished with result ===== \n',
        JSON.stringify(res, null, 2),
      )
      if (!res) {
        c.status(StatusCodes.NOT_FOUND)
        return c.json(errorResponse('Directory not found!', 'Not Found!'))
      }
      return c.json(dataResponse('Directory found!', res))
    } catch (e) {
      makeLog(
        'error',
        '===== handleGetDirectoryById error =====',
        JSON.stringify(e, null, 2),
      )
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleDeleteById(c: Context<BlankEnv, '/:id', BlankInput>) {
    try {
      const id = c.req.param('id')
      makeLog('info', '===== handleDeleteById with input ===== \n', id)
      await this.directoryService.deleteDirectory({
        id,
      })
      makeLog('info', '===== handleDeleteById finished ===== \n')
      return c.json(baseResponse('Directory deleted!'))
    } catch (e) {
      makeLog(
        'error',
        '===== handleDeleteById error =====',
        JSON.stringify(e, null, 2),
      )
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleUpdateById(c: Context<BlankEnv, '/:id', BlankInput>) {
    try {
      const id = c.req.param('id')
      makeLog('info', '===== handleUpdateById with input ===== \n', id)
      const reqBody = await c.req.json<UpdateDirectoryReqDto>()
      // just simulation before IAM
      const userId = c.req.header('x-user-id') || 'ADMIN'
      const res = await this.directoryService.updateDirectory({
        id,
        ...reqBody,
        updatedBy: userId,
      })
      if (!res || !res.id) {
        c.status(StatusCodes.NOT_FOUND)
        return c.json(errorResponse('Directory not found!', 'Not Found!'))
      }
      makeLog(
        'info',
        '===== handleUpdateById finished ===== \n',
        JSON.stringify(res, null, 2),
      )
      return c.json(baseResponse('Directory updated!'))
    } catch (e) {
      makeLog(
        'error',
        '===== handleUpdateById error =====',
        JSON.stringify(e, null, 2),
      )
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }
}

export function newDirectoryController() {
  return new DirectoryController(
    newDirectoryServiceImpl(newPrismaDirectoryRepositoryImpl(prismaClient)),
  )
}
