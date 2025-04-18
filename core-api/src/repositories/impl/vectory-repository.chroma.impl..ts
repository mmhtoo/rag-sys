import type {ChromaClient, Collection} from 'chromadb'
import {
  IncludeEnum,
  type AbstractVectorRepository,
  type AddDocumentsInput,
  type AddDocumentsResult,
  type CreateCollectionInput,
  type CreateCollectionResult,
  type DeleteCollectionInput,
  type DeleteDocumentsInput,
  type DeleteDocumentsResult,
  type HealthCheckResult,
  type QueryInput,
  type QueryResult,
} from '../vector-repository.abstract'
import {makeLog} from '../../helpers'
import {chromaClient, ollamaEmbeddingFunction} from '../../libs'
import {randomUUID} from 'crypto'

export class ChromaVectorRepositoryImpl implements AbstractVectorRepository {
  constructor(private readonly chromaClient: ChromaClient) {}

  async query(input: QueryInput): Promise<QueryResult> {
    try {
      makeLog('info', '===== query with input ===== \n', input)
      const collection = await this.getCollection(input.collectionName)
      const res = await collection.query({
        nResults: input.numberOfResults || 5,
        queryEmbeddings: input.embeddings || [],
        where: input.metadata || {},
        include: input.selectFields || [IncludeEnum.Documents],
      })
      makeLog('info', '===== query result ===== \n', res)
      return res
    } catch (e) {
      makeLog('error', '===== query error =====', e)
      throw e
    }
  }

  async deleteDocuments(
    input: DeleteDocumentsInput,
  ): Promise<DeleteDocumentsResult> {
    try {
      makeLog('info', '===== deleteDocuments with input ===== \n', input)
      const collection = await this.getCollection(input.collectionName)
      await collection.delete({
        ids: input.ids,
        where: input.metadata,
      })
      return
    } catch (e) {
      makeLog('error', '===== deleteDocuments error =====', e)
      throw e
    }
  }

  async createCollection(
    input: CreateCollectionInput,
  ): Promise<CreateCollectionResult> {
    try {
      makeLog('info', '===== createCollection with input ===== \n', input)
      const res = await this.chromaClient.createCollection({
        name: input.name,
        metadata: input.metadata,
      })
      return {
        id: res.id,
      }
    } catch (e) {
      makeLog('error', '===== createCollection error =====', e)
      throw e
    }
  }

  async deleteCollection(input: DeleteCollectionInput): Promise<void> {
    try {
      makeLog('info', '===== deleteCollection with input ===== \n', input)
      await this.chromaClient.deleteCollection({name: input.name})
      makeLog('info', '===== deleteCollection finished ===== \n')
      return
    } catch (e) {
      makeLog('error', '===== deleteCollection error =====', e)
      throw e
    }
  }

  async addDocuments(input: AddDocumentsInput): Promise<AddDocumentsResult> {
    try {
      makeLog('info', '===== addDocuments with input ===== \n', input)
      const collection = await this.getCollection(input.collectionName)
      const params: {
        ids: string[]
        documents: string[]
        metadatas: Record<string, string | number>[]
      } = {
        ids: [],
        documents: [],
        metadatas: [],
      }
      for (const doc of input.documents) {
        params.ids.push(randomUUID())
        params.documents.push(doc.content)
        params.metadatas.push(doc.metadata)
      }
      await collection.add(params)
      return {
        ids: params.ids,
      }
    } catch (e) {
      makeLog('error', '===== addDocuments error =====', e)
      throw e
    }
  }

  async healthcheck(): Promise<HealthCheckResult> {
    try {
      makeLog('info', '===== healthcheck ===== \n')
      return await this.chromaClient.heartbeat()
    } catch (e) {
      makeLog('error', '===== healthcheck error =====', e)
      throw e
    }
  }

  private async getCollection(name: string): Promise<Collection> {
    return await this.chromaClient.getCollection({
      name,
      embeddingFunction: ollamaEmbeddingFunction,
    })
  }
}

export function newChromaVectoryRepository() {
  return new ChromaVectorRepositoryImpl(chromaClient)
}
