import 'dotenv/config'
import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {env} from './configs'
import {v1DirectoryRouter, v1FileRouter, v1QueryRouter} from './routers'
import {newEmbeddingWorker} from './workers/embedding_worker'

const app = new Hono()

// routers registration
app.get('/ping', (c) => c.json({message: 'pong'}))
app.route('/api/v1/directories', v1DirectoryRouter)
app.route('/api/v1/files', v1FileRouter)
app.route('/api/v1/query', v1QueryRouter)

serve(
  {
    fetch: app.fetch,
    port: Number(env.PORT),
  },
  async (info) => {
    const embedWorker = newEmbeddingWorker()
    const worker = embedWorker.getWorker()
    console.log(`Server is running on http://localhost:${info.port}`)
    process.on('SIGINT', () => {
      console.log('Received SIGINT. Shutting down...')
      worker?.close()
      process.exit(0)
    })
    process.on('SIGTERM', () => {
      console.log('Received SIGNTERM. Shutting down...')
      worker?.close()
      process.exit(0)
    })
  },
)
