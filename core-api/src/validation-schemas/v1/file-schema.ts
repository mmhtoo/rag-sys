import {z} from 'zod'
import {env} from '../../configs'

// create file schema
export const createFileSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required!',
    })
    .max(100, {message: 'Name must be at most 100 characters long!'}),
  parentDirId: z
    .string({
      invalid_type_error: 'Parent directory id is invalid!',
    })
    .optional(),
  metadata: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val)
        if (!parsed.category || !parsed.language) return false
        return true
      } catch (_) {
        return false
      }
    },
    {
      message:
        'Invalid json string, required category and language as mandatory fields!',
    },
  ),
  file: z
    .instanceof(File)
    .refine(
      (file) => {
        console.log(file.type)
        // check file type
        const contentType = file.type
        if (env.ALLOWED_FILE_TYPES.includes(contentType)) return true
        return false
      },
      {
        message:
          'File type is not allowed, only allow ' +
          env.ALLOWED_FILE_TYPES +
          '.',
      },
    )
    .refine(
      (file) => {
        // check file size
        const size = file.size
        if (size > env.MAX_FILE_SIZE) return false
        return true
      },
      {
        message:
          'File size is too large, max size is ' +
          env.MAX_FILE_SIZE +
          ' bytes.',
      },
    ),
})
export type CreateFileReqDto = z.infer<typeof createFileSchema>

export const getFilesWithFilterSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Name is invalid!',
    })
    .optional(),
  contentType: z
    .string({
      invalid_type_error: 'Content type is invalid!',
    })
    .optional(),
  createdBy: z
    .string({
      invalid_type_error: 'Created by is invalid!',
    })
    .optional(),
  updatedBy: z
    .string({
      invalid_type_error: 'Updated by is invalid!',
    })
    .optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  orderBy: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
  orderDirection: z.enum(['asc', 'desc']).optional(),
  parentDirId: z
    .string({
      invalid_type_error: 'Parent directory id is invalid!',
    })
    .optional(),
  page: z
    .string()
    .regex(/^\d+$/, {
      message: 'Must be a string of digits',
    })
    .optional()
    .default('1'),
  pageSize: z
    .string()
    .regex(/^\d+$/, {
      message: 'Must be a string of digits',
    })
    .optional(),
  resourcePath: z.string().optional(),
})
export type GetFilesWithFilterReqDto = z.infer<typeof getFilesWithFilterSchema>

export const updateFileSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required!',
    })
    .max(100, {message: 'Name must be at most 100 characters long!'}),
  parentDirId: z
    .string({
      invalid_type_error: 'Parent directory id is invalid!',
    })
    .optional(),
  metadata: z
    .string()
    .optional()
    .refine(
      (val) => {
        try {
          if (!val) return true
          const parsed = JSON.parse(val)
          if (!parsed.category || !parsed.language) return false
          return true
        } catch (_) {
          return false
        }
      },
      {
        message:
          'Invalid json string, required category and language as mandatory fields!',
      },
    ),
  file: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => {
        if (!file) return true
        // check file type
        const contentType = file.type
        if (env.ALLOWED_FILE_TYPES.includes(contentType)) return true
        return false
      },
      {
        message:
          'File type is not allowed, only allow ' +
          env.ALLOWED_FILE_TYPES +
          '.',
      },
    )
    .refine(
      (file) => {
        if (!file) return true
        // check file size
        const size = file.size
        if (size > env.MAX_FILE_SIZE) return false
        return true
      },
      {
        message:
          'File size is too large, max size is ' +
          env.MAX_FILE_SIZE +
          ' bytes.',
      },
    ),
})
export type UpdateFileReqDto = z.infer<typeof updateFileSchema>
