import type {EmbeddingWorkerData} from '../workers/embedding_worker'

export abstract class AbstractQueueService {
  abstract addEmbedingJob(input: AddEmbeddingJobInputDto): Promise<void>
}

export type AddEmbeddingJobInputDto = EmbeddingWorkerData
