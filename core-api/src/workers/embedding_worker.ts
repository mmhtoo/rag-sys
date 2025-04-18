import {Job, Worker} from 'bullmq'
import {env} from '../configs'
import {
  newFileServiceImpl,
  type AbstractVectorService,
  type FileServiceImpl,
} from '../services'
import {newVectorServiceImpl} from '../services/impl/vectory-service.impl'
import {
  newBucketServiceImpl,
  type BucketServiceImpl,
} from '../services/impl/bucket-service.impl'
import type Redis from 'ioredis'
import {redis} from '../libs'

export class EmbeddingWorker {
  private readonly worker: Worker

  constructor(
    private vectorService: AbstractVectorService,
    private bucketService: BucketServiceImpl,
    private fileService: FileServiceImpl,
    private redis: Redis,
  ) {
    this.worker = new Worker<EmbeddingWorkerData>(
      env.DEFAULT_QUEUE_NAME,
      this.handleJob,
      {
        connection: this.redis,
      },
    )
  }

  private async handleJob(job: Job<EmbeddingWorkerData, any, string>) {
    try {
      console.log('===== handleJob with input ===== \n', job.data)
    } catch (e) {
      console.log('===== handleJob error =====', e)
      throw e
    }
  }

  getWorker(): Worker {
    return this.worker
  }
}

export type EmbeddingWorkerData = {
  fileId: string
  metadata: Record<string, string | number>
  bucketName: string
  resourcePath: string
}

export function newEmbeddingWorker() {
  return new EmbeddingWorker(
    newVectorServiceImpl(),
    newBucketServiceImpl(),
    newFileServiceImpl(),
    redis,
  )
}
