import type {Queue} from 'bullmq'
import type {
  AbstractQueueService,
  AddEmbeddingJobInputDto,
} from '../queue-service.abstract'
import {embedQueue} from '../../libs'
import {makeLog} from '../../helpers'
import type {EmbeddingWorkerData} from '../../workers/embedding_worker'

export class BullMqQueueServiceImpl implements AbstractQueueService {
  constructor(private readonly embedQueue: Queue<EmbeddingWorkerData>) {}

  async addEmbedingJob(input: AddEmbeddingJobInputDto): Promise<void> {
    try {
      makeLog('info', '===== addEmbedingJob with input ===== \n', input)
      const res = await this.embedQueue.add('embed-file', input)
      makeLog('info', '===== addEmbedingJob finished with result ===== \n', res)
      return
    } catch (e) {
      makeLog('error', '===== addEmbedingJob error =====', e)
      throw e
    }
  }
}

export function newBullMqQueueServiceImpl() {
  return new BullMqQueueServiceImpl(embedQueue)
}
