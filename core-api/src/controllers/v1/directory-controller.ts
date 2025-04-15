import type {Context} from 'hono'
import type {BlankEnv, BlankInput} from 'hono/types'
import {
  newPrismaDirectoryRepositoryImpl,
  type AbstractDirectoryRepository,
} from '../../repositories'
import {newDirectoryServiceImpl} from '../../services/impl/directory-service.impl'
import {prismaClient} from '../../libs'

export class DirectoryController {
  constructor(private readonly directoryService: AbstractDirectoryRepository) {}

  async handleGetDirectoriesWithFilter(c: Context<BlankEnv, '/', BlankInput>) {
    return c.json({
      message: 'Get directories with filter!',
    })
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
