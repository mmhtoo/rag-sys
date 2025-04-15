import type {
  CountDirectoryInput,
  CountDirectoryResult,
  CreateDirectoryInput,
  CreateDirectoryResult,
  DeleteDirectoryInput,
  DeleteDirectoryResult,
  GetDirectoryDetailInput,
  GetDirectoryDetailResult,
  GetDirectoryListInput,
  GetDirectoryListResult,
  UpdateDirectoryInput,
  UpdateDirectoryResult,
} from '../repositories'

// abstraction for directory service
export abstract class AbstractDirectoryService {
  abstract createDirectory(
    input: CreateDirectoryInputDto,
  ): Promise<CreateDirectoryResultDto>
  abstract getDirectoryDetail(
    input: GetDirectoryDetailInputDto,
  ): Promise<GetDirectoryDetailResultDto>
  abstract getDirectoryList(
    input: GetDirectoryListInputDto,
  ): Promise<GetDirectoryListResultDto>
  abstract updateDirectory(
    input: UpdateDirectoryInputDto,
  ): Promise<UpdateDirectoryResultDto>
  abstract deleteDirectory(
    input: DeleteDirectoryInputDto,
  ): Promise<DeleteDirectoryResultDto>
  abstract countDirectory(
    input: CountDirectoryInputDto,
  ): Promise<CountDirectoryResultDto>
}

export interface CreateDirectoryInputDto extends CreateDirectoryInput {}
export type CreateDirectoryResultDto = CreateDirectoryResult

export interface GetDirectoryDetailInputDto extends GetDirectoryDetailInput {}
export type GetDirectoryDetailResultDto = GetDirectoryDetailResult

export interface GetDirectoryListInputDto extends GetDirectoryListInput {}
export type GetDirectoryListResultDto = GetDirectoryListResult

export interface UpdateDirectoryInputDto extends UpdateDirectoryInput {}
export type UpdateDirectoryResultDto = UpdateDirectoryResult

export interface DeleteDirectoryInputDto extends DeleteDirectoryInput {}
export type DeleteDirectoryResultDto = DeleteDirectoryResult

export interface CountDirectoryInputDto extends CountDirectoryInput {}
export type CountDirectoryResultDto = CountDirectoryResult
