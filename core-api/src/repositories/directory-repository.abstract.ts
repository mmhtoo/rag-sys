import type {DirectoryEntity} from '../entities'

// abstraction for directory repo
export abstract class AbstractDirectoryRepository {
  abstract createDirectory(
    input: CreateDirectoryInput,
  ): Promise<CreateDirectoryResult | null>
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
  abstract countDirectory(
    input: CountDirectoryInput,
  ): Promise<CountDirectoryResult>
}

export interface CreateDirectoryInput {
  name: string
  parentDirId?: string
  createdBy: string
}
export type CreateDirectoryResult = DirectoryEntity | null

export interface GetDirectoryDetailInput {
  id: string
}
export type GetDirectoryDetailResult = DirectoryEntity | null

export interface GetDirectoryListInput {
  parentDirId?: string
  page?: number
  pageSize?: number
  name?: string
  createdBy?: string
  updatedBy?: string
  fromDate?: Date
  toDate?: Date
  orderBy?: 'name' | 'createdAt' | 'updatedAt'
  orderDirection?: 'asc' | 'desc'
}
export interface GetDirectoryListResult {
  items: DirectoryEntity[]
  pagination: {
    total: number
    currentPage: number
    totalPage: number
  }
}

export interface UpdateDirectoryInput
  extends Partial<Omit<CreateDirectoryInput, 'createdBy'>> {
  id: string
  updatedBy: string
}

export type UpdateDirectoryResult = Pick<DirectoryEntity, 'id'> | null

export interface DeleteDirectoryInput {
  id: string
}
export type DeleteDirectoryResult = void

export interface CountDirectoryInput {
  parentDirId?: string
}

export type CountDirectoryResult = number
