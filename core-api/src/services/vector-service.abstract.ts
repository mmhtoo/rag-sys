import type {
  CreateCollectionInput,
  CreateCollectionResult,
  DeleteCollectionInput,
  DeleteCollectionResult,
  AddDocumentsInput,
  AddDocumentsResult,
  HealthCheckResult,
  DeleteDocumentsInput,
  DeleteDocumentsResult,
  QueryInput,
  QueryResult,
} from '../repositories/vector-repository.abstract'

export abstract class AbstractVectorService {
  abstract createCollection(
    input: CreateCollectionInputDto,
  ): Promise<CreateCollectionResultDto>
  abstract deleteCollection(
    input: DeleteCollectionInputDto,
  ): Promise<DeleteCollectionResultDto>
  abstract addDocuments(
    input: AddDocumentsInputDto,
  ): Promise<AddDocumentsResultDto>
  abstract healthcheck(): Promise<HealthCheckResultDto>
  abstract deleteDocuments(
    input: DeleteDocumentsInputDto,
  ): Promise<DeleteDocumentsResultDto>
  abstract query(input: QueryInputDto): Promise<QueryResultDto>
}

export interface CreateCollectionInputDto extends CreateCollectionInput {}
export type CreateCollectionResultDto = CreateCollectionResult

export interface DeleteCollectionInputDto extends DeleteCollectionInput {}
export type DeleteCollectionResultDto = DeleteCollectionResult

export interface AddDocumentsInputDto extends AddDocumentsInput {}
export type AddDocumentsResultDto = AddDocumentsResult

export type HealthCheckResultDto = HealthCheckResult

export interface DeleteDocumentsInputDto extends DeleteDocumentsInput {}
export type DeleteDocumentsResultDto = DeleteDocumentsResult

export interface QueryInputDto extends QueryInput {}
export type QueryResultDto = QueryResult
