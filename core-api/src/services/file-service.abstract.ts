import type {
  CountByParentDirIdInput,
  CountByParentDirIdResult,
  CreateFileInput,
  CreateFileResult,
  DeleteFileInput,
  DeleteFileResult,
  GetFileDetailInput,
  GetFileDetailResult,
  GetFileListInput,
  GetFileListResult,
  UpdateFileInput,
  UpdateFileResult,
} from '../repositories'

// abstraction for file service
export abstract class AbstractFileService {
  abstract createFile(input: CreateFileInputDto): Promise<CreateFileResultDto>
  abstract getFileDetail(
    input: GetFileDetailInputDto,
  ): Promise<GetFileDetailResultDto>
  abstract getFileList(
    input: GetFileListInputDto,
  ): Promise<GetFileListResultDto>
  abstract updateFile(input: UpdateFileInputDto): Promise<UpdateFileResultDto>
  abstract deleteFile(input: DeleteFileInputDto): Promise<DeleteFileResultDto>
  abstract countByParentDirId(
    input: CountByParentDirIdInputDto,
  ): Promise<CountByParentDirIdResultDto>
}

export interface CreateFileInputDto extends CreateFileInput {
  file: File
}
export type CreateFileResultDto = CreateFileResult

export interface GetFileDetailInputDto extends GetFileDetailInput {}
export type GetFileDetailResultDto = GetFileDetailResult

export interface GetFileListInputDto extends GetFileListInput {}
export type GetFileListResultDto = GetFileListResult

export interface UpdateFileInputDto extends UpdateFileInput {
  file: File
}
export type UpdateFileResultDto = UpdateFileResult

export interface DeleteFileInputDto extends DeleteFileInput {}
export type DeleteFileResultDto = DeleteFileResult

export interface CountByParentDirIdInputDto extends CountByParentDirIdInput {}
export type CountByParentDirIdResultDto = CountByParentDirIdResult
