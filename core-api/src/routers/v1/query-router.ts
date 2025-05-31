import {Hono} from 'hono'
import {newQueryController} from '../../controllers'

export const v1QueryRouter = new Hono()
const queryController = newQueryController()
v1QueryRouter.get('/', (c) => queryController.handleQueryRAG(c))
