import type {Context} from 'hono'
import type {BlankEnv} from 'hono/types'

export class QueryController {
  constructor() {}

  async handleQueryRAG(c: Context<BlankEnv, '/', BlankEnv>) {
    return c.json({
      message: 'Query RAG!',
    })
  }
}

export function newQueryController() {
  return new QueryController()
}
