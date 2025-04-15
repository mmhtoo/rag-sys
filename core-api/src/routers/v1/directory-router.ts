import {Hono} from 'hono'
import {newDirectoryController} from '../../controllers'

export const v1DirectoryRouter = new Hono()
const v1DirectoryController = newDirectoryController()
