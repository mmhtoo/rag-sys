import {Queue} from 'bullmq'
import {env} from '../configs'
import {redis} from './redis'
import type {EmbeddingWorkerData} from '../workers/embedding_worker'

export const embedQueue = new Queue<EmbeddingWorkerData>(
  env.DEFAULT_QUEUE_NAME,
  {
    connection: redis,
  },
)
