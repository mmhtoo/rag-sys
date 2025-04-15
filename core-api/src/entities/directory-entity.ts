export interface DirectoryEntity {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
  parentDirId: string | null
  createdBy: string
  updatedBy: string
}
