import type {DirectoryEntity} from '../entities'

// abstraction for directory repo
export abstract class AbstractDirectoryRepository {
  abstract createDirectory(
    input: CreateDirectoryInput,
  ): Promise<CreateDirectoryResult>
  abstract getDirectoryDetail(
    input: GetDirectoryDetailInput,
  ): Promise<GetDirectoryDetailResult>
  abstract getDirectoryList(
    input: GetDirectoryListInput,
  ): Promise<GetDirectoryListResult>
  abstract updateDirectory(
    input: UpdateDirectoryInput,
  ): Promise<UpdateDirectoryResult>
  abstract deleteDirectory(
    input: DeleteDirectoryInput,
  ): Promise<DeleteDirectoryResult>
}

export interface CreateDirectoryInput {
  name: string
  parentDirId?: string
  createdBy: string
}
export interface CreateDirectoryResult extends DirectoryEntity {}

export interface GetDirectoryDetailInput {
  id: string
}
export interface GetDirectoryDetailResult extends DirectoryEntity {}

export interface GetDirectoryListInput {
  parentDirId?: string
  page?: number
  pageSize?: number
  name?: string
  createdBy?: string
  updatedBy?: string
  fromDate?: Date
  toDate?: Date
}
export interface GetDirectoryListResult {
  items: DirectoryEntity[]
  pagination: {
    total: number
    currentPage: number
    totalPage: number
  }
}

export interface UpdateDirectoryInput extends CreateDirectoryInput {
  id: string
}

export type UpdateDirectoryResult = void

export interface DeleteDirectoryInput {
  id: string
}
export type DeleteDirectoryResult = void
