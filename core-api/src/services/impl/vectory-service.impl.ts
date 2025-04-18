import {makeLog} from '../../helpers'
import type {AbstractVectorRepository} from '../../repositories/vector-repository.abstract'
import type {
  AbstractVectorService,
  AddDocumentsInputDto,
  AddDocumentsResultDto,
  CreateCollectionInputDto,
  CreateCollectionResultDto,
  DeleteCollectionInputDto,
  DeleteCollectionResultDto,
  DeleteDocumentsInputDto,
  DeleteDocumentsResultDto,
  HealthCheckResultDto,
  QueryInputDto,
  QueryResultDto,
} from '../vector-service.abstract'

export class VectorServiceImpl implements AbstractVectorService {
  constructor(private readonly vectoryRepository: AbstractVectorRepository) {}

  async createCollection(
    input: CreateCollectionInputDto,
  ): Promise<CreateCollectionResultDto> {
    try {
      makeLog('info', '===== createCollection with input ===== \n', input)
      const res = await this.vectoryRepository.createCollection({
        name: input.name,
        metadata: input.metadata,
      })
      return res
    } catch (e) {
      makeLog('error', '===== createCollection error =====', e)
      throw e
    }
  }

  async deleteCollection(
    input: DeleteCollectionInputDto,
  ): Promise<DeleteCollectionResultDto> {
    try {
      makeLog('info', '===== deleteCollection with input ===== \n', input)
      await this.vectoryRepository.deleteCollection({
        name: input.name,
      })
      return
    } catch (e) {
      makeLog('error', '===== deleteCollection error =====', e)
      throw e
    }
  }

  async addDocuments(
    input: AddDocumentsInputDto,
  ): Promise<AddDocumentsResultDto> {
    try {
      makeLog('info', '===== addDocuments with input ===== \n', input)
      const res = await this.vectoryRepository.addDocuments({
        collectionName: input.collectionName,
        documents: input.documents,
      })
      return res
    } catch (e) {
      makeLog('error', '===== addDocuments error =====', e)
      throw e
    }
  }

  async healthcheck(): Promise<HealthCheckResultDto> {
    try {
      makeLog('info', '===== healthcheck ===== \n')
      return await this.vectoryRepository.healthcheck()
    } catch (e) {
      makeLog('error', '===== healthcheck error =====', e)
      throw e
    }
  }

  async deleteDocuments(
    input: DeleteDocumentsInputDto,
  ): Promise<DeleteDocumentsResultDto> {
    try {
      makeLog('info', '===== deleteDocuments with input ===== \n', input)
      await this.vectoryRepository.deleteDocuments({
        ids: input.ids,
        collectionName: input.collectionName,
        metadata: input.metadata,
      })
      return
    } catch (e) {
      makeLog('error', '===== deleteDocuments error =====', e)
      throw e
    }
  }

  async query(input: QueryInputDto): Promise<QueryResultDto> {
    try {
      makeLog('info', '===== query with input ===== \n', input)
      const res = await this.vectoryRepository.query({
        collectionName: input.collectionName,
        metadata: input.metadata,
        embeddings: input.embeddings,
        numberOfResults: input.numberOfResults,
        selectFields: input.selectFields,
      })
      return res
    } catch (e) {
      makeLog('error', '===== query error =====', e)
      throw e
    }
  }
}
