import {env} from '../../configs'
import {makeLog} from '../../helpers'
import {
  IncludeEnum,
  type QueryResult,
} from '../../repositories/vector-repository.abstract'
import type {
  AbstractRetriveService,
  SematicRetrieveInputDto,
  SematicRetrieveResultData,
  SematicRetrieveResultDto,
} from '../retrieve-service.abstract'
import type {
  AbstractVectorService,
  QueryResultDto,
} from '../vector-service.abstract'

export class RetriveServiceImpl implements AbstractRetriveService {
  constructor(private readonly vectorService: AbstractVectorService) {}

  async sematicRetrieve(
    input: SematicRetrieveInputDto,
  ): SematicRetrieveResultDto {
    try {
      makeLog('info', '===== sematicRetrieve with input ===== \n', input)
      const res = await this.vectorService.query({
        collectionName: env.DEFAULT_VECTOR_COLLECTION_NAME,
        metadata: input.metadata,
        query: input.query,
        selectFields: [
          IncludeEnum.Documents,
          IncludeEnum.Metadatas,
          IncludeEnum.Distances,
        ],
      })
      return this.flattenedQueryResult(res)
    } catch (e) {
      makeLog('error', '===== sematicRetrieve error =====', e)
      throw e
    }
  }

  private flattenedQueryResult(
    queryResult: QueryResultDto,
  ): SematicRetrieveResultData[] {
    const ids = queryResult.ids?.flatMap((ids) => ids) || []
    const docs = queryResult.documents?.flatMap((docs) => docs) || []
    const metadatas = queryResult.metadatas?.flatMap((metadatas) => metadatas)
    const distances =
      queryResult.distances?.flatMap((distances) => distances) || []
    return ids
      .map((_, index) => {
        return {
          id: ids[index] || '',
          content: docs[index] || '',
          metadatas: metadatas[index] || {},
        }
      })
      .filter((_, index) => {
        return distances[index] <= 1.2
      })
  }
}
