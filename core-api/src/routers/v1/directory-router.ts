import {Hono} from 'hono'
import {newDirectoryController} from '../../controllers'
import {zValidator} from '@hono/zod-validator'
import {
  createDirectorySchema,
  getDirectoryFilterSchema,
} from '../../validation-schemas/v1'
import {zodCallback} from '../../helpers'

export const v1DirectoryRouter = new Hono()
const v1DirectoryController = newDirectoryController()

v1DirectoryRouter.get(
  '/',
  zValidator('query', getDirectoryFilterSchema, zodCallback),
  (c) => v1DirectoryController.handleGetDirectoriesWithFilter(c),
)
v1DirectoryRouter.post(
  '/',
  zValidator('json', createDirectorySchema, zodCallback),
  (c) => v1DirectoryController.handleCreateDirectory(c),
)
v1DirectoryRouter.get('/:id', (c) =>
  v1DirectoryController.handleGetDirectoryById(c),
)
v1DirectoryRouter.delete('/:id', (c) =>
  v1DirectoryController.handleDeleteById(c),
)
v1DirectoryRouter.put('/:id', (c) => v1DirectoryController.handleUpdateById(c))
