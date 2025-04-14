import type {Context} from 'hono'
import type {BlankEnv, BlankInput} from 'hono/types'

export class FileController {
  constructor() {}

  async handleUploadFileorFiles(c: Context<BlankEnv, '/', BlankInput>) {
    return c.json({
      message: 'Upload file or files!',
    })
  }

  async handleGetFilesWithFilter(c: Context<BlankEnv, '/', BlankInput>) {
    return c.json({
      message: 'Get files with filter!',
    })
  }

  async handleGetFileById(c: Context<BlankEnv, '/:id', BlankInput>) {
    return c.json({
      message: 'Get Detail file!',
    })
  }

  async handleDeleteById(c: Context<BlankEnv, '/:id', BlankInput>) {
    return c.json({
      message: 'Delete file',
    })
  }

  async handleUpdateById(c: Context<BlankEnv, '/:id', BlankInput>) {
    return c.json({
      message: 'Update file!',
    })
  }
}

export function newFileController() {
  return new FileController()
}
