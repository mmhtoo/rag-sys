import type {FileEntity} from '../entities'

// abstraction for file repo
export abstract class AbstractFileRepository {
  abstract createFile(input: CreateFileInput): Promise<CreateFileResult>
  abstract getFileDetail(
    input: GetFileDetailInput,
  ): Promise<GetFileDetailResult>
  abstract getFileList(input: GetFileListInput): Promise<GetFileListResult>
  abstract updateFile(input: UpdateFileInput): Promise<UpdateFileResult>
  abstract deleteFile(input: DeleteFileInput): Promise<DeleteFileResult>
  abstract countByParentDirId(
    input: CountByParentDirIdInput,
  ): Promise<CountByParentDirIdResult>
}

export interface CreateFileInput {
  name: string
  resourcePath: string
  size: number
  contentType: string
  metadata: string
  parentDirId?: string | null
  createdBy: string
  status?: FileEntity['status']
}
export type CreateFileResult = FileEntity | null

export interface GetFileDetailInput {
  id: string
}
export type GetFileDetailResult = FileEntity | null

export interface GetFileListInput {
  parentDirId?: string | null
  page?: number
  pageSize?: number
  name?: string
  contentType?: string
  createdBy?: string
  updatedBy?: string
  fromDate?: Date
  toDate?: Date
  orderBy?: 'name' | 'createdAt' | 'updatedAt'
  orderDirection?: 'asc' | 'desc'
  resourcePath?: string
}
export interface GetFileListResult {
  items: FileEntity[]
  pagination: {
    total: number
    currentPage: number
    totalPage: number
  }
}

export interface UpdateFileInput
  extends Partial<Omit<CreateFileInput, 'createdBy'>> {
  id: string
  updatedBy: string
}
export type UpdateFileResult = void

export interface DeleteFileInput {
  id: string
}
export type DeleteFileResult = {
  resourcePath?: string
}

export interface CountByParentDirIdInput {
  parentDirId?: string | null
  excludeFileId?: string
  fileName?: string
  contentType?: string
  resourcePath?: string
  fromDate?: Date
  toDate?: Date
}
export type CountByParentDirIdResult = number
