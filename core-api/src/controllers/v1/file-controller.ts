import type {Context} from 'hono'
import type {BlankEnv, BlankInput} from 'hono/types'
import {
  newBullMqQueueServiceImpl,
  type AbstractFileService,
  type AbstractQueueService,
} from '../../services'
import {newFileServiceImpl} from '../../services/impl/file-service.impl'
import {baseResponse, dataResponse, errorResponse, makeLog} from '../../helpers'
import {StatusCodes} from 'http-status-codes'
import type {
  CreateFileReqDto,
  GetFilesWithFilterReqDto,
  UpdateFileReqDto,
} from '../../validation-schemas/v1/file-schema'
import type {AbstractBucketService} from '../../services/bucket-service.abstract'
import {newBucketServiceImpl} from '../../services/impl/bucket-service.impl'
import {env} from '../../configs'

export class FileController {
  constructor(
    private readonly fileService: AbstractFileService,
    private readonly bucketService: AbstractBucketService,
    private readonly queueService: AbstractQueueService,
  ) {}

  async handleUploadFile(c: Context<BlankEnv, '/', BlankInput>) {
    try {
      const reqBody = await c.req.parseBody<CreateFileReqDto>()
      makeLog('info', '===== handleUploadFile with input ===== \n')
      // just simulation before IAM
      const userId = c.req.header('x-user-id') || 'default'
      const res = await this.fileService.createFile({
        name: reqBody.name,
        parentDirId: reqBody.parentDirId,
        metadata: reqBody.metadata,
        size: reqBody.file.size,
        contentType: reqBody.file.type,
        resourcePath: '/',
        createdBy: userId,
        file: reqBody.file,
      })
      if (!res) {
        c.status(StatusCodes.INTERNAL_SERVER_ERROR)
        return c.json(
          errorResponse('Something went wrong!', 'Internal Server Error!'),
        )
      }
      if (res) {
        this.queueService.addEmbedingJob({
          payloads: [
            {
              fileId: res?.id,
              metadata: JSON.parse(reqBody.metadata),
              bucketName: env.DEFAULT_BUCKET_NAME,
              resourcePath: res.resourcePath,
              taskId: res.id,
              contentType: reqBody.file.type,
              originalFileName: reqBody.file.name,
            },
          ],
          syncId: 'syncId',
        })
      }
      makeLog(
        'info',
        '===== handleUploadFile finished with result ===== \n',
        res,
      )
      c.status(StatusCodes.CREATED)
      return c.json(dataResponse('File was created!', res))
    } catch (e) {
      makeLog('error', '===== handleUploadFile error =====', e)
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleGetFilesWithFilter(c: Context<BlankEnv, '/', BlankInput>) {
    try {
      makeLog(
        'info',
        '===== handleGetFilesWithFilter with input ===== \n',
        c.req.query(),
      )
      const queryPayload = c.req.query() as unknown as GetFilesWithFilterReqDto
      const res = await this.fileService.getFileList({
        page: Number(queryPayload.page),
        pageSize: Number(queryPayload.pageSize),
        name: queryPayload.name,
        contentType: queryPayload.contentType,
        createdBy: queryPayload.createdBy,
        updatedBy: queryPayload.updatedBy,
        fromDate: queryPayload.fromDate,
        toDate: queryPayload.toDate,
        orderBy: queryPayload.orderBy,
        orderDirection: queryPayload.orderDirection,
        parentDirId: queryPayload.parentDirId || null,
        resourcePath: queryPayload.resourcePath,
      })
      c.status(StatusCodes.OK)
      return c.json(dataResponse('Success!', res))
    } catch (e) {
      makeLog('error', '===== handleGetFilesWithFilter error =====', e)
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleGetFileById(c: Context<BlankEnv, '/:id', BlankInput>) {
    try {
      const id = c.req.param('id')
      makeLog('info', '===== handleGetFileById with input ===== \n', id)
      const fileDetail = await this.fileService.getFileDetail({
        id,
      })
      makeLog(
        'info',
        '===== handleGetFileById finished with result ===== \n',
        JSON.stringify(fileDetail, null, 2),
      )
      if (!fileDetail) {
        c.status(StatusCodes.NOT_FOUND)
        return c.json(errorResponse('File not found!', 'Not Found!'))
      }
      c.status(StatusCodes.OK)
      return c.json(dataResponse('File was found!', fileDetail))
    } catch (e) {
      makeLog('error', '===== handleGetFileById error =====', e)
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
      makeLog('info', '=====  handlDeleteById input =====', id)
      const res = await this.fileService.deleteFile({
        id,
      })
      c.status(StatusCodes.OK)
      return c.json(baseResponse('Successfully deleted!'))
    } catch (e) {
      makeLog('error', '===== handleDeleteById error =====', e)
      c.status(StatusCodes.INTERNAL_SERVER_ERROR)
      return c.json(
        errorResponse(
          'Failed to delete!',
          (e as any)?.message || 'Something went wrong!',
        ),
      )
    }
  }

  async handleUpdateById(c: Context<BlankEnv, '/:id', BlankInput>) {
    try {
      const id = c.req.param('id')
      const reqBody = (await c.req.parseBody()) as unknown as UpdateFileReqDto
      const userId = c.req.header('x-user-id') || 'default'
      makeLog('info', '===== handleUpdateById with input ===== \n', id)
      await this.fileService.updateFile({
        id,
        name: reqBody.name,
        metadata: reqBody.metadata,
        parentDirId: reqBody.parentDirId || null,
        file: reqBody.file,
        updatedBy: userId,
      })
      c.status(StatusCodes.OK)
      return c.json(baseResponse('Successfully updated!'))
    } catch (e) {
      makeLog('error', '===== handleUpdateById error =====', e)
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }

  async handleProxyGetFile(c: Context<BlankEnv, '/proxy', BlankInput>) {
    try {
      const resource = c.req.query('resource')
      makeLog('info', '===== handleProxyGetFile with input ===== \n', resource)
      if (!resource) {
        c.status(StatusCodes.BAD_REQUEST)
        return c.json(
          errorResponse('Resource query is required!', 'Validation failed!'),
        )
      }
      const res = await this.bucketService.getSignedUrl({
        path: resource,
        bucketName: env.DEFAULT_BUCKET_NAME,
      })
      if (!res || !res.signedUrl) {
        c.status(StatusCodes.NOT_FOUND)
        return c.json(errorResponse('File not found!', 'Not Found!'))
      }
      c.status(StatusCodes.OK)
      return c.redirect(res.signedUrl)
    } catch (e) {
      makeLog('error', '===== handleProxyGetFile error =====', e)
      c.status(500)
      return c.json(
        errorResponse(
          'Something went wrong, please try again later!',
          (e as any)?.message || 'Internal Server Error!',
        ),
      )
    }
  }
}

export function newFileController() {
  return new FileController(
    newFileServiceImpl(),
    newBucketServiceImpl(),
    newBullMqQueueServiceImpl(),
  )
}
