export interface FileEntity {
  id: string
  name: string
  resourcePath: string
  size: number
  contentType: string
  metadata: string
  createdAt: Date
  updatedAt: Date
  parentDirId?: string
  createdBy: string
  updatedBy: string
}
