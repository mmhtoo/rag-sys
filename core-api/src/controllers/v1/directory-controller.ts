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
} from '../../validation-schemas/v1'
import {dataResponse, errorResponse, makeLog} from '../../helpers'
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
      // just simulation before IAM
      const userId = c.req.header('x-user-id') || 'ADMIN'
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
      console.log(this)
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
    return c.json({
      message: 'Get Detail directory!',
    })
  }

  async handleDeleteById(c: Context<BlankEnv, '/:id', BlankInput>) {
    return c.json({
      message: 'Delete directory',
    })
  }

  async handleUpdateById(c: Context<BlankEnv, '/:id', BlankInput>) {
    return c.json({
      message: 'Update directory!',
    })
  }
}

export function newDirectoryController() {
  return new DirectoryController(
    newDirectoryServiceImpl(newPrismaDirectoryRepositoryImpl(prismaClient)),
  )
}
