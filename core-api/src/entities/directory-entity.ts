export interface DirectoryEntity {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  parentDirId?: string
  createdBy: string
  updatedBy: string
}
