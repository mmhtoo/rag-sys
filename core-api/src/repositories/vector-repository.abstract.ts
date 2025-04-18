export abstract class AbstractVectorRepository {
  abstract createCollection(
    input: CreateCollectionInput,
  ): Promise<CreateCollectionResult>
  abstract deleteCollection(
    input: DeleteCollectionInput,
  ): Promise<DeleteCollectionResult>
  abstract addDocuments(input: AddDocumentsInput): Promise<AddDocumentsResult>
  abstract healthcheck(): Promise<HealthCheckResult>
  abstract deleteDocuments(
    input: DeleteDocumentsInput,
  ): Promise<DeleteDocumentsResult>
  abstract query(input: QueryInput): Promise<QueryResult>
}

export interface CreateCollectionInput {
  name: string
  metadata?: Record<string, string>
}
export type CreateCollectionResult = {
  id: string
}

export interface DeleteCollectionInput {
  name: string
}
export type DeleteCollectionResult = void

export interface AddDocumentsInput {
  collectionName: string
  documents: {
    content: string
    metadata: Record<string, string | number>
  }[]
}
export type AddDocumentsResult = {
  ids: string[]
}

export type HealthCheckResult = number

export interface DeleteDocumentsInput {
  ids?: string[]
  collectionName: string
  metadata?: Record<string, string | number>
}
export type DeleteDocumentsResult = void

export enum IncludeEnum {
  Documents = 'documents',
  Embeddings = 'embeddings',
  Metadatas = 'metadatas',
  Distances = 'distances',
}

export interface QueryInput {
  collectionName: string
  metadata?: Record<string, string | number>
  embeddings?: number[]
  numberOfResults?: number
  selectFields?: IncludeEnum[]
}

export interface QueryResult {
  ids: string[][]
  embeddings: number[][] | null | any
  documents: (string | null)[][]
  metadatas: (Record<string, any> | null)[][]
  distances: number[][] | null
  included: IncludeEnum[]
}
