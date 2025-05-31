import type {Context} from 'hono'
import type {BlankEnv} from 'hono/types'
import {
  newRetriveServiceImpl,
  type AbstractRetriveService,
} from '../../services'
import {dataResponse, errorResponse} from '../../helpers'

export class QueryController {
  constructor(private readonly retriveService: AbstractRetriveService) {}

  async handleQueryRAG(c: Context<BlankEnv, '/', BlankEnv>) {
    try {
      const query = c.req.query('query') || ''
      const metadata = c.req.query('metadata')
      const res = await this.retriveService.sematicRetrieve({
        query,
        metadata: metadata ? JSON.parse(metadata || '{}') : undefined,
      })
      return c.json(dataResponse('Success!', res))
    } catch (e) {
      c.status(500)
      return c.json(
        errorResponse(
          (e as any)?.message || 'Failed to query!',
          'Internal Server Error!',
        ),
      )
    }
  }
}

export function newQueryController() {
  return new QueryController(newRetriveServiceImpl())
}
