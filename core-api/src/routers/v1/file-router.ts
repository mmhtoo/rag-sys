import {Hono} from 'hono'
import {newFileController} from '../../controllers'
import {zValidator} from '@hono/zod-validator'
import {
  createFileSchema,
  getFilesWithFilterSchema,
  updateFileSchema,
} from '../../validation-schemas/v1/file-schema'
import {zodCallback} from '../../helpers'

export const v1FileRouter = new Hono()
const fileController = newFileController()

v1FileRouter.get(
  '/',
  zValidator('query', getFilesWithFilterSchema, zodCallback),
  (c) => fileController.handleGetFilesWithFilter(c),
)
v1FileRouter.get('/proxy', (c) => fileController.handleProxyGetFile(c))
v1FileRouter.post('/', zValidator('form', createFileSchema, zodCallback), (c) =>
  fileController.handleUploadFile(c),
)
v1FileRouter.get('/:id', (c) => fileController.handleGetFileById(c))
v1FileRouter.delete('/:id', (c) => fileController.handleDeleteById(c))
v1FileRouter.put(
  '/:id',
  zValidator('form', updateFileSchema, zodCallback),
  (c) => fileController.handleUpdateById(c),
)
