import 'dotenv/config'
import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {env} from './configs'
import {v1DirectoryRouter, v1FileRouter, v1QueryRouter} from './routers'

const app = new Hono()
app.get('/ping', (c) => c.json({message: 'pong'}))

// routers registration
app.route('/api/v1/directories', v1DirectoryRouter)
app.route('/api/v1/files', v1FileRouter)
app.route('/api/v1/query', v1QueryRouter)

serve(
  {
    fetch: app.fetch,
    port: Number(env.PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
