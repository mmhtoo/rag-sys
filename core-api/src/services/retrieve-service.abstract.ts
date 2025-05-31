import {RetriveServiceImpl} from './impl/retrieve-service.impl'
import {newVectorServiceImpl} from './impl/vectory-service.impl'

export type SematicRetrieveInputDto = {
  query: string
  metadata?: Record<string, string | number>
}

export type SematicRetrieveResultData = {
  id: string
  content: string
  metadatas?: Record<string, string | number>
}

export type SematicRetrieveResultDto = Promise<SematicRetrieveResultData[]>

export abstract class AbstractRetriveService {
  abstract sematicRetrieve(
    input: SematicRetrieveInputDto,
  ): SematicRetrieveResultDto
}

export function newRetriveServiceImpl(): AbstractRetriveService {
  return new RetriveServiceImpl(newVectorServiceImpl())
}
