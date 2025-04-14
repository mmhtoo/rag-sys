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
}

export interface CreateFileInput {
  name: string
  resourcePath: string
  size: number
  contentType: string
  metadata: string
  parentDirId?: string
  createdBy: string
}
export interface CreateFileResult extends FileEntity {}

export interface GetFileDetailInput {
  id: string
}
export interface GetFileDetailResult extends FileEntity {}

export interface GetFileListInput {
  parentDirId?: string
  page?: number
  pageSize?: number
  name?: string
  contentType?: string
  createdBy?: string
  updatedBy?: string
  fromDate?: Date
  toDate?: Date
}
export interface GetFileListResult {
  items: FileEntity[]
  pagination: {
    total: number
    currentPage: number
    totalPage: number
  }
}

export interface UpdateFileInput extends CreateFileInput {
  id: string
}
export type UpdateFileResult = void

export interface DeleteFileInput {
  id: string
}
export type DeleteFileResult = void
