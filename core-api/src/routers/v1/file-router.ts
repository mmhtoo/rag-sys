import {Hono} from 'hono'
import {newFileController} from '../../controllers'

export const v1FileRouter = new Hono()
const fileController = newFileController()

v1FileRouter.get('/', fileController.handleGetFilesWithFilter)
v1FileRouter.post('/', fileController.handleUploadFileorFiles)
v1FileRouter.get('/:id', fileController.handleGetFileById)
v1FileRouter.delete('/:id', fileController.handleDeleteById)
v1FileRouter.put('/:id', fileController.handleUpdateById)
