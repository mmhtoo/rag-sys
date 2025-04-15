export interface FileEntity {
  id: string
  name: string
  resourcePath: string
  size: number
  contentType: string
  metadata: string
  createdAt: Date
  updatedAt: Date
  parentDirId?: string | null
  createdBy: string
  updatedBy: string
  status:
    | 'upload_queued'
    | 'upload_failed'
    | 'upload_completed'
    | 'sync_queued'
    | 'sync_failed'
    | 'sync_completed'
    | 'unknown'
    | null
}
