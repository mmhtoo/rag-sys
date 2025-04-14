import 'dotenv/config'
import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {env} from './configs'

const app = new Hono()

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
